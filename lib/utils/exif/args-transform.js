/**
 * 
 * @param {ExifReadOPTag[]} args
 * @returns {string[]} 
 */
export function _argsReadRaw(args = []) {
    const _args = [];
    args.forEach(tag => {
        _args.push(`-${tag.exclude ? '-' : ''}${tag.name}`);
    });
    return _args;
}

/**
 * 
 * @param {Exif} args 
 * @returns {string[]}
 */
export function _argsWriteRaw(args = []) {

}