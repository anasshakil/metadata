"use strict";

import crypto from "node:crypto";

class _FastExecReader_ {
    #_rng_;
    #_prev_rng_available_;

    constructor() {
        if (typeof this.#_rng_ === "number") { return; }
        this.#_rng_ = crypto.randomInt(0, 100);
    }

    step = () => {
        this.#_prev_rng_available_ = true;
        this.#_rng_ += 1;
    }
    executor = () => `-execute${this.#_rng_}\n`;
    marker = (prev) => `{ready${prev === true && this.#_prev_rng_available_ ? this.#_rng_ - 1 : this.#_rng_}}`;
}

// export const _fast_exec_marker_ = new _FastExecReader_();