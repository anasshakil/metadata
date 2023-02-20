"use strict";

import __META_UTILS__ from "./utils.js";

const { __undefinedTag } = __META_UTILS__;

function _perlNotInstalled(e) {
    const { errno, code, path, syscall } = e;
    if (
        errno === -4058 &&
        code === "ENOENT" &&
        path === "perl" &&
        syscall === "spawn perl"
    ) {
        return "Perl is not installed on your system, please install it first.";
    }
    return false;
}

function _handleStringErrors_(e) {
    if (e.includes("Can't open perl script")) {
        e = {
            error: "Failed to load ExifTool.",
        };
    } else if (e.includes("Nothing to do.\r\n")) {
        const _udTags = __undefinedTag(e);
        if (_udTags.length > 0) {
            const _nErr = {
                tags: _udTags,
                error: "Seems like you're using user-defined tag(s), make sure you have initialized the configurator with proper group & sub-group.",
            };
            return _nErr;
        }
        e +=
            "Seems like you're using user-defined tag(s), make sure you have initialized the configurator with proper tag group & tag sub-group.";
    }
    return e;
}

export default function _META_ERRORS_(e) {
    if (typeof e === "string") {
        return _handleStringErrors_(e);
    }
    const _isNotInstalled = _perlNotInstalled(e);
    return _isNotInstalled ? _isNotInstalled : e;
}
