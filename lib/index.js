"use strict";

import { __ext__, __w__, __c__ } from "./meta.js";
import { _kill_process_ } from "./utils/cmd.js";
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
    CLI: __raw__cmd__,
    stop: _kill_process_,
};

export default Metadata;
