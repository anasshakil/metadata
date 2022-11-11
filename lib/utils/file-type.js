// import { fileTypeFromFile } from "file-type";

export function __mimeType(path) {
    try {
        return fileTypeFromFile(path);
    } catch (e) {
        throw e;
    }
}

__mimeType("/media/anas/Dev/playground/streams/samples/sample.pdf")