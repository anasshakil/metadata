"use strict";

import { __ext__, __w__, __c__ } from "./meta.js";
import { _exiftoolConfigurator, __rmTempFiles } from "./utils/exif/configurator.js";

const Metadata = {
    configurator: _exiftoolConfigurator,
    get: __ext__,
    set: __w__,
    copy: __c__,
    clear: __rmTempFiles
}

export default Metadata;