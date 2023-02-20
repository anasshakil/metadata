import Metadata from "../lib/index.js";
import { __dir__ } from "../__dir.js";
import path from "node:path";

const demo = path.join(__dir__(), "test/samples/s1.pdf");
const exifToolPath = path.join(__dir__(), ".exiftool/exiftool");

const sub1 = Metadata.CLI.run(
    `-j -q ${demo}`,
    (e, d) => {
        Metadata.CLI.stop(sub1);
        console.log(e || d);
    },
    {
        path: exifToolPath,
    }
);

const sub2 = Metadata.CLI.run(
    `-j -q -author ${demo}`,
    (e, d) => {
        Metadata.CLI.stop(sub2);
        console.log(e || d);
    },
    {
        path: exifToolPath,
    }
);

(() => {
    setTimeout(function () {
        const sub3 = Metadata.CLI.run(
            `-j -q -author ${path.join(__dir__(), "test/samples")}`,
            function (e, d) {
                Metadata.CLI.stop(sub3);
                console.log(e || d);
            },
            {
                path: exifToolPath,
            }
        );
    }, 3000);
})();
