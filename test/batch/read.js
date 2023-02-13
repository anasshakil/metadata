import { createReadStream } from "node:fs";
import path from "node:path"
import Metadata from "../../lib/index.js";
import { __dir__ } from "../../__dir.js";

async function readMultipleFromNet() {
    try {
        const metadata = await Metadata.get([
            "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4",
            "https://i.imgur.com/poGB3tF.jpeg",
        ], {
            batch: {
                no_network_cache: true
            }
        });
        console.log(metadata);
    } catch (e) {
        console.error(e)
    }
}

async function readMultipleFromStream() {
    try {
        const s1 = createReadStream(path.join(__dir__(), "test/sample.pdf"));
        const s2 = createReadStream(path.join(__dir__(), "test/s3.jpg"));
        const metadata = await Metadata.get([s2, s1]);
        console.log(metadata);
    } catch (e) {
        console.error(e)
    }
}

async function readMultipleFromDisk() {
    try {
        const metadata = await Metadata.get([
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
            path.join(__dir__(), "test/samples/s1.pdf"),
            path.join(__dir__(), "test/samples/s3.jpg"),
        ], {
            fast: true,
            // stream: true
            // tags: [{ name: "SourceFile" }]
        });
        // metadata.on("data", (d) => {
        // implement custom parser 
        // })
        console.log("Metadata", metadata);
    } catch (e) {
        console.error(e);
    }
}

async function readMultipleFromDirectory() {
    try {
        const metadata = await Metadata.get("/path/to/dir/samples");
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}

async function readAllFromMixed() {
    try {
        const s2 = createReadStream(path.join(__dir__(), "test/s3.jpg"));
        const metadata = await Metadata.get([
            "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4",
            path.join(__dir__(), "test/sample.pdf"),
            s2,
        ], {
            batch: {
                no_network_cache: true
            }
        });
        // Output: In sequence of input array.
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}

// readMultipleFromNet();
// readMultipleFromStream();
(async () => {
    await readMultipleFromDisk();
    console.log("*****************************");
    await readMultipleFromDisk();
    console.log("*****************************");
    await readMultipleFromDisk();
});

(() => {
    readMultipleFromDisk();
    console.log("*****************************");
    readMultipleFromDisk();
    console.log("*****************************");
    readMultipleFromDisk();
})();

// readMultipleFromDirectory();
// readAllFromMixed();