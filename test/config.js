import Metadata from "../lib/index.js";

async function config1() {
    await Metadata.configurator({
        tags: [
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

async function config2() {
    await Metadata.configurator({
        default: false,
        tags: [
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
    })
}

// config1();
// config2();