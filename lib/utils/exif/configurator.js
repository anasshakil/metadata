import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
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
 * @property {ExifCustomTag[]} args
 * @property {number} [keyCodeEvaluator] The value of this variable must be greater than 53248. This is the default value of the first custom tag. Please don't change this value unless you know what you are doing.
 */

/**
 * @param {ExifConfiguratorOptions} options
 */
export async function _exiftoolConfigurator(options = {}) {
    try {
        const { args, keyCodeEvaluator } = options;
        let __keyInc = keyCodeEvaluator > 53248 ? keyCodeEvaluator : 53248;
        const groups = {};
        args.forEach(tag => {
            const _g = `'Image::ExifTool::${tag.exifPropGroup}::${tag.exifPropSubGroup}'`;
            let val = groups[_g] || "{\n";
            val += `\t\t${Number(__keyInc).toString(16)} => {
            Name => '${tag.name}',
            Writable => '${tag.type}',
        },\n`;
            groups[_g] = val;
            __keyInc += 1;
        });
        const _str = Object.keys(groups).map((key) => {
            const val = groups[key];
            return `${key} => ${val}`
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
        __clearCache();
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
        console.error("CACHE ERROR:", e)
    }
}
