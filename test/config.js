import Metadata from "../lib/index.js";

async function config1() {
    await Metadata.configurator({
        args: [
            {
                name: "Sig",
                type: "string",
                exifPropGroup: "Exif",
                exifPropSubGroup: "Main"
            },
            {
                name: "Key1",
                type: "string",
                exifPropGroup: "Exif",
                exifPropSubGroup: "Main"
            },
            {
                name: "Key2",
                type: "string",
                exifPropGroup: "Exif",
                exifPropSubGroup: "Main"
            },
            {
                name: "Sig",
                type: "string",
                exifPropGroup: "PDF",
                exifPropSubGroup: "Info"
            },
            {
                name: "KeyPDF1",
                type: "string",
                exifPropGroup: "PDF",
                exifPropSubGroup: "Info"
            },
            {
                name: "KeyPDF2",
                type: "string",
                exifPropGroup: "DOCX",
                exifPropSubGroup: "Microsoft"
            }
        ],
        // keyCodeEvaluator: 60248
    });
}

config1();