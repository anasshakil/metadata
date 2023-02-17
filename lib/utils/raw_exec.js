"use strict";

import { spawn } from "node:child_process";
import path from "node:path";
import { __dir__ } from "../../__dir.js";
import { _config_stay_open_ } from "./cmd.js";

/**
 * @type {import("node:child_process").ChildProcessWithoutNullStreams}
 */
let __raw_process__;

/**
 *
 * @param {string} _commands_ Exiftool commands for further reading visit: https://exiftool.org/exiftool_pod.html
 * @param  {(string) => undefined} [callback]
 * @param {{path: string, raw: boolean, stay_open: boolean | string}} [options]
 */
export function __raw__cmd__(_commands_, callback, options = {}) {
    const { path: exif_path, raw, stay_open } = options;
    const _isRawProcessActive =
        __raw_process__ && __raw_process__?.pid && !__raw_process__?.killed;
    __raw_process__ = _isRawProcessActive
        ? __raw_process__
        : spawn("perl", [
              ..._config_stay_open_(exif_path, stay_open, false, null, true),
              ..._commands_.split(" "),
          ]);
    if (stay_open) {
        _commands_ += " -execute0\n";
        __raw_process__.stdin.write(_commands_.split(" ").join("\n"), "utf8");
    }
    if (raw) return __raw_process__;

    // __raw_process__.stderr.on("data", (d) =>
    //     __raw_process__.stdout.push(`${d} {ready0}`, "utf8")
    // );

    // __raw_process__.stdout.on("data", (d) => {
    //     let _d = `${d}`;
    //     // if (_d.endsWith("{ready0}\r\n")) {
    //     //     __raw_process__.stderr.removeAllListeners();
    //     //     __raw_process__.stdout.removeAllListeners();
    //     //     __raw_process__.removeAllListeners();
    //     // }
    //     _d = _d.split("{ready0}\r\n").join("");
    //     // if (_d === "") return;
    //     // callback(_d);
    // });

    __raw_process__.stdout.removeAllListeners();
    __raw_process__.stderr.removeAllListeners();
    __raw_process__.removeAllListeners();

    if (typeof callback === "function") {
        __raw_process__.stderr.on("error", (d) => callback(d.toString()));
        __raw_process__.stdout.on("error", (d) => callback(d.toString()));
        __raw_process__.stdout.on("data", (d) => callback(d.toString()));
        __raw_process__.on("error", (e) => callback(e));
        return;
    }
    return new Promise((resolve, reject) => {
        try {
            __raw_process__.stderr.on("data", (d) => resolve(d.toString()));
            __raw_process__.stdout.on("data", (d) => resolve(d.toString()));
        } catch (e) {
            reject(e);
        }
    });
}
