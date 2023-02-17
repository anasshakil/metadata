"use strict";

import { __ext__, __w__, __c__ } from "./meta.js";
import {
    _exiftoolConfigurator,
    __rmTempFiles,
} from "./utils/exif/configurator.js";
import { __raw__cmd__ } from "./utils/raw_exec.js";

const Metadata = {
    configurator: _exiftoolConfigurator,
    get: __ext__,
    set: __w__,
    copy: __c__,
    clear: __rmTempFiles,
    cli: __raw__cmd__,
};

export default Metadata;
