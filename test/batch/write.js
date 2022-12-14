import { createReadStream } from "node:fs";
import path from "node:path"
import Metadata from "../../lib/index.js";
import { __getDir } from "../../__dir.js";

async function writeMultipleFromNet() {
    try {
        const metadata = await Metadata.set([
            "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4",
            "https://i.imgur.com/poGB3tF.jpeg",
        ], {
            new: true,
            tags: [
                {
                    name: "Author",
                    value: "John Doe",
                }
            ]
        });
        console.log(metadata);
    } catch (e) {
        console.error(e)
    }
}

async function writeMultipleFromStream() {
    try {
        const s1 = createReadStream(path.join(__getDir(), "test/sample.pdf"));
        const s2 = createReadStream(path.join(__getDir(), "test/s3.jpg"));
        const metadata = await Metadata.set([s2, s1], {
            tags: [
                {
                    name: "Author",
                    value: "John Doe"
                }
            ]
        });
        console.log(metadata);
    } catch (e) {
        console.error(e)
    }
}

async function writeMultipleFromDisk() {
    try {
        const metadata = await Metadata.set([
            path.join(__getDir(), "test/sample.pdf"),
            path.join(__getDir(), "test/s3.jpg")
        ], {
            tags: [
                {
                    name: "Author",
                    value: "John Doe"
                }
            ]
        });
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}

async function writeMultipleFromDirectory() {
    try {
        const _p = path.join(__getDir(), "test/samples");
        const metadata = await Metadata.set(_p || "/path/to/dir/samples", {
            new: true,
            metadata: true,
            tags: [
                {
                    name: "Author",
                    value: "John Doe"
                }
            ]
        });
        console.log(JSON.stringify(metadata, null, 4));
    } catch (e) {
        console.error(e);
    }
}

async function writeAllFromMixed() {
    try {
        const s2 = createReadStream(path.join(__getDir(), "test/s3.jpg"));
        const metadata = await Metadata.set([
            "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4",
            path.join(__getDir(), "test/sample.pdf"),
            s2,
        ], {
            new: true,
            // metadata: true,
            tags: [
                {
                    name: "Author",
                    value: "N/A"
                }
            ]
        });
        // Output: In sequence of input array.
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}

// writeMultipleFromNet();
// writeMultipleFromStream();
// writeMultipleFromDisk();
writeMultipleFromDirectory();
// writeAllFromMixed();