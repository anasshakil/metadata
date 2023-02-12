"use strict";

import crypto from "node:crypto";
import https from "node:https";
import http from "node:http";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { _cmdExec } from "./utils/cmd.js";
import { __dir__ } from "../__dir.js";
import { _argsReadRaw, _argsWriteRaw } from "./utils/exif/args-transform.js";
import { _generateHash } from "./utils/crypto.js";
import __utils__ from "./utils/utils.js";

const { _checkTmpFile, _createTempFolder, _isReadableStream, _isURL, __create_path, __rmTempFiles } = __utils__;

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
 * @property {boolean} [no_cache] [Default: `false`]. If not disabled, URL files will be cached to a temporary file. This is useful when the stream is limited or large files could be an input for metadata from the internet. This feature will help in saving network bandwidth. Please note to save disk space the temporary files will be deleted every time the node server restart, you can disable auto cleaner using Metadata.configurator. Local file streams will be automatically deleted after reading the metadata.
 * @property {BatchReadOptions} [batch]
 * @property {boolean} [all] [Default: `false`]. If `true`, all the metadata tags will be returned. This will override the `tags` option. **NOTE**: This option can cause significant performance issues. Use it only if you need all the metadata tags.
 * @property {boolean} [stream] [Default: `false`]. If `true`, instead of returning metadata JSON, an instance of readable stream containing metadata string will be returned.
 * 
 * 
 * @typedef {Object} ExifMetadataWriteOptions
 * @property {ExifWriteOPTag[]} tags
 * @property {boolean} [delete_all] [**UNSAFE**][Default: `false`]. If `true` all the metadata tags will be deleted from the file.
 * @property {boolean} [metadata] [Default: `false`]. If `true`, the metadata of the file before modifying metadata will be returned
 * @property {boolean} [new] [Default: `false`]. If `true`, the metadata of the file after modifying metadata will be returned.
 * @property {boolean} [all] [Default: `false`]. If `true`, all the metadata tags will be returned. This will override the `tags` option. **NOTE**: This option can cause significant performance issues. Use it only if you need all the metadata tags.
 * 
 * 
 * @typedef {Object} ExifCopyMetadataOptions
 * @property {boolean} [all] [Default: `false`]. If `true`, all the metadata will be copied
 * @property {ExifMetadataReadOptions & {metadata: boolean?}} [src]
 * @property {ExifMetadataWriteOptions} [dst]
 * 
 * 
 * @typedef {Object} ExifMetadataReadWriteOptions
 * @property {string} [config] [NOT RECOMMENDED instead use Metadata.configurator]. The path to the config file to use with exiftool
 * @property {string} [fileName] The name of the temporary file that will be cached. This is useful when you want to save the file with a specific name. If not provided, a random name will be generated. This option is recommended to use with direct network streams. Note: this will only work for direct stream as a parameter. If you are using a URL or file path as a parameter, the fileName will be ignored.
 * @property {boolean} [del_cache_on_error] [Default: `false`]. If `true`, the temporary file will be deleted if an error occurs.
 * 
 * 
 * @typedef {Object} BatchReadOptions
 * @property {boolean | string[]} [no_network_cache] [Default: `false`]. If `true`, the network files will not be cached. If specific URL is provided, then that URL will not be cached.
 * @property {string[]} [no_stream_cache] If file name is not valid for stream perspective, then that specific file will not be cached. Empty or null means all streams will be discarded after reading metadata.
 * 
 * 
 * @typedef {Object} BatchWriteOptions
 * 
 * 
 * @typedef {Object} _ExperimentalFeatures_ Experimental features can be unstable or maybe subject to change, use them in production environments is not recommended
 * @property {boolean} [fast] **[Advanced]**[Default: `false`]. If `true`, a dedicated process will be started for binaries. This can significantly increase performance
 * 
 */

/**
 * @param {string | string[] | import("node:fs").ReadStream | import("node:fs").ReadStream[]} file If you're directly passing a network stream make sure to set `no_cache: true` with a valid `fileName`, otherwise the temporary file will be deleted after reading the metadata.
 * @param {ExifMetadataReadOptions & ExifMetadataReadWriteOptions & _ExperimentalFeatures_} [options] 
 */
