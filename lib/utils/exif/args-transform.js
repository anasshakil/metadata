/**
 * 
 * @param {import("../../meta.js").ExifReadOPTag[]} args
 * @returns {string[]} 
 */
export function _argsReadRaw(args = []) {
    const _args = [];
    args.forEach((tag) => {
        if (tag.custom) {
            _args.push(tag.custom);
        } else {
            _args.push(`-${tag.exclude ? '-' : ''}${tag.name}`);
        }
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
        if (tag.custom) { return _args.push(tag.custom); }
        const { name, value } = tag;
        const del = value === null || typeof value === "undefined";
        _args.push(`-${name}=${del ? '' : value}`);
    });
    return _args;
}