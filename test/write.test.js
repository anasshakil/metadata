import { describe, it, after, before } from "node:test";
import path from "node:path";
import { __dir__ } from "../__dir.js";
import Metadata from "../lib/index.js";
import { deepStrictEqual } from "node:assert";

const _exifPath = path.join(__dir__(), ".exiftool/exiftool");
const _file = path.join(__dir__(), "examples/samples/s2.pdf");

describe("Write custom metadata tag to the file", () => {
    before(async () => {
        await Metadata.configurator({
            tags: [
                {
                    name: "Test_tag",
                    type: "string",
                    exifPropGroup: "PDF",
                    exifPropSubGroup: "Info",
                },
            ],
        });
    });
    after(async () => {
        await Metadata.set(_file, {
            path: _exifPath,
            metadata: true,
            new: true,
            tags: [
                {
                    name: "Test_tag",
                },
            ],
        });
    });
    it("should write Test_tag to the file", async () => {
        const metadata = await Metadata.set(_file, {
            path: _exifPath,
            metadata: true,
            new: true,
            tags: [
                {
                    name: "Test_tag",
                    value: "N/A",
                },
            ],
        });
        deepStrictEqual(metadata.metadata.new[0].Test_tag, "N/A");
    });
});
