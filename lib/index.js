import { getMetadata, writeMetadata } from "./meta.js";
import { _exiftoolConfigurator, __rmTempFiles } from "./utils/exif/configurator.js";

const Metadata = {
    configurator: _exiftoolConfigurator,
    get: getMetadata,
    set: writeMetadata,
    clear: __rmTempFiles
}

export default Metadata;