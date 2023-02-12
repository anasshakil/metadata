"use strict";

import crypto from "node:crypto";

export function _generateHash(data) {
    return crypto.createHash("sha256", "node-metadata-hash-sha256").update(data).digest("hex");
}
