"use strict";

import fs, { access, unlink } from "node:fs/promises";
import stream from "node:stream";
import path from "node:path";
import { URL } from "node:url";
import { __dir__ } from "../../__dir.js";

/**
 * @param {import("stream").Readable} o 
 */
function _clr_read_buffer_(o) {
    // o.resume()
    // o._readableState.buffer.clear()
    // o._readableState.length = 0
    // while (true) {
    //     const chunk = o.read();
    //     if (chunk === null) break;
    // }
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
    return o instanceof stream.Stream && typeof o._read === 'function' && typeof o._readableState === 'object';
}

/**
 * @param {import("fs").WriteStream | any} o 
 * @returns {boolean}
 */
function _isWritableStream(o) {
    return o instanceof stream.Stream && typeof o._write === 'function' && typeof o._writableState === 'object';
}

function _isURL(s, protocols = ["http", "https"]) {
    try {
        const url = new URL(s);
        return protocols ? url.protocol ? protocols.map(x => `${x.toLowerCase()}:`).includes(url.protocol) : false : true;
    } catch (err) {
        return false;
    }
};

async function _createTempFolder() {
    try {
        await access(path.join(__dir__(), ".tmp"), fs.constants.F_OK);
    } catch (e) {
        await fs.mkdir(path.join(__dir__(), ".tmp"), { recursive: true });
        // console.error("TEMP ERROR:", e);
        // throw e;
    }
}

function __undefinedTag(s = '') {
    const _res = (s.split?.("\n").map?.(_s => {
        const _ar = /(["'])(?:(?=(\\?))\2.)*?\1/gi.exec(_s);
        return _ar?.[0]
    }) || [])?.filter?.(_s => typeof _s === "string");
    return _res;
}

async function __ispathDir(s) {
    try {
        return (await fs.stat(s)).isDirectory();
    } catch (e) {
        return false;
    }
}

function __create_path(s, sep = false) {
    const _s = path.join(__dir__(), `.tmp/${s}`)
    // return _s.replace(/(\s+)/g, '\\$1');
    if (!sep) return _s;
    return _s.split(path.sep).map(_p => {
        if (_p.includes(" ")) {
            return `"${_p}"`
        }
        return _p;
    }).join(path.sep);
}

async function __rmTempFiles(file) {
    try {
        if (Array.isArray(file)) {
            await Promise.all(file.map(_f => unlink(_f)));
            return;
        }
        await unlink(file);
    } catch (e) {
        throw new Error("An error occurred while deleting the cache files");
    }

}

const __META_UTILS__ = {
    _clr_read_buffer_,
    _checkTmpFile,
    _isReadableStream,
    _isWritableStream,
    _isURL,
    _createTempFolder,
    __undefinedTag,
    __ispathDir,
    __create_path,
    __rmTempFiles,
}

export default __META_UTILS__;