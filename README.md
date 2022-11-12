# Node-Metadata

An advanced Node.js interface to the exiftool. 🚀

> “An amazing level of senseless perfectionism,
> which is simply impossible not to respect.”

[Exiftool](https://exiftool.org/) is an amazing tool written by Phil Harvey in Perl which can read and write metadata to a number of file formats. This library supports streams. So, you don't have to handle anything from your end. It also cache network files to save your bandwidth.

## Table of Contents

-   [API](#api)
    -   [Extract Metadata](#extract-metadata)
    -   [Edit Metadata](#edit-metadata)
-   [Test](#test)
    -   [Jest](#jest)
-   [Tools](#tools)

## Install

```bash
npm install --save @enviro/metadata
```

## Import & Configure

```js
import Metadata from "@enviro/metadata";

// OPTIONAL
// only required if you are using user-defined tags
async function config() {
    await Metadata.configurator({
        default: true,
        tags: [
            {
                name: "CUSTOM_TAG",
                type: "string",
                exifPropGroup: "Exif",
                exifPropSubGroup: "Main",
            },
            {
                name: "CUSTOM_TAG",
                type: "string",
                exifPropGroup: "PDF",
                exifPropSubGroup: "Info",
            },
        ],
    });
}
```

## API

### Extract Metadata

-   #### File Path

```js
async function read() {
    try {
        const metadata = await Metadata.get("test.pdf", {
            // OPTIONAL - tags
            tags: [
                {
                    name: "FileName",
                    exclude: true,
                },
            ],
        });
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}
```

-   #### Output

```js
// FileName excluded from the result
[
    {
        FileSize: "89 kB",
        FileModifyDate: "2022:11:11 17:08:58+05:00",
        FileAccessDate: "2022:11:11 17:08:58+05:00",
        FileInodeChangeDate: "2022:11:11 17:08:58+05:00",
        FilePermissions: "-rwxrwxrwx",
        FileType: "PDF",
        FileTypeExtension: "pdf",
        MIMEType: "application/pdf",
        PDFVersion: 1.3,
        Linearized: "No",
        Encryption: "Standard V1.2 (40-bit)",
        UserAccess:
            "Print, Copy, Annotate, Fill forms, Extract, Assemble, Print high-res",
        CreateDate: "2001:10:26 13:39:34",
        Producer: "Acrobat Distiller 4.05 for Windows",
        ModifyDate: "2001:10:26 13:40:41-04:00",
        Title: "PDF Bookmark Sample",
        Author: "Accelio Corporation",
        PageCount: 4,
    },
];
```

-   #### File Stream

```js
import { createReadStream } from "node:fs";

async function streamFile() {
    try {
        const rs = createReadStream("sample.pdf");
        const metadata = await Metadata.get(rs);
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}
```

-   #### URL Stream

```js
async function streamURL() {
    try {
        const metadata = await Metadata.get(
            "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            {
                cache_stream: true,
            }
        );
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}
```

### Edit Metadata

-   #### File Path

```js
async function write() {
    try {
        const metadata = await Metadata.set("sample.pdf", {
            tags: [
                {
                    name: "CUSTOM_TAG",
                    value: "1234567890",
                },
            ],
        });
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}
```

-   #### File Stream

```js
async function streamFile() {
    try {
        const rs = createReadStream("sample.pdf");
        const metadata = await Metadata.set(rs, {
            tags: [
                {
                    name: "CUSTOM_TAG",
                    value: null, // An empty tag will delete the tag from the file
                },
            ],
        });
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}
```

-   #### URL Stream

```js
async function streamURL() {
    try {
        // NOTE: This pdf has a size of 26 MB
        const metadata = await Metadata.set(
            "https://research.nhm.org/pdfs/10840/10840.pdf",
            {
                tags: [
                    {
                        name: "CUSTOM_TAG",
                        value: "NEW_VALUE",
                    },
                ],
            }
        );
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}
```

-   #### OUTPUT

```js
{
  message: 'File updated successfully!',
  file: '../../dir/to/the/sample.pdf' // Path to the file which metadata was edited
  // OR this type of path will be generated for streams
  file: '../../path/to/dir/.tmp/0b00f9b2-cc7d-48b6-8fad-d7e2992de663'
}
```

### NOTE

-   The package is pure ESM. It cannot be require() from CommonJS.
-   Future version might break backward compatibility.
-   Check release notes for breaking changes.

## Test

sample implementation can be found inside [test directory].

### Jest

-   ##### Future milestone

## Tools

-   ##### Comming Soon

[test directory]: https://github.com/anasshakil/metadata/tree/main/test
