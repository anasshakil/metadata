import fs, { access } from "node:fs/promises";
import path from "node:path";
import { URL } from "node:url";
import { __getDir } from "../../__dir.js";

export async function _checkTmpFile(url) {
    try {
        await access(url, fs.constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

export function _isReadableStream(obj) {
    return obj instanceof stream.Stream && typeof obj._read === 'function' && typeof obj._readableState === 'object';
}

export function _isURL(s, protocols = ["http", "https"]) {
    try {
        const url = new URL(s);
        return protocols ? url.protocol ? protocols.map(x => `${x.toLowerCase()}:`).includes(url.protocol) : false : true;
    } catch (err) {
        return false;
    }
};

export async function _createTempFolder() {
    try {
        await access(path.join(__getDir(), ".tmp"), fs.constants.F_OK);
    } catch (e) {
        await fs.mkdir(path.join(__getDir(), ".tmp"), { recursive: true });
        // console.error("TEMP ERROR:", e);
        // throw e;
    }
}

export function __undefinedTag(s = '') {
    const _res = (s.split?.("\n").map?.(_s => {
        const _ar = /(["'])(?:(?=(\\?))\2.)*?\1/gi.exec(_s);
        return _ar?.[0]
    }) || [])?.filter?.(_s => typeof _s === "string");
    return _res;
}

export async function __ispathDir(s) {
    try {
        return (await fs.stat(s)).isDirectory();
    } catch (e) {
        return false;
    }
}

export function __create_path(s, sep = false) {
    const _s = path.join(__getDir(), `.tmp/${s}`)
    // return _s.replace(/(\s+)/g, '\\$1');
    if (!sep) return _s;
    return _s.split(path.sep).map(_p => {
        if (_p.includes(" ")) {
            return `"${_p}"`
        }
        return _p;
    }).join(path.sep);
}