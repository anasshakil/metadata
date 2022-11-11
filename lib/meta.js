import crypto from "node:crypto";
import fs, { createWriteStream } from "node:fs";
import { _cmdExec } from "./utils/cmd.js";
import path from "node:path";
import { __getDir } from "../__root.js";
import { _argsReadRaw } from "./utils/exif/args-transform.js";
import { unlink, access } from "node:fs/promises";
import { URL } from "node:url";
import https from "node:https"
import http from "node:http"
import { _generateHash } from "./utils/crypto.js";

/**
 * @typedef {Object} ExifReadOPTag
 * @property {string} name The name of the metadata tag
 * @property {boolean} [exclude] To exclude this tag from the result
 * 
 * @typedef {Object} ExifWriteOPTag
 * @property {string} name The name of the metadata tag. If it's a custom tag, make sure to initialize configurator. 
 * @property {string | number} [value] The value of the metadata tag. If empty the tag will be mark as to removed
 * 
 * @typedef {Object} ExifMetadataReadOptions
 * @property {ExifReadOPTag[]} tags
 * @property {boolean} [cache_stream]  [Default: false]. Cache the network stream to a temporary file. This is useful when the stream is limited or large files could be an input for metadata from the internet. This feature will help in saving network bandwidth. Please note to save disk space the temporary files will be deleted every time the node server restart. Local file streams will be automatically deleted after reading the metadata.
 */

/**
 * @param {string | import("node:fs").ReadStream} file
 * @param {ExifMetadataReadOptions} [options] 
 */
export async function getMetadata(file, options = {}) {
    let tempFile = file;
    let del = false;
    try {
        const { tags, cache_stream } = options;
        if (!file) {
            throw new Error("Invalid file path or unreadable stream passed as an argument")
        }
        if (typeof file !== "string") {
            del = true;
            tempFile = await _streamFile(file);
        } else if (_isURL(file)) {
            del = !(cache_stream === true);
            tempFile = await _streamURL(file);
        }
        const _args = _argsReadRaw(tags);
        const result = await _cmdExec(tempFile, {
            args: _args
        });
        if (del) { unlink(tempFile); }
        return result;
    } catch (e) {
        if (del) { await unlink(tempFile); }
        throw e;
    }
}

async function _streamFile(rs) {
    try {
        const tempFile = path.join(__getDir(), `.tmp/${crypto.randomUUID()}`);
        const ws = createWriteStream(tempFile, { flags: "wx" });
        rs.pipe(ws);
        await new Promise((resolve) => {
            rs.on("close", () => {
                resolve(null);
            });
        });
        return tempFile;
    } catch (e) {
        throw e;
    }
}

async function _streamURL(url = "") {
    try {
        const _hex = _generateHash(url)
        const tempFile = path.join(__getDir(), `.tmp/${_hex}`);
        if (await _checkTmpFile(tempFile)) {
            return tempFile;
        }
        const ws = createWriteStream(tempFile, { flags: "wx" });
        await new Promise((resolve) => {
            https.get(url, (rs) => {
                rs.pipe(ws);
                rs.on("close", () => {
                    resolve(null);
                });
            });
        });
        return tempFile;
    } catch (e) {
        throw e;
    }
}

function _isURL(s, protocols = ["http", "https"]) {
    try {
        const url = new URL(s);
        return protocols
            ? url.protocol
                ? protocols.map(x => `${x.toLowerCase()}:`).includes(url.protocol)
                : false
            : true;
    } catch (err) {
        return false;
    }
};

async function _checkTmpFile(url) {
    try {
        await access(url, fs.constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}