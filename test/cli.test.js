import { describe, it, after, before } from "node:test";
import path from "node:path";
import { __dir__ } from "../__dir.js";
import Metadata from "../lib/index.js";

const _exifPath = path.join(__dir__(), ".exiftool/exiftool");
const _file = path.join(__dir__(), "examples/samples/s1.pdf");

describe("Read files with local paths with CLI", () => {
    after(() => {
        Metadata.CLI.kill();
    });

    it("Will read single file", () => {
        return new Promise(function (resolve, reject) {
            const sub1 = Metadata.CLI.run(
                `-j -q ${_file}`,
                (e, d) => {
                    Metadata.CLI.stop(sub1);
                    if (e) {
                        return reject(e);
                    }
                    resolve(d);
                },
                {
                    path: _exifPath,
                }
            );
        });
    });

    it("Will read single file twice with queue option", () => {
        return new Promise(function (resolve, reject) {
            Metadata.CLI.run(
                `-j -q ${_file}`,
                (e, d) => {
                    if (e) {
                        return reject(e);
                    }
                },
                {
                    path: _exifPath,
                    queue: true,
                }
            );
            Metadata.CLI.run(
                `-j -q ${_file}`,
                (e, d) => {
                    if (e) {
                        return reject(e);
                    }
                    resolve(d);
                },
                {
                    path: _exifPath,
                    queue: true,
                }
            );
        });
    });
});

describe("Write custom metadata tag to the file with CLI", () => {
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
        Metadata.CLI.kill();
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
    it("should write Test_tag to the file", () => {
        return new Promise(function (resolve, reject) {
            const subscriberId = Metadata.CLI.run(
                // Using command array due to spaces in tag value or uncertainty of spaces in file path.
                [`-Test_tag="Tag added from CLI"`, `${_file}`],
                (e, d) => {
                    Metadata.CLI.stop(subscriberId);
                    if (e) {
                        return reject(e);
                    }
                    resolve(d);
                },
                {
                    path: _exifPath,
                    config: path.join(__dir__(), ".config_files/default.cfg"),
                }
            );
        });
    });
});