export async function __ext__(file, options = {}) {
    let _del = false;
    let _del_batch = {};
    let _cache = []
    try {
        const {
            config,
            tags = [],
            batch,
            all: _allMd,
            fast,
            stream: _ret_stream_
        } = options;
        const {
            files,
            del: __del,
            del_batch: __del_batch,
            cache: __cache
        } = await __linear_path(file, { ...options, batch: { read: batch } });
        _del = __del;
        _del_batch = __del_batch;
        _cache = __cache;
        const _args = _argsReadRaw(tags);
        const result = await _cmdExec(files, {
            configPath: config,
            args: _allMd ? ["-ee3", "-api", "RequestAll=3"] : _args,
            fast_mode: fast,
            _ret_raw_stream_: _ret_stream_,
            // _ret_error: Array.isArray(file)
        });
        if (_del) { __rmTempFiles(files); }
        Object.keys(_del_batch).map(_del_f => {
            if (!_del_batch[_del_f]) return;
            unlink(_del_f);
        });
        return result; // result?.length > 0 && result?.length <= 1 ? result[0] : result;
    } catch (e) {
        if ((_del || options?.del_cache_on_error) && _cache?.length > 0) {
            _cache.map(_f => unlink(_f));
        }
        // if (_del) { await unlink(tempFile); }
        Object.keys(_del_batch).map(_del_f => {
            if (!_del_batch[_del_f]) return;
            unlink(_del_f);
        });
        throw e;
    }
}

/**
 * @param {string | string[] | import("node:fs").ReadStream | import("node:fs").ReadStream[]} file
 * @param {ExifMetadataWriteOptions & ExifMetadataReadWriteOptions} options
 */
export async function __w__(file, options = {}) {
    let _cache = [];
    try {
        await _createTempFolder();
        const {
            config,
            tags = [],
            metadata,
            new: _new,
            all: _allMd,
            delete_all,
        } = options;
        if (!(tags.length > 0)) {
            throw new Error("Provide at least one tag to update the metadata");
        }
        const {
            files,
            cache: __cache
        } = await __linear_path(file, { ...options, batch: { write: {} } });
        _cache = __cache;
        let _metadata_ = {
            pre: null,
            new: null,
        };
        if (metadata === true) {
            _metadata_.pre = await __ext__(files, {
                config,
                all: _allMd
            });
        }
        const _args = _argsWriteRaw(delete_all ? [...tags, { name: "all" }] : tags);
        const result = await _cmdExec(files, {
            configPath: config,
            write_mode: true,
            args: _args
        });
        if (result.includes("image files updated")) {
            if (_new === true) {
                _metadata_.new = await __ext__(files, {
                    config,
                    all: _allMd
                });
            }
            const _mtd_res = __w_data(_metadata_);
            return {
                message: "File updated successfully!",
                file: Array.isArray(files) ? files : [files],
                ..._mtd_res === null ? {} : _mtd_res
            }
        }
        const _mtd_res = __w_data(_metadata_);
        return {
            ...result,
            ..._mtd_res === null ? {} : _mtd_res
        };
    } catch (e) {
        if (options?.del_cache_on_error && _cache?.length > 0) {
            _cache.map(_f => unlink(_f));
        }
        throw e;
    }
}

/**
 * 
 * @param {string | import("node:fs").ReadStream} src
 * @param {string | string[] | import("node:fs").ReadStream | import("node:fs").ReadStream[]} dst
 * @param {ExifCopyMetadataOptions & ExifMetadataReadWriteOptions} options 
 */
export async function __c__(src, dst, options = {}) {
    let _cache = [];
    let _sCache = [];
    let _dCache = [];
    try {
        await _createTempFolder();
        const {
            config,
            all,
            src: _srcOp = {},
            dst: _dstOp = {},
        } = options;
        const { tags: _sTags, batch: _sBatch, metadata: _srcMd, all: _srcAllMd } = _srcOp;
        const { tags: _dTags, metadata: _dstPreMd, new: _dstNewMd, all: _dstAllMd } = _dstOp;
        const _metadata_ = {
            src: null,
            dst: {
                pre: null,
                new: null,
            }
        }
        //NOTE Source files
        if (Array.isArray(src)) {
            throw new Error("Source file can only be a single file or directory");
        }
        const {
            files: _srcFiles,
            del: __del,
            del_batch: __del_batch,
            cache: __src_cache
        } = await __linear_path(src, {
            ..._srcOp,
            no_cache: false,
            batch: {
                read: {
                    ..._sBatch,
                    no_stream_cache: false
                }
            }
        });
        _sCache = __src_cache;
        _cache.push(...__src_cache);
        const _sArgs = _argsReadRaw(_sTags);
        //NOTE Destination files
        const {
            files: _dstFiles,
            cache: __dst_cache
        } = await __linear_path(dst, { ..._dstOp, batch: { write: {} } });
        _dCache = __dst_cache;
        _cache.push(...__dst_cache);
        const _dArgs = _argsWriteRaw(_dTags);
        if (_srcMd === true) {
            _metadata_.src = await __ext__(_srcFiles, {
                config,
                all: _srcAllMd
            });
        }
        if (_dstPreMd === true) {
            _metadata_.dst.pre = await __ext__(_dstFiles, {
                config,
                all: _dstAllMd
            });
        }
        const result = await _cmdExec(_srcFiles, {
            configPath: config,
            copy_mode: true,
            args: [
                ...all ? ["-all:all "] : [
                    ..._sArgs,
                    ..._dArgs,
                ],
                ...Array.isArray(_dstFiles) ? _dstFiles : [_dstFiles]
            ]
        });
        if (_dstNewMd === true) {
            _metadata_.dst.new = await __ext__(_dstFiles, {
                config,
                all: _dstAllMd
            });
        }
        const _mtd_res = __cp_data(_metadata_);
        //NOTE clear source cache
        _sCache.map(_f => unlink(_f));
        return {
            ...result,
            files: Array.isArray(_dstFiles) ? _dstFiles : [_dstFiles],
            ..._mtd_res === null ? {} : _mtd_res
        };
    } catch (e) {
        if (options?.del_cache_on_error && _cache?.length > 0) {
            _cache.map(_f => unlink(_f));
        }
        throw e;
    }
}

async function _streamFile(rs, _tmpFn) {
    try {
        const tempFile = __create_path(_tmpFn || crypto.randomUUID());
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
        const _hash = _generateHash(url);
        const __temp = __create_path(_hash);
        if (await _checkTmpFile(__temp)) return __temp;
        const ws = createWriteStream(__temp, { flags: "wx" });
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
        return __temp;
    } catch (e) {
        throw e;
    }
}

/**
 * 
 * @param {{fileName: string?, no_cache: boolean ,batch: {read: BatchReadOptions, write: BatchWriteOptions}}} options 
 */
async function __linear_path(file, options = {}) {
    await _createTempFolder();
    if (!file) {
        throw new Error("Invalid file path or unreadable stream passed as an argument");
    }
    let tempFile = file;
    let _del = false;
    let __del_batch = {};
    const { batch, fileName, no_cache } = options;
    if (Array.isArray(file)) {
        const _batch = await __batch__(file, batch);
        tempFile = _batch.files;
        __del_batch = _batch.del;
    } else if (typeof file === "object") {
        _del = !(no_cache === false && fileName?.length > 0);
        tempFile = await _streamFile(file, fileName);
    } else if (_isURL(file)) {
        _del = no_cache === true;
        tempFile = await _streamURL(file);
    }
    return {
        files: tempFile,
        del: _del,
        del_batch: __del_batch,
        cache: Array.isArray(tempFile) ? tempFile.filter(_f => _f.includes(".tmp")) : tempFile.includes(".tmp") ? [tempFile] : []
    };
}

/**
 * 
 * @param {string[] | import("node:fs").ReadStream[]} files 
 * @param {{read: BatchReadOptions, write: BatchWriteOptions}} options 
 */
async function __batch__(files, options = {}) {
    try {
        const { read: _readOptions = {}, write: _writeOptions = {} } = options;
        const {
            no_network_cache,
            no_stream_cache = []
        } = _readOptions;
        const __del = {};
        const _files = (await Promise.all(files.map((_f) => {
            let __temp;
            if (Array.isArray(_f)) {
                throw new Error("Nested array is not supported");
            }
            if (typeof _f === "object") {
                const __random = crypto.randomUUID();
                const __fName = no_stream_cache.shift();
                __temp = __create_path(__fName || __random);
                __del[__temp] = !(no_stream_cache === false && __fName?.length > 0);
                return _streamFile(_f, __fName || __random);
            } else if (_isURL(_f)) {
                __temp = __create_path(_generateHash(_f));
                __del[__temp] = (no_network_cache === true || no_network_cache?.includes?.(_f)) ?? false;
                return _streamURL(_f);
            } else if (typeof _f === "string") {
                return _f;
            }
            return null;
        })))?.filter((_s) => _s !== null) || [];
        return {
            // files: _files.map((_f) => __create_path(_f, true)),
            files: _files,
            del: __del
        }
    } catch (e) {
        return {
            files: [],
            del: {}
        }
    }
}

function __w_data(metadata = {}) {
    if (metadata.pre === null && metadata.new === null) return null;
    if (metadata.pre === null) return { metadata: metadata.new };
    if (metadata.new === null) return { metadata: metadata.pre };
    return { metadata };
}

function __cp_data(metadata = {}) {
    if (metadata.src === null && metadata.dst.pre === null && metadata.dst.new === null) return null;
    if (metadata.dst.pre === null && metadata.dst.new === null) return { metadata: metadata.src };
    if (metadata.src !== null && metadata.dst.pre !== null && metadata.dst.new !== null) return { metadata };
    if (metadata.dst.pre !== null && metadata.dst.new !== null) return { metadata: metadata.dst };
    if (metadata.dst.pre !== null) return { metadata: metadata.dst.pre };
    if (metadata.dst.new !== null) return { metadata: metadata.dst.new };
    return { metadata };
}