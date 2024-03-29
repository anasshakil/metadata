# Node-Metadata
<!-- ### Pre-Release Version -->
An advanced Node.js interface to the exiftool. 🚀

> “An amazing level of senseless perfectionism, which is simply impossible not to respect.”

[Exiftool](https://exiftool.org/) is an amazing tool written by Phil Harvey in Perl which can read and write metadata to a number of file formats. This library supports streams. So, you don't have to handle anything from your end. It also cache network files to save your bandwidth.

## Table of Contents

-   [Requirements](#requirements)
-   [API](#api)
    -   [Extract Metadata](#extract-metadata)
    -   [Add/Edit Metadata](#addedit-metadata)
    -   [Copy Metadata](#copy-metadata)
    -   [Read/Write Options](#readwrite-options)
    -   [Cache](#cache)
-   [Advanced](#advanced)
    -   [Custom Configuration](#custom-configuration)
    -   [Performance](#performance)
    -   [CLI](#cli)
-   [_Experimental Features_](#experimental-features)
-   [Test](#examples)
    -   [Jest](#jest)
-   [Tools](#tools)
-   [Known Issues](#known-issues)
-   [Sponsor](#sponsor)
-   [License](#license)

## Install

```bash
npm install @enviro/metadata
```

## Requirements

-   Exiftool need perl to be installed on your system, [Download Perl](https://www.perl.org).
-   Node.js version >= 16.x
-   ExifTool is no longer included with this package, [Download ExifTool](https://sourceforge.net/projects/exiftool/).<br>Read more about seamless ExifTool integration using `path` option in [documentation](#ExifMetadataReadWriteOptions).

## Import & Configure

```js
import Metadata from "@enviro/metadata";

// OPTIONAL
// only required if you are using user-defined tags
async function config() {
    await Metadata.configurator({
        default: true,
        no_cache_cleanup: true,
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

-   #### Options

    | Name | Type | Description |
    | --- | --- | --- |
    | `default` | `boolean` | **[Advanced]**<br>**_Default_ `undefined`**<br>The default configuration use hex keys in file. If you want to use key name in file, set this option explicitly `false`. |
    | `keyCodeEvaluator` | `number` | **[Advanced]**<br>The value must be greater than **53248**. This is the default key for the first user-defined tag. |
    | `no_cache_cleanup` | `boolean` | This will stop auto cache cleaner on node server startup. |
    | `tags` | `[ExifCustomTag]` | Configure Exiftool to add or remove new metadata tags to the file. |

    -   #### _ExifCustomTag_

        | Name | Type | Description |
        | --- | --- | --- |
        | `name` | `string` | The name of the custom tag. |
        | `type` | `"string"` | Type of the custom tag's value. You can pass custom valid type in here which is supported by exif tag group. |
        | `exifPropGroup` | `"Exif"`\|`"PDF"`\| `string` | The custom tag's belongs to this group. Custom group can be passed as an argument. Read more at [Family 0 (Information Type)](https://exiftool.org/#groups) |
        | `exifPropSubGroup` | `"Main"`\|`"Info"`\| `string` | The custom tag's belongs to this specific sub group. Custom sub-group can be passed as an argument. Read more at [Family 1 (Specific Location)](https://exiftool.org/#groups) |

## API

-   ### Extract Metadata

    -   #### Local File

    ```js
    async function read() {
        try {
            const metadata = await Metadata.get("test.pdf", {
                // path not required, since ExifTool is accessible from terminal using exiftool.
                // path: "exiftool",
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

    FileName excluded from the result.

    -   #### File Stream

    ```js
    import { createReadStream } from "node:fs";

    async function streamFile() {
        try {
            const rs = createReadStream("sample.pdf");
            const metadata = await Metadata.get(rs, {
                path: "path/to/ExifTool",
            });
            console.log(metadata);
        } catch (e) {
            console.error(e);
        }
    }
    ```

    -   #### Network Stream

    ```js
    async function streamURL() {
        try {
            const metadata = await Metadata.get(
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                {
                    no_cache: true,
                }
            );
            console.log(metadata);
        } catch (e) {
            console.error(e);
        }
    }
    ```

    -   #### Options

    | Name | Type | Description |
    | --- | --- | --- |
    | `fileName` | `string` | Read: [Cache file name](#custom-cache-file-name). |
    | `no_cache` | `boolean` | This option doesn't work on local file path passed as a parameter. `no_cache: true` default for stream, read more about [Stream caching](#custom-cache-file-name). `no_cache: false` default for network file, read more [Network stream](#network-stream). |
    | `tags` | `[ExifReadOPTag]` | Filter the output metadata tags either excluded them or only include them. |
    | `all` | `boolean` | **_Default_ `false`**<br>If `true`, all the metadata tags will be returned. This will override the `tags` option.<br>**NOTE**: This option can cause significant performance issues. Use it only if you need all the metadata tags. |
    | `batch` | `BatchReadOptions` | Options for batch processing. |

    -   #### _ExifReadOPTag_

        | Name | Type | Description |
        | --- | --- | --- |
        | `name` | `string` | Name of the metadata tag. |
        | `exclude` | `boolean` | `exclude: true` exclude this tag from the result. `exclude: false` make this tag exclusive. |
        | `custom` | `string` | **[Advanced]**<br>Custom Exiftool reading command can be directly passed to `custom`.<br>Read more about [exiftool commands](https://exiftool.org/exiftool_pod.html#READING-EXAMPLES). |

    -   #### _BatchReadOptions_

        | Name | Type | Description |
        | --- | --- | --- |
        | `no_network_cache` | `boolean`\|`[string]` | **_Default_ `false`**.<br>If `true`, the network files will not be cached. If specified list of URLs provided, than that URLs will not be cached. |
        | `no_stream_cache` | `[string]` | **_Default_ `null`**.<br>If file name is not valid for stream perspective, then that specific stream will not be cached. `[]` or `null` means all streams will be discarded after reading metadata. |

-   ### Add/Edit Metadata

    -   #### Local File

    ```js
    async function write() {
        try {
            const metadata = await Metadata.set("sample.pdf", {
                tags: [
                    {
                        name: "CUSTOM_TAG",
                        value: "custom value",
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
                path: "path/to/ExifTool",
                tags: [
                    {
                        name: "CUSTOM_TAG",
                        value: null,
                    },
                ],
            });
            console.log(metadata);
        } catch (e) {
            console.error(e);
        }
    }
    ```

    An empty tag will delete the tag from the file.

    -   #### Network Stream

    ```js
    async function streamURL() {
        try {
            // NOTE: This pdf has a size of 26 MB
            const metadata = await Metadata.set(
                "https://research.nhm.org/pdfs/10840/10840.pdf",
                {
                    path: "path/to/ExifTool",
                    new: true,
                    prev: true,
                    tags: [
                        {
                            name: "CUSTOM_TAG",
                            value: "NEW VALUE",
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
        // Path to the file which metadata was edited
        file: '../../dir/to/the/sample.pdf',
        // OR
        // This type of path will be generated for streams
        file: '../../path/to/dir/.tmp/0b00f9b2-cc7d-48b6-8fad-d7e2992de663'
    }
    ```

    -   #### Options

    | Name | Type | Description |
    | --- | --- | --- |
    | `fileName` | `string` | Custom cache file name. |
    | `metadata` | `boolean` | **_Default_** `false`.<br>Returns the metadata of the file before modifying metadata will be returned. |
    | `new` | `boolean` | **[!] _Priority_** `new` > `metadata`.<br>**_Default_** `false`.<br>Returns the metadata of the file after modifying metadata will be returned. |
    | `all` | `boolean` | **_Default_ `false`**.<br>If `true`, all the metadata tags will be returned. This will override the `tags` option. **NOTE**: This option can cause significant performance issues. Use it only if you need all the metadata tags. |
    | `delete_all` | `boolean` | :red_circle: **[UNSAFE]**<br>**_Default_ `false`**.<br>If `true` all the metadata tags will be deleted from the file. New `tags` will remain unaffected. |
    | `tags` | `[ExifWriteOPTag]` | Add new or edit existing metadata tags to the file. |

    -   #### _ExifWriteOPTag_

        | Name | Type | Description |
        | --- | --- | --- |
        | `name` | `string` | The name of the metadata tag. If it's a custom tag, make sure to initialize the [`Metadata.configurator()`](#import--configure) |
        | `value` | `any`\|`null` | The value of the metadata tag. If the tag has no value then it will be removed from the file. |
        | `custom` | `string` | **[Advanced]**<br>Custom Exiftool writing command can be directly passed to `custom`.<br>Read more about [ExifTool commands](https://exiftool.org/exiftool_pod.html#WRITING-EXAMPLES). |
        | `empty_tag` | `boolean` | :x: **[DEPRECATED]**<br>Delete the current tag's value without deleting the whole tag from the file. |

-   ### Copy Metadata

    This function allows to copy the metadata from one file or directory to another file or directory.

    ```js
    async function copyFromFileToStream() {
        try {
            const stream = createReadStream("/path/to/dir/img_2.jpg");
            const result = await Metadata.copy(
                "/path/to/dir/img_1.jpg",
                stream,
                {
                    path: "path/to/ExifTool",
                    src: {
                        tags: [
                            {
                                name: "Author",
                            },
                        ],
                    },
                    dst: {
                        tags: [
                            {
                                name: "Author",
                            },
                        ],
                    },
                }
            );
            console.log(JSON.stringify(result, null, 2));
        } catch (e) {
            console.error(e);
        }
    }
    ```

    The above code will copy the `Author` tag from image img_1.jpg and set it to img_2.jpg, but dst overrides the `Author` tag to be deleted. Hence, the tag will be removed from the image img_2.jpg.

-   ### Read/Write Options

    These options can be passed to read, write, and copy methods.

    -   #### _ExifMetadataReadWriteOptions_
        | Name | Type | Description |
        | --- | --- | --- |
        | `path` | `string` | **[Required]**<br>***Default* `'exiftool'`**.<br>The path of the ExifTool binaries.<br>**NOTE:** If exiftool is callable from CLI as `perl exiftool`, then `path` is optional. |
        | `config` | `string` | **[Advanced]**<br>The path to the config file to use with exiftool. |
        | `del_cache_on_error` | `boolean` | ***Default* `false`**<br>If `true`, the temporary file will be deleted if an error occurs.<br>**Recommended** to use with stream cache. |
        | `stream` | `boolean` | **[Advanced]**<br>***Default* `false`**.<br>If `true`, instead of returning metadata in a JSON compatible object, an instance of readable stream containing metadata string will be returned.<br>**NOTE**: This option will return raw metadata instead of JSON, custom parser will be required to parse JSON. JSON.parse() will always throw an error with `fast: true`. |

### Cache

-   #### Manually remove all cache.

```js
Metadata.clear();
```

-   #### Disable network caching.

```js
async function streamURL() {
    const metadata = await Metadata.get("https://example.com/imagine.pdf", {
        no_cache: true,
    });
    console.log(metadata);
}
```

Explicitly set `no_cache: true` to disable caching for network file.

-   #### Enable stream caching.

```js
async function streamFile() {
    const rs = createReadStream("sample.pdf");
    const metadata = await Metadata.get(rs, {
        no_cache: false,
    });
}
```

Explicitly set 'no_cache' to false to enable caching for stream.

## Advanced

-   ### Custom Configuration

    If Metadata.configurator does not meet the requirements. You can provide a custom configuration file with Metadata.get() or Metadata.set() function options.

    -   #### sample.cfg

    ```pm
    # Example config file
    %Image::ExifTool::UserDefined = (
        'Image::ExifTool::Exif::Main' => {
            d000 => {
                Name => 'CUSTOM_TAG',
                Writable => 'string',
            },
        },
        'Image::ExifTool::PDF::Info' => {
            CUSTOM_TAG => {
                Name => 'CUSTOM_TAG',
                Writable => 'string',
            },
        },
    );
    1; #end
    ```

    Read more: https://exiftool.org/config.html

    -   #### Use custom configuration

    ```js
    async function read() {
        try {
            const metadata = await Metadata.get("image.jpg", {
                config: "../path/to/sample.cfg",
            });
            console.log(metadata);
        } catch (e) {
            console.error(e);
        }
    }
    ```

-   ### Custom cache file name

    This library does not support caching for stream passed as a parameter in such case you should provide something that could identify the cache file later. If you do not provide a cache file name a random name will be generated.<br><br>`no_cache: false` will be ignored for stream passed as a parameter, if `fileName` is not provided.

    ```js
    import { createReadStream } from "node:fs";

    const rs = createReadStream("sample.pdf");
    const metadata = await Metadata.get(rs, {
        fileName: "sample.pdf",
        no_cache: false,
    });
    console.log(metadata);
    ```

-   ### Performance

    There is a significant overhead in loading ExifTool, so performance may be greatly improved by taking advantage of ExifTool's batch processing capabilities.

    -   ### Batch Processing
        This allows to process multiple files in one function call, and helps to reduce the startup overhead. Sample batch processing code can be found in the examples/batch directory.
    -   #### Read Metadata

        ```js
        async function readMultipleFromDisk() {
            try {
                const metadata = await Metadata.get([
                    "/path/to/dir/samples/img_1.jpg",
                    "/path/to/dir/samples/img_2.jpg",
                    ...
                ]);
                console.log(metadata);
            } catch (e) {
                console.error(e);
            }
        }
        ```

    -   #### Edit/Write Metadata

        ```js
        async function writeMultipleFromDirectory() {
            try {
                const metadata = await Metadata.set("../../path/to/dir", {
                    new: true,
                    metadata: true,
                    tags: [
                        {
                            name: "Author",
                            value: "John Doe",
                        },
                    ],
                });
                console.log(JSON.stringify(metadata, null, 4));
            } catch (e) {
                console.error(e);
            }
        }
        ```

-   ### CLI
    To execute complex or direct access to ExifTool use CLI method.
    ```js
    const command = `-j ~/path/to/file`;
    const subscriberId = Metadata.CLI.run(command || commands, (err, data) => {
            console.log(err || data);
            Metadata.CLI.stop(subscriberId);
        }, {
            path: exifToolPath
        });
    ```
    -   :warning: **NOTE:** If the `command` contains arbitrary spaces, use array syntax to avoid confusion.<br>***Example:***
    ```js
    const command = [
        '-j',
        '-Author="Foo Bar"',
        '"~path/to/file/containing spaces/file name.pdf"'
    ]
    ```
    #### **Remove CLI events listener**
    Remove the current CLI events listener once the task is finished to avoid receiving metadata for additional CLI tasks. Use `"queue"` option, which will handle everything for you.
    ```js
    Metadata.CLI.stop(subscriberId);
    ```
     #### **Exit CLI**
     This will automatically terminate the CLI process and all events listeners.
     ```js
    Metadata.CLI.kill();
     ```

    More examples: [examples/raw.js]

    - #### Options

    | Name | Type | Description |
    |------|------|-------------|
    | `path` | `string` | **[Required]**<br>The path to the ExifTool binary.<br>**NOTE:** `path` is optional, if ExifTool is callable from the CLI as `perl exiftool`. |
    | `config` | `string` | The configuration file path. |
    | `raw` | `boolean` | **[Advanced]**<br>**_Default_ `false`**<br>If `true`, the child process will be returned. |
    | `streams` | `boolean` | **[Advanced]**<br>**_Default_ `false`**<br>If `true`, raw streams will be returned. |
    | `queue` | `boolean` |  **[Advanced]**<br>**_Default_ `false`**<br>If `true`, the stream observer will serve streams in queued order and will remove the callback from the stream observer once the command is fulfilled successfully or not. |

-   ### :warning: _Experimental Features_ 
    Experimental features can be unstable or maybe subject to change, using them in a **production** environment is **not recommended**. 
        
    | Name | Type | Description |
    | -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | 
    | `fast` | `boolean` | **[Advanced]**<br>***Default* `false`**<br>If `true`, a dedicated process will be started for the binaries. This can significantly increase performance.<br>To exit `fast` mode, use `Metadata.stop();` |

 
### NOTE

-   The package is pure ESM. It cannot be require() from CommonJS.
-   Future version might break backward compatibility.
-   Check release notes for breaking changes.

## Future
- This library is currently rewritten in TypeScript.
- `fast` mode will be enabled by default.

## Examples
Examples can be found inside [example directory].

## Tools
- **Comming Soon**

## Known Issues
**_If you discover any bug, create an issue._**

## Sponsor

Support this project.<br> <a href="https://www.buymeacoffee.com/anasshakil" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="margin-top:20px;height: 60px !important;width: 217px !important;" ></a>

## License
[MIT]

<!-- Links -->

[example directory]: https://github.com/anasshakil/metadata/tree/main/test
[MIT]: https://github.com/anasshakil/metadata/blob/main/LICENSE
[examples/raw.js]: https://github.com/anasshakil/metadata/blob/main/examples/raw.js
