"use strict";

import fs from "node:fs";
import util from "node:util";
import stream from "node:stream";
import { spawn } from "node:child_process";
import { __dir__ } from "../../__dir.js";
import path from "node:path";

const pipeline = util.promisify(stream.pipeline);
/**
 * @type {import("node:child_process").ChildProcessWithoutNullStreams}
 */
let _background_process_;
const marker = '{ready}';
const terminate = ['-stay_open', 'false'].join('\n');
const action = ['-json', '-execute202'].join('\n');

const _exec_cmd_ = "-execute0\n";

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function stripReadyEnd(done = false) {
    const trans = new stream.Transform({
        transform(chunk, encoding, callback) {
            if (encoding === 'buffer') {
                if (chunk.includes(marker)) {
                    chunk = chunk.slice(0, chunk.indexOf(marker));
                    done = true;
                }
                callback(null, chunk);
                if (done) {
                    trans.end();
                }
            }
        }
    });
    return trans;
}

function streamToExif(target, act, close = false, args = path.join(__dir__(), 'bin/cont.args.txt')) {
    const argsFile = fs.createWriteStream(args);
    const exiftool = spawn('perl', [
        path.join(__dir__(), "bin/exiftool"), '-stay_open', 'true', '-@'
    ]);
    exiftool.stdout.on('data', data => {
        const id = data.toString();
        console.log(id);
        const isReady = id.substring(id.length - 8);
        if (isReady.includes(marker) && close) {
            argsFile.write(terminate + '\n');
        }
    });
    exiftool.on("error", (e) => {
        console.error(e)
    })
    fs.createReadStream(target).pipe(exiftool.stdin);
    argsFile.write(act + '\n');
    return exiftool.stdout;
}
let dt = 0;
function stay_open(file, args) {
    console.log("STAY_OPEN")
    const exiftool = _create_child_process_();



    exiftool.stdout.on("data", (d) => {
        const msg = d.toString();
        dt = msg.length;
        console.log(msg)
    })


    exiftool.stdin.write([file, ...args, _exec_cmd_].join("\n"), "utf8")

    exiftool.stdin.on("error", (e) => {
        console.error("stdin Error", e)
    })
}

function _create_child_process_() {
    if (_background_process_) return _background_process_;
    // console.log("****Creating Process****")
    _background_process_ = spawn("perl", [
        path.join(__dir__(), "bin/exiftool"),
        "-stay_open", "true", "-@", "-"
    ]);
    _background_process_.on("error", (e) => {
        console.error("child_process Error", e)
    })
    _background_process_.stderr.on("error", (e) => {
        console.error("stderr Error", e)
    })
    return _background_process_;
    // __exiftool_child_process__.stdin
}

function _kill_child_process_() {
    if (!_background_process_) return true;
    _background_process_.stdin.write([
        "-stay_open",
        "false"
    ].join("\n"), _ => {
        _background_process_.kill();
    })
}

stay_open(path.join(__dir__(), "test/samples/s1.pdf"), ["-j", "-q"])
stay_open(path.join(__dir__(), "test/samples/s1.pdf"), ["-j", "-q"])