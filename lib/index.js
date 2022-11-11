import { getMetadata, writeMetadata } from "./meta.js";
import { _exiftoolConfigurator } from "./utils/exif/configurator.js";

const Metadata = {
    configurator: _exiftoolConfigurator,
    get: getMetadata,
    set: writeMetadata
}

export default Metadata;