import crypto from "node:crypto";

export function _generateHash(data, alg = 'sha256') {
    return crypto.createHash(alg, "exiftool-node-config").update(data).digest("hex");
}
