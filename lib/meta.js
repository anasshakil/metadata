import crypto from "node:crypto";
import https from "node:https";
import http from "node:http";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { _cmdExec } from "./utils/cmd.js";
import { __getDir } from "../__dir.js";
import { _argsReadRaw, _argsWriteRaw } from "./utils/exif/args-transform.js";
import { _generateHash } from "./utils/crypto.js";
import { _checkTmpFile, _createTempFolder, _isReadableStream, _isURL } from "./utils/utils.js";

/**
 * @typedef {Object} ExifReadOPTag
 * @property {string} name The name of the metadata tag
 * @property {boolean} [exclude] To exclude this tag from the result
 * @property {string} [custom] Advanced exiftool commands can be directly passed here. This command will be executed as you pass it. Only use this if you know what you are doing.Read more about exiftool commands here: https://exiftool.org/exiftool_pod.html#READING-EXAMPLES
 * 
 * @typedef {Object} ExifWriteOPTag
 * @property {string} name The name of the metadata tag. If it's a custom tag, make sure to initialize configurator. 
 * @property {string | number} [value] The value of the metadata tag. If empty the tag will be mark as to removed
 * @property {boolean} [empty_tag] [DEPRECATED]. To delete the current tag's value without deleting the whole tag from the file
 * @property {string} [custom] Advanced exiftool commands can be directly passed here. This command will be executed as you pass it. Only use this if you know what you are doing. Read more about exiftool commands here: https://exiftool.org/exiftool_pod.html#WRITING-EXAMPLES
 * 
 * @typedef {Object} ExifMetadataReadOptions
 * @property {ExifReadOPTag[]} tags
 * @property {boolean} [no_cache] [Default: false]. If not disabled, URL files will be cached to a temporary file. This is useful when the stream is limited or large files could be an input for metadata from the internet. This feature will help in saving network bandwidth. Please note to save disk space the temporary files will be deleted every time the node server restart, you can disable auto cleaner using Metadata.configurator. Local file streams will be automatically deleted after reading the metadata.
 * 
 * @typedef {Object} ExifMetadataWriteOptions
 * @property {ExifWriteOPTag[]} tags
 * @property {boolean} [metadata] [Default: false]. If enabled, the metadata of the file before modifying metadata will be returned
 * @property {boolean} [new] [Default: false]. If enabled, the metadata of the file after modifying metadata will be returned
 * 
 * 
 * 
 * @typedef {Object} ExifMetadataReadWriteOptions
 * @property {string} [config] [NOT RECOMMENDED instead use Metadata.configurator]. The path to the config file to use with exiftool
 * @property {string} [fileName] The name of the temporary file that will be cached. This is useful when you want to save the file with a specific name. If not provided, a random name will be generated. This option is recommended to use with direct network streams. Note: this will only work for direct stream as a parameter. If you are using a URL or file path as a parameter, the fileName will be ignored.
 */

/**
 * @param {string | import("node:fs").ReadStream} file If you're directly passing a network stream make sure to set the no_cache option to true, otherwise the temporary file will be deleted after reading the metadata.
 * @param {ExifMetadataReadOptions & ExifMetadataReadWriteOptions} [options] 
 */
export async function getMetadata(file, options = {}) {
    let tempFile = file;
    let _del = false;
    try {
        const {
            config,
            fileName,
            tags = [],
            no_cache
        } = options;
        await _createTempFolder();
        if (!file) {
            throw new Error("Invalid file path or unreadable stream passed as an argument");
        }
        if (typeof file === "object") {
            _del = !(no_cache === false && fileName?.length > 0);
            tempFile = await _streamFile(file, fileName);
        } else if (_isURL(file)) {
            _del = no_cache === true;
            tempFile = await _streamURL(file);
        }
        const _args = _argsReadRaw(tags);
        const result = await _cmdExec(tempFile, {
            configPath: config,
            args: _args
        });
        if (_del) { unlink(tempFile); }
        return result; // result?.length > 0 && result?.length <= 1 ? result[0] : result;
    } catch (e) {
        if (_del) { await unlink(tempFile); }
        throw e;
    }
}

/**
 * @param {string | import("node:fs").ReadStream} file
 * @param {ExifMetadataWriteOptions & ExifMetadataReadWriteOptions} options
 */
export async function writeMetadata(file, options = {}) {
    try {
        await _createTempFolder();
        let tempFile = file;
        const {
            config,
            fileName,
            tags = [],
            metadata,
            new: _new
        } = options;
        if (!file) {
            throw new Error("Invalid file path or unreadable stream passed as an argument");
        }
        if (!(tags.length > 0)) {
            throw new Error("Provide at least one tag to update the metadata");
        }
        if (typeof file !== "string") {
            tempFile = await _streamFile(file, fileName);
        } else if (_isURL(file)) {
            tempFile = await _streamURL(file);
        }
        let _metadata_ = null;
        if (metadata === true && _new !== true) {
            _metadata_ = await getMetadata(tempFile, {
                config,
            });
        }
        const _args = _argsWriteRaw(tags);
        const result = await _cmdExec(tempFile, {
            configPath: config,
            write_mode: true,
            args: _args
        });
        if (result.includes("image files updated")) {
            if (_new === true) {
                _metadata_ = await getMetadata(tempFile, {
                    config,
                });
            }
            return {
                message: "File updated successfully!",
                file: tempFile,
                ..._metadata_ === null ? {} : { metadata: _metadata_ }
            }
        }
        return {
            ...result,
            ..._metadata_ === null ? {} : { metadata: _metadata_ }
        };
    } catch (e) {
        throw e;
    }
}

async function _streamFile(rs, _tmpFn) {
    try {
        const tempFile = path.join(__getDir(), `.tmp/${_tmpFn || crypto.randomUUID()}`);
        const ws = createWriteStream(tempFile, { flags: "wx" });
        rs.pipe(ws);
        await new Promise((resolve) => {
            rs.on("close", () => {
                resolve(null);
            });
        });
        return tempFile;
    } catch (e) {
        throw e;
    }
}

async function _streamURL(url = "") {
    try {
        const _hex = _generateHash(url)
        const tempFile = path.join(__getDir(), `.tmp/${_hex}`);
        if (await _checkTmpFile(tempFile)) return tempFile;
        const ws = createWriteStream(tempFile, { flags: "wx" });
        await new Promise((resolve) => {
            if (url.startsWith("https://")) {
                https.get(url, (rs) => {
                    rs.pipe(ws);
                    rs.on("close", () => {
                        resolve(null);
                    });
                });
            } else {
                http.get(url, (rs) => {
                    rs.pipe(ws);
                    rs.on("close", () => {
                        resolve(null);
                    });
                });
            }
        });
        return tempFile;
    } catch (e) {
        throw e;
    }
}