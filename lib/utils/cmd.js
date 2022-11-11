import { spawn } from "node:child_process"
// import { __mimeType } from "./file-type.js";

/**
 * @typedef {Object} ExifToolOptions
 * @property {String} configPath [NOT RECOMMENDED instead use configurator]. The path to the config file to use with exiftool
 * @property {boolean} [write_mode]
 * @property {String[]} args
 */

/**
 * 
 * @param {string} path File path
 * @param {ExifToolOptions} options
 * @returns {object}
 */
export function _cmdExec(path, options = {}) {
    try {
        return new Promise(async (resolve, reject) => {
            // if (!await _validateFileType(path)) {
            //     throw new Error("File type is not valid")
            // }
            const { configPath, args = [], write_mode } = options;
            const __writingMode = write_mode && Array.isArray(args) && args.length > 0;
            let metadata = [];
            const _allArgs = [
                "./bin/exiftool",
                ...configPath?.trim?.()?.endsWith(".cfg") ? [`-config ${configPath}`] : [],
                ...__writingMode ? [...args, "-overwrite_original"] : [...args, "-j", "--ExifToolVersion"],
                path
            ];
            const res = spawn("perl", _allArgs);
            res.stdout.on("data", (d) => {
                metadata = __writingMode ? `${d}` : JSON.parse(d)
            });
            res.stderr.on("data", (e) => {
                reject(`${e}`)
            })
            res.on('error', (e) => {
                reject(e);
            });
            res.on("close", (code) => {
                if (code !== 0) return reject("Metadata file read ended with code: " + code);
                resolve(metadata);
            });
        })
    } catch (e) {
        // throw e;
        console.error("TERMINAL ERROR:", e);
    }
}

async function _validateFileType(path) {
    try {
        // const r = await __mimeType(path);
        // console.log(r)
        // return !(!r?.ext || (r.ext !== "pdf" && r.ext !== "jpg" && r.ext !== "png"))
    } catch (e) { return false; }
}


async function test() {
    try {
        console.log(await _cmdExec("/media/anas/Dev/playground/streams/samples/sample.pdf", {
            args: ["--FileName"]
        }))
        console.log("\n--------------\n   MODIFIED\n---------------\n")
        await _cmdExec("/media/anas/Dev/playground/streams/samples/sample.pdf", {
            write_mode: true,
            args: ['-signature=Anas123@=4w5', '-Tag81216=']
        });
    } catch (e) {
        console.log("ERROR:", e)
    }
}

// test();