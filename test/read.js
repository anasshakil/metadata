import { createReadStream } from "node:fs";
import path from "node:path";
import { __getDir } from "../__dir.js";
import Metadata from "../lib/index.js";

async function read() {
    try {
        const _file = path.join(__getDir(), ".tmp/e40e2f6a513ce6c3872c196c0fd750e5ecacfada97a5477744be2ec5053a1fa4");
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
            disable_cache: false
        });
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

// read();
// streamFile();
// streamURL();