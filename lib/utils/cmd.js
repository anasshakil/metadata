"use strict";

import path from "node:path";
import { spawn } from "node:child_process";
import { __dir__ } from "../../__dir.js";
import __utils__, { _removeInternalProcessEvents_ } from "./utils.js";
import _META_ERRORS_ from "./error.js";
import _StreamObservable_ from "./observable.js";

const { __undefinedTag, __readable_stream_parser__, _safe_json_decode_ } =
    __utils__;

/**
 * @typedef {Object} ExifToolOptions
 * @property {string} exiftool_path
 * @property {String} [configPath]
 * @property {boolean} [write_mode]
 * @property {boolean} [fast_mode]
 * @property {boolean} [copy_mode]
 * @property {String[]} args
 * @property {boolean} [_ret_error]
 * @property {boolean} [_ret_raw_stream_]
 * @property {boolean} [auto_generate_tags]
 */

/**
 * @type {import("node:child_process").ChildProcessWithoutNullStreams}
 */
let _background_process_;
const _exec_cmd_ = "-execute0\n";

/**
 *
 * @param {string | string[]} _fpath File path
 * @param {ExifToolOptions} options
 * @returns {object | import("stream").Readable}
 */
export function _cmdExec(_fpath, options = {}) {
    try {
        return new Promise(async (resolve, reject) => {
            const {
                configPath,
                args = [],
                write_mode,
                copy_mode,
                fast_mode,
                _ret_raw_stream_,
                _ret_error,
                auto_generate_tags,
                exiftool_path,
            } = options;
            const __writingMode =
                write_mode && Array.isArray(args) && args.length > 0;
            const _core_init_args_ = _configure_core_args_(
                exiftool_path,
                fast_mode,
                auto_generate_tags,
                configPath
            );
            let metadata = "";
            let _err = "";
            const _all_args = [
                ...(fast_mode ? [] : _core_init_args_),
                ..._configWriteCopyMode_(args, __writingMode, copy_mode),
                ...(Array.isArray(_fpath) ? _fpath : [_fpath]),
                ...(copy_mode ? [...args, "-overwrite_original"] : []),
                ...(fast_mode ? [_exec_cmd_] : []),
            ];
            /**
             * @type {import("node:child_process").ChildProcessWithoutNullStreams}
             */
            let cps;
            if (fast_mode) {
                if (_isBackgroundProcessActive()) {
                    cps = _background_process_;
                } else {
                    cps = _background_process_ = spawn(
                        "perl",
                        _core_init_args_
                    );
                }
                cps.stdin.write(_all_args.join("\n"), "utf8");
            } else {
                cps = spawn("perl", _all_args);
            }
            if (_ret_raw_stream_ === true) {
                return resolve(cps.stdout);
            }
            cps.stdout.on("error", (e) => {
                reject(_META_ERRORS_(e));
            });
            cps.stderr.on("data", (e) => {
                if (fast_mode) {
                    reject(_META_ERRORS_(`${e}`.trim()));
                } else {
                    _err += `${e}`.trim();
                }
            });
            cps.stderr.on("end", () => {
                if (_err === "") return;
                _err = _META_ERRORS_(_err);
                _ret_error ? resolve(_err) : reject(_err || { error: _err });
            });
            cps.stdout.on("data", (data) => {
                const { completed, chunk } = __readable_stream_parser__(
                    cps,
                    data,
                    fast_mode
                );
                metadata += chunk;
                if (completed) {
                    if (!__writingMode && !copy_mode) {
                        metadata = _safe_json_decode_(metadata);
                    }
                    resolve(metadata);
                }
            });
            cps.on("error", (e) => {
                delete e?.spawnargs;
                reject(_META_ERRORS_(e));
            });
            cps.on("close", (code) => {
                if (fast_mode) {
                    _removeInternalProcessEvents_(cps);
                }
                if (code !== 0) {
                    return reject({
                        error: `CLI process ended with code: ${code}`,
                    });
                }
                let _mdata = {};
                try {
                    _mdata = JSON.parse(metadata);
                } catch (e) {
                    if (metadata?.includes("image files updated")) {
                        _mdata = {
                            message: copy_mode
                                ? "Metadata copied to destination file(s) successfully!"
                                : "File(s) updated successfully.",
                        };
                    } else {
                        _mdata = { message: metadata };
                    }
                }
                if (_err?.length > 0) {
                    _mdata.error = _err;
                }
                resolve(__writingMode ? metadata : _mdata);
            });
        });
    } catch (e) {
        throw e;
    }
}

function _isBackgroundProcessActive() {
    return _background_process_?.pid && !_background_process_?.killed;
}

/**
 *
 * @param {boolean} keep_process
 * @param {string} config
 * @returns { string[] }
 */
export function _configure_core_args_(
    _path_ = "exiftool",
    keep_process,
    auto_tags,
    config,
    no_default
) {
    const _default_config = [
        _path_,
        ..._inject_config_file_(
            no_default,
            auto_tags === true
                ? path.join(__dir__(), ".config_files/auto.cfg")
                : config
        ),
    ];
    if (!keep_process) return _default_config;
    return [..._default_config, "-stay_open", "true", "-@", "-"];
}

/**
 *
 * @param {string} [cfg]
 * @returns { string[] }
 */
function _inject_config_file_(no_default, cfg) {
    const noConfig = !(cfg?.length > 0) && no_default === true;
    if (noConfig) return [];
    return [
        "-config",
        cfg || path.join(__dir__(), ".config_files/default.cfg"),
    ];
}

/**
 * Config exiftool for write or copy
 * @param {any[]} args
 * @param {boolean} wrt
 * @param {boolean} cpy
 * @returns { string[] }
 */
function _configWriteCopyMode_(args, wrt, cpy) {
    return [
        // ...["-j", "-q"],
        ...(cpy ? ["-tagsFromFile"] : []),
        ...(wrt
            ? [...args, "-overwrite_original"]
            : cpy
            ? ["-overwrite_original"]
            : [...args, "-j", "-q", "--ExifToolVersion", "--XMPToolkit"]),
    ];
}

/**
 * Stop the ExifTool instance running with `fast` mode.
 */
export function _kill_process_() {
    if (!_background_process_) return;
    _StreamObservable_.getInstance().unsubscribeAll("fast_mode", {
        isError: true,
        message: "The ExifTool process was terminated",
    });
    _background_process_.stdin.removeAllListeners();
    _background_process_.stdin.end();
    _background_process_.kill();
    _background_process_ = null;
}
