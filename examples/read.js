import { createReadStream } from "node:fs";
import path from "node:path";
import { __dir__ } from "../__dir.js";
import Metadata from "../lib/index.js";

async function read() {
    try {
        const _file = path.join(__dir__(), "examples/samples/s1.pdf");
        const metadata = await Metadata.get(_file, {
            path: path.join(__dir__(), ".exiftool/exiftool"),
            tags: [{ name: "Author" }],
            fast: true,
        });
        // console.log(Object.keys(metadata[0]).length)
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

async function streamFile() {
    try {
        const rs = createReadStream(
            path.join(__dir__(), "examples/sample.pdf")
        );
        const metadata = await Metadata.get(rs, {
            tags: [
                {
                    name: "FileName",
                    exclude: true,
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
        const metadata = await Metadata.get(
            "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            {
                no_cache: true,
                all: true,
            }
        );
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

read();
// streamFile();
// streamURL();
