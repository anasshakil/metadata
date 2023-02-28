import Metadata from "../lib/index.js";
import path from "node:path";
import { __dir__ } from "../__dir.js";
import { createReadStream } from "node:fs";

async function write() {
    try {
        const _file = path.join(__dir__(), "examples/samples/test.pdf");
        const metadata = await Metadata.set(_file, {
            path: path.join(__dir__(), ".exiftool/exiftool"),
            metadata: true,
            new: true,
            tags: [
                {
                    name: "Hello",
                    value: "N/A",
                },
                {
                    name: "World",
                    value: "N/A",
                },
            ],
        });
        console.log(JSON.stringify(metadata, null, 4));
    } catch (e) {
        console.error("e", e);
    }
}

async function streamFile() {
    try {
        const rs = createReadStream(
            path.join(__dir__(), "examples/sample.pdf")
        );
        const metadata = await Metadata.set(rs, {
            tags: [
                {
                    name: "Sig",
                    value: "ANas123@@@01=12",
                },
            ],
        });
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

async function streamURL() {
    try {
        const metadata = await Metadata.set(
            "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            {
                del_cache_on_error: true,
                tags: [
                    {
                        name: "Sig",
                        value: "Test_123@@",
                    },
                ],
            }
        );
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

write();
// streamFile();
// streamURL();
