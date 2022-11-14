import { createReadStream } from "node:fs";
import path from "node:path";
import { __getDir } from "../__dir.js";
import Metadata from "../lib/index.js";

async function read() {
    try {
        const _file = path.join(__getDir(), "test/sample.pdf");
        const metadata = await Metadata.get(_file);
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

async function streamFile() {
    try {
        const rs = createReadStream(path.join(__getDir(), "test/sample.pdf"))
        const metadata = await Metadata.get(rs, {
            tags: [
                {
                    name: "FileName",
                    exclude: true
                }
            ]
        })
        console.log(metadata)
    } catch (e) {
        console.error("e", e)
    }
}


async function streamURL() {
    try {
        const metadata = await Metadata.get("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", {
            no_cache: true
        });
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

// read();
// streamFile();
streamURL();