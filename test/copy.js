import Metadata from "../lib/index.js";
import path from "node:path";
import { __dir__ } from "../__dir.js";
import { createReadStream } from "node:fs";

async function copyFromFileToStream() {
    try {
        const _file1 = path.join(__dir__(), "test", "samples", "s1.pdf");
        const _file2 = createReadStream(path.join(__dir__(), "test", "samples", "s2.pdf"));
        const result = await Metadata.copy(_file1, _file2, {
            fast: true,
            src: {
                // metadata: true,
                tags: [
                    {
                        name: "Author"
                    }
                ]
            },
            dst: {
                metadata: true,
                new: true,
                tags: [
                    {
                        name: "Author"
                    }
                ]
            }
        });
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
}

copyFromFileToStream();