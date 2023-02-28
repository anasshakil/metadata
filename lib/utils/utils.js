"use strict";

import fs, { access, unlink } from "node:fs/promises";
import stream from "node:stream";
import path from "node:path";
import { URL } from "node:url";
import { get } from "node:https";
import { __dir__ } from "../../__dir.js";

/**
 * @param {import("stream").Readable} o
 */
function _clr_read_buffer_(o) {
    o.resume();
    o._readableState.buffer.clear();
    o._readableState.length = 0;
    while (true) {
        const chunk = o.read();
        if (chunk === null) break;
    }
}

/**
 * @param {import("node:child_process").ChildProcessWithoutNullStreams} o
 */
export function _removeInternalProcessEvents_(o) {
    o.stdout.removeAllListeners();
    o.stderr.removeAllListeners();
    o.removeAllListeners();
}

function __readable_stream_parser__(o, buf, fast_mode) {
    const _marker_ = "{ready0}";
    let done = false;
    let chunk = `${buf}`;
    if (fast_mode === true) {
        const __index = chunk.indexOf(_marker_);
        if (__index !== -1) {
            done = true;
            chunk = chunk.slice(0, __index);
        }
    }
    if (done) {
        _removeInternalProcessEvents_(o);
    }
    return { completed: done, chunk };
}

function _remove_marker_(chunk, onComplete) {
    let done = false;
    const i = chunk.indexOf("{ready0}");
    if (i !== -1) {
        done = true;
        chunk = chunk.slice(0, i);
        onComplete?.();
    }
    return { done, chunk: chunk.trim() };
}

async function _checkTmpFile(url) {
    try {
        await access(url, fs.constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * @param {import("fs").ReadStream | any} o
 * @returns {boolean}
 */
function _isReadableStream(o) {
    return (
        o instanceof stream.Stream &&
        typeof o._read === "function" &&
        typeof o._readableState === "object"
    );
}

/**
 * @param {import("fs").WriteStream | any} o
 * @returns {boolean}
 */
function _isWritableStream(o) {
    return (
        o instanceof stream.Stream &&
        typeof o._write === "function" &&
        typeof o._writableState === "object"
    );
}

function _isURL(s, protocols = ["http", "https"]) {
    try {
        const url = new URL(s);
        return protocols
            ? url.protocol
                ? protocols
                      .map((x) => `${x.toLowerCase()}:`)
                      .includes(url.protocol)
                : false
            : true;
    } catch (err) {
        return false;
    }
}

async function _createTempFolder() {
    try {
        await access(path.join(__dir__(), ".tmp"), fs.constants.F_OK);
    } catch (e) {
        await fs.mkdir(path.join(__dir__(), ".tmp"), { recursive: true });
    }
}

function __undefinedTag(s = "") {
    const _res = (
        s.split?.("\n").map?.((_s) => {
            const _ar = /(["'])(?:(?=(\\?))\2.)*?\1/gi.exec(_s);
            return _ar?.[0];
        }) || []
    )?.filter?.((_s) => typeof _s === "string");
    return _res;
}

async function __isPathDir(s) {
    try {
        return (await fs.stat(s)).isDirectory();
    } catch (e) {
        return false;
    }
}

function __create_path(s, sep = false) {
    const _s = path.join(__dir__(), `.tmp/${s}`);
    // return _s.replace(/(\s+)/g, '\\$1');
    if (!sep) return _s;
    return _s
        .split(path.sep)
        .map((_p) => {
            if (_p.includes(" ")) {
                return `"${_p}"`;
            }
            return _p;
        })
        .join(path.sep);
}

async function __rmTempFiles(file) {
    try {
        if (Array.isArray(file)) {
            await Promise.all(file.map((_f) => unlink(_f)));
            return;
        }
        await unlink(file);
    } catch (e) {
        throw new Error("An error occurred while deleting the cache files");
    }
}

function _safe_json_decode_(s) {
    try {
        return JSON.parse(s);
    } catch (e) {
        return { raw: s?.trim() };
    }
}

function _toHex_(s) {
    return Buffer.from(`${s}`).toString("hex");
}
function _toString_(s) {
    return Buffer.from(s, "hex").toString();
}

/**
 *
 * @param {Object} param0
 * @param {string} param0.F0
 * @param {string} [param0.type]
 * @param {any} param0.value
 * @returns
 */
function _tag_group_type_cast_({ F0, type, value }) {
    F0 = F0.toLowerCase();
    if (F0 === "iptc") {
        switch (typeof value) {
            case "string":
                return "string[1000]";
            default:
                return "string[1000]";
        }
    }
    return "string";
}

const __META_UTILS__ = {
    _checkTmpFile,
    _isReadableStream,
    _isWritableStream,
    _isURL,
    _createTempFolder,
    __readable_stream_parser__,
    __undefinedTag,
    __isPathDir,
    __create_path,
    __rmTempFiles,
    _safe_json_decode_,
    _toHex_,
    _toString_,
    _tag_group_type_cast_,
    _remove_marker_,
};

export default __META_UTILS__;
