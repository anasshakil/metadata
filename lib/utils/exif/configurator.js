import fs from "node:fs/promises";
import path from "node:path";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { __getDir } from "../../../__root.js";
import { _generateHash } from "../crypto.js";

/**
 * @typedef {Object} ExifCustomTag
 * @property {string} name The name of the custom tag
 * @property {"string"} type The type of the custom tag's value. You can pass custom valid type in here which is suppported by exif tag group.
 * @property {"Exif" | "PDF"} exifPropGroup The custom tag's belongs to this file group. You can also pass valid custom group as an argument
 * @property {"Main" | "Info"} exifPropSubGroup The custom tag's belongs to this specific sub group. This will translate into Exif::Main. You can also pass valid custom sub group as an argument
 * 
 */

/**
 * @typedef {Object} ExifConfiguratorOptions
 * @property {boolean} default The default configuration use hex key data in files. If you want to use key name data, set this to explicitly false.
 * @property {ExifCustomTag[]} tags
 * @property {number} [keyCodeEvaluator] The value of this variable must be greater than 53248. This is the default value of the first custom tag. Please don't change this value unless you know what you are doing.
 * @property {boolean} [disable_cache_cleanup] This will stop auto cache cleaner on node server startup.
 */

/**
 * @param {ExifConfiguratorOptions} options
 */
export async function _exiftoolConfigurator(options = {}) {
    try {
        const {
            default: _dHex,
            tags = [],
            keyCodeEvaluator,
            disable_cache_cleanup
        } = options;
        if (!disable_cache_cleanup) { await __clearCache(); }
        if (tags.length < 1) {
            // throw new Error("You must pass at least one custom tag to configure exiftool");
            return;
        }
        let __keyInc = keyCodeEvaluator > 53248 ? keyCodeEvaluator : 53248;
        const groups = {};
        tags.forEach(tag => {
            const { name, type, exifPropGroup, exifPropSubGroup } = tag;
            const _hexKey = Number(__keyInc).toString(16);
            const _g = `'Image::ExifTool::${exifPropGroup}::${exifPropSubGroup}'`;
            let val = groups[_g] || "{\n";
            val += `\t\t${_dHex === false ? name : _hexKey} => {
            Name => '${name}',
            Writable => '${type}',
        },\n`;
            groups[_g] = val;
            __keyInc += 1;
        });
        const _str = Object.keys(groups).map((key) => {
            const val = groups[key];
            return `${key} => ${val}`;
        }).join("\t},\n\t");
        const _config = `%Image::ExifTool::UserDefined = (
    ${_str}\t},
);
1;`;
        await _saveConfig(_config);
    } catch (e) {
        throw e;
    }
}

async function _saveConfig(config) {
    try {
        const _hash = _generateHash(config);
        const _oldHash = await _getHash();
        if (_hash === _oldHash) return;
        await fs.writeFile(path.join(__getDir(), "bin/.ExifTool_config"), `#${_hash}\n${config}`);
    } catch (e) {
        throw e;
    }

}

async function _getHash() {
    try {
        const readable = createReadStream(path.join(__getDir(), "bin/.ExifTool_config"));
        const reader = createInterface({ input: readable });
        const _hash = await new Promise((resolve) => {
            reader.on('line', (data) => {
                reader.close();
                resolve(data.split("#")[1]);
            });
        });
        readable.close();
        return _hash;
    } catch (e) {
        return null;
    }
}

async function __clearCache() {
    try {
        await fs.rm(path.join(__getDir(), ".tmp"), { recursive: true, force: true });
        await fs.mkdir(path.join(__getDir(), ".tmp"));
    } catch (e) {
        console.error("CACHE ERROR:", e);
        throw e;
    }
}