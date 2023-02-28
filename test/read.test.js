import { describe, it, after } from "node:test";
import path from "node:path";
import { __dir__ } from "../__dir.js";
import Metadata from "../lib/index.js";

const _exifPath = path.join(__dir__(), ".exiftool/exiftool");
const _file = path.join(__dir__(), "examples/samples/s1.pdf");

describe("Read files with local paths", () => {
    after(() => {
        Metadata.CLI.kill();
    });
    it("Will read single file with default", async () => {
        const metadata = await Metadata.get(_file, {
            path: _exifPath,
            tags: [{ name: "Author" }],
            fast: false,
        });
    });
});
