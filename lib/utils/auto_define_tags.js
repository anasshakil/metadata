"use strict";

import { _saveConfig } from "./exif/configurator.js";
import __META_UTILS__ from "./utils.js";

const { _tag_group_type_cast_, _toHex_, _toString_ } = __META_UTILS__;

/**
 *
 * @param {import("../meta.js").ExifWriteOPTag[]} tags
 */
export async function _auto_tags_configurator_(tags = []) {
    try {
        let groups = {};
        let _default_groups = [
            {
                F0: "EXIF",
                F1: "Main",
            },
            {
                F0: "PDF",
                F1: "Info",
            },
            // {
            //     F0: "IPTC",
            //     F1: "ApplicationRecord",
            // },
            {
                F0: "XMP",
                F1: "xmp",
            },
        ];
        _default_groups.forEach((_tag_group) => {
            const { F0, F1 } = _tag_group;
            tags.forEach((tag) => {
                const { name, type = "string", value } = tag;
                const _hexName = _toHex_(name);
                const group = `'Image::ExifTool::${F0}::${F1}'`;
                let val = groups[group] || "{\n";
                val += `\t\t${name} => {
            Name => '${name}',
            Writable => '${_tag_group_type_cast_({ F0, type, value })}',
        },\n`;
                groups[group] = val;
            });
        });
        const _str = Object.keys(groups)
            .map((key) => {
                const val = groups[key];
                return `${key} => ${val}`;
            })
            .join("\t},\n\t");
        const _config = `%Image::ExifTool::UserDefined = (\n\t${_str}\t},\n);\n1;`;
        await _saveConfig(_config, {
            no_hash: true,
            file: "auto.cfg",
        });
    } catch (e) {
        throw e;
    }
}
