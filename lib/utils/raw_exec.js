"use strict";

import { spawn } from "node:child_process";
import path from "node:path";
import { __dir__ } from "../../__dir.js";
import { _configure_core_args_ } from "./cmd.js";
import _StreamObservable_ from "./observable.js";
import __META_UTILS__ from "./utils.js";

const { _remove_marker_ } = __META_UTILS__;

/**
 * @typedef {Object} CLIOptions
 * @property {string} path The path to the ExifTool binary.
 * @property {string} [config] The configuration file path.
 * @property {boolean} [raw] [Default: `false`]. If `true`, the child process will be returned.
 * @property {boolean} [streams] [Default: `false`]. If `true`, streams will be returned.
 * @property {boolean} [queue] **[Advanced]**[Default: `false`]. If `true`, the stream observer will serve streams in queued order and will remove callback from the stream observer.
 *
 * @callback CliCallback
 * @param {Error | string} [error] Any error that occurred in streams or errors returned by ExifTool.
 * @param {string} [data] The raw metadata from the ExifTool.
 * @returns {void}
 */

/**
 * @type {import("node:child_process").ChildProcessWithoutNullStreams}
 */
let __raw_process__;

/**
 * ExifTool CLI
 * @param {string | [string]} command - Exiftool commands for further reading visit: https://exiftool.org/exiftool_pod.html
 * @ **NOTE: If the command contains arbitrary spaces, use array syntax to avoid confusion.**
 * @param  {CliCallback} [callback]
 * @param {CLIOptions} [options]
 *
 */
function __cli__(command, callback, options = {}) {
    const { path: exif_path, config, raw, streams, queue } = options;
    const _isArgsArray = Array.isArray(command);
    let _commands_ = "";
    const _isProcessActive = __raw_process__?.pid && !__raw_process__?.killed;
    if (raw !== true && streams !== true && typeof callback !== "function") {
        throw new TypeError("Callback must be a function");
    }
    const _subscriptionId = _registerCallback_(callback);
    if (!_isProcessActive) {
        __raw_process__ = spawn(
            "perl",
            _configure_core_args_(exif_path, true, false, config, true)
        );
        __raw_process__.stderr.on("data", (d) => {
            _StreamObservable_
                .getInstance()
                .emit("cli", _remove_marker_(d.toString()), null, { queue });
        });
        __raw_process__.stdout.on("data", (d) => {
            _StreamObservable_
                .getInstance()
                .emit("cli", null, _remove_marker_(d.toString()), {
                    queue: true,
                });
        });
        __raw_process__.stdout.on("error", (e) => {
            _StreamObservable_
                .getInstance()
                .emit("cli", { done: true, chunk: e }, null, { queue });
        });
        __raw_process__.on("error", (e) => {
            _StreamObservable_
                .getInstance()
                .emit("cli", { done: true, chunk: e }, null, { queue });
        });
    }
    if (_isArgsArray) {
        command.push("-execute0\n");
        _commands_ = command.join("\n");
    } else {
        command += " -execute0\n";
        _commands_ = command.split(" ").join("\n");
    }
    __raw_process__.stdin.write(_commands_, "utf8");
    if (raw) return __raw_process__;
    if (streams) {
        return {
            result: __raw_process__.stdout,
            error: __raw_process__.stderr,
        };
    }
    return _subscriptionId;
}

function _registerCallback_(callback) {
    if (typeof callback !== "function") return null;
    return _StreamObservable_.getInstance().subscribe("cli", callback);
}

/**
 * This will remove the current context callback from the stream observer.
 * @param {string} subscriberId The subscription ID returned by CLI.run().
 */
function __cli_unsubscribe__(subscriberId) {
    _StreamObservable_.getInstance().unsubscribe(subscriberId);
}

/**
 * Terminate the CLI process
 */
function __raw_cli_kill__() {
    if (!__raw_process__) return;
    _StreamObservable_.getInstance().unsubscribeAll("cli", {
        isError: true,
        message: "The CLI process was terminated",
    });
    __raw_process__.stdin.removeAllListeners();
    __raw_process__.stdin.end();
    __raw_process__.kill();
    __raw_process__ = null;
}

export const __raw__cmd__ = {
    run: __cli__,
    stop: __cli_unsubscribe__,
    kill: __raw_cli_kill__,
};
