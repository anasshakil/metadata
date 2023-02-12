"use strict";

/**
 * 
 * @param {import("../../meta.js").ExifReadOPTag[]} args
 * @returns {string[]} 
 */
export function _argsReadRaw(args = []) {
    const _args = [];
    args.forEach((tag) => {
        const { name, exclude, custom } = tag;
        if (custom) { return _args.push(custom); }
        _args.push(`-${exclude ? '-' : ''}${name}`);
    });
    return _args;
}

/**
 * 
 * @param {import("../../meta.js").ExifWriteOPTag[]} args 
 * @returns {string[]}
 */
export function _argsWriteRaw(args = []) {
    const _args = [];
    args.forEach((tag) => {
        const { name, value, custom } = tag;
        if (custom) { return _args.push(custom); }
        const _d = value === null || typeof value === "undefined";
        _args.push(`-${name}=${_d ? '' : value}`);
    });
    return _args;
}