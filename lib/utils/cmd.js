import path from "node:path";
import { spawn } from "node:child_process";
import { __getDir } from "../../__dir.js";

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
                let err = `${e}`;
                if (err.includes("Nothing to do.")) {
                    err += "Seems like you're passing custom tag(s) make sure you have initialized the configurator with proper proper group.";
                }
                reject(err);
            });
            cps.on('error', (e) => {
                reject(e);
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
