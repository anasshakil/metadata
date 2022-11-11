import { createReadStream } from "node:fs";
import path from "node:path";
import { __getDir } from "../__root.js";
import { getMetadata } from "../lib/meta.js"

async function read() {
    try {
        const _file = path.join(__getDir(), "test/sample.pdf");
        const metadata = await getMetadata(_file);
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

async function streamFile() {
    try {
        const rs = createReadStream(path.join(__getDir(), "test/sample.pdf"))
        const metadata = await getMetadata(rs, {
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
        const metadata = await getMetadata("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", {
            cache_stream: false
        });
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

// read();
// streamFile();
// streamURL();