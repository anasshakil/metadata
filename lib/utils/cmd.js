import path from "node:path";
import { spawn } from "node:child_process";
import { __getDir } from "../../__dir.js";
import { __undefinedTag } from "./utils.js";

/**
 * @typedef {Object} ExifToolOptions
 * @property {String} configPath
 * @property {boolean} [write_mode]
 * @property {boolean} [_stay_open]
 * @property {boolean} [copy_mode]
 * @property {String[]} args
 * @property {boolean} [_ret_error]
 */

/**
 * 
 * @param {string} _fpath File path
 * @param {ExifToolOptions} options
 * @returns {object}
 */
export function _cmdExec(_fpath, options = {}) {
    try {
        return new Promise(async (resolve, reject) => {
            const {
                configPath,
                args = [],
                write_mode,
                copy_mode,
                _stay_open,
                _ret_error
            } = options;
            const __writingMode = write_mode && Array.isArray(args) && args.length > 0;
            let metadata = "";
            let _err = "";
            const _allArgs = [
                path.join(__getDir(), "bin/exiftool"),
                ...configPath?.trim?.()?.endsWith(".cfg") ? [`-config ${configPath}`] : [],
                ...copy_mode ? ["-tagsFromFile"] : [],
                ...__writingMode ? [
                    ...args,
                    "-overwrite_original"
                ] : copy_mode ? [] : [
                    ...args,
                    "-j",
                    "-q",
                    "--ExifToolVersion",
                    "--XMPToolkit"
                ],
                ...Array.isArray(_fpath) ? _fpath : [_fpath],
                ...copy_mode ? [...args, "-overwrite_original"] : []
            ];
            const cps = spawn("perl", _allArgs);
            cps.stdout.on("data", (d) => {
                metadata += `${d}`;
            });
            cps.stderr.on("data", (e) => {
                _err += `${e}`;
            });
            cps.stderr.on("end", () => {
                if (_err === '') return;
                if (_err.endsWith("Nothing to do.\n")) {
                    const _udTags = __undefinedTag(_err);
                    if (_udTags.length > 0) {
                        const _nErr = {
                            tags: _udTags,
                            error: "Seems like you're using user-defined tag(s), make sure you have initialized the configurator with proper group & sub-group."
                        }
                        return _ret_error ? resolve(_nErr) : reject(_nErr);
                    }
                    _err += "Seems like you're using user-defined tag(s), make sure you have initialized the configurator with proper group & sub-group.";
                }
                if (!_ret_error) reject(_err);
            })
            cps.on('error', (e) => {
                delete e?.spawnargs;
                try {
                    const { errno, code, path, syscall } = e;
                    if (errno === -4058 && code === 'ENOENT' && path === 'perl' && syscall === 'spawn perl') {
                        reject("Perl is not installed on your system, please install it first.");
                    }
                    reject(e);
                } catch (_e) {
                    reject(_e);
                }
            });
            cps.on("close", (code) => {
                if (code !== 0) return reject("File read ended with code: " + code);
                let _mdata = {};
                try {
                    _mdata = JSON.parse(metadata);
                } catch (e) {
                    if (metadata?.includes('image files updated')) {
                        _mdata = { message: copy_mode ? "Metadata copied to destination file(s) successfully!" : "File(s) updated successfully." };
                    } else {
                        _mdata = { message: metadata };
                    }
                }
                if (_err?.length > 0) {
                    _mdata.error = _err;
                }
                resolve(__writingMode ? metadata : _mdata);
            });
        })
    } catch (e) {
        throw e;
    }
}
