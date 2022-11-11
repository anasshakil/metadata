import Metadata from "../lib/index.js";
import crypto from "node:crypto";
import path from "node:path";
import { __getDir } from "../__root.js";
import { createReadStream } from "node:fs";

async function write() {
    try {
        const _file = path.join(__getDir(), "test/sample.pdf");
        const metadata = await Metadata.set(_file, {
            tags: [
                {
                    name: "Sig",
                    value: crypto.randomUUID()
                }
            ]
        });
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

async function streamFile() {
    try {
        const rs = createReadStream(path.join(__getDir(), "test/sample.pdf"))
        const metadata = await Metadata.set(rs, {
            tags: [
                {
                    name: "Sig",
                    value: "ANas123@@@01=12"
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
        const metadata = await Metadata.set("https://research.nhm.org/pdfs/10840/10840.pdf", {
            tags: [
                {
                    name: "Sig",
                    value: "Test_123@@"
                }
            ]
        });
        console.log(metadata);
    } catch (e) {
        console.error("e", e);
    }
}

// write();
// streamFile();
// streamURL();