import fs, { access } from "node:fs/promises";
import { URL } from "node:url";

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