import path from "node:path";
import { spawn } from "node:child_process";
import { __getDir } from "../../__dir.js";
import { __undefinedTag } from "./utils.js";

/**
 * @typedef {Object} ExifToolOptions
 * @property {String} configPath [NOT RECOMMENDED instead use configurator]. The path to the config file to use with exiftool
 * @property {boolean} [write_mode]
 * @property {String[]} args
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
            const { configPath, args = [], write_mode } = options;
            const __writingMode = write_mode && Array.isArray(args) && args.length > 0;
            let metadata = [];
            let _err = '';
            const _allArgs = [
                path.join(__getDir(), "bin/exiftool"),
                ...configPath?.trim?.()?.endsWith(".cfg") ? [`-config ${configPath}`] : [],
                ...__writingMode ? [...args, "-overwrite_original"] : [...args, "-j", "--ExifToolVersion", "--XMPToolkit"],
                _fpath
            ];
            const cps = spawn("perl", _allArgs);
            cps.stdout.on("data", (d) => {
                metadata = __writingMode ? `${d}` : JSON.parse(d);
            });
            cps.stderr.on("data", (e) => {
                _err += `${e}`;
            });
            cps.stderr.on("end", () => {
                if (_err === '') return;
                if (_err.endsWith("Nothing to do.\n")) {
                    const _udTags = __undefinedTag(_err);
                    if (_udTags.length > 0) {
                        return reject({
                            tags: _udTags,
                            error: "Seems like you're using user-defined tag(s), make sure you have initialized the configurator with proper group & sub-group."
                        });
                    }
                    _err += "Seems like you're using user-defined tag(s), make sure you have initialized the configurator with proper group & sub-group.";
                }
                reject(_err);
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
                resolve(metadata);
            });
        })
    } catch (e) {
        console.error("TERMINAL ERROR:", e);
        throw e;
    }
}
