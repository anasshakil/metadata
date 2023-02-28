"use strict";

import { randomUUID } from "node:crypto";

/**
 * @typedef {"cli" | "fast_mode"} _StreamObservableOriginator_
 */

export default class _StreamObservable_ {
    /**
     * @type {_StreamObservable_}
     */
    static #shared = null;
    /**
     * @type {{[id: string]: {owner: string, cb: (error?: Error | string, data?: string) => void}}}
     */
    #subscribers = {};
    /**
     * @type {Array<string>}
     */
    #subscriber_ids = [];

    constructor() {
        if (
            _StreamObservable_.#shared !== null &&
            _StreamObservable_.#shared !== true
        ) {
            throw new Error(
                "_StreamObservable_ does not support initialization, Use getInstance() method"
            );
        }
    }

    static getInstance() {
        if (_StreamObservable_.#shared === null) {
            _StreamObservable_.#shared = true;
            _StreamObservable_.#shared = new _StreamObservable_();
        }
        return _StreamObservable_.#shared;
    }

    /**
     * @param {_StreamObservableOriginator_} owner
     * @param {any} callback
     */
    subscribe(owner, callback) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function");
        }
        return this.#createSubscriber(owner, callback);
    }

    unsubscribe(id) {
        this.#removeSubscriber(id);
    }

    /**
     * @param {_StreamObservableOriginator_} owner
     * @param {{isError: boolean, message: string}} reason
     */
    unsubscribeAll(owner, reason = {}) {
        const { isError, message } = reason;
        Object.keys(this.#subscribers).forEach((id) => {
            const subscriber = this.#subscribers[id];
            if (owner !== subscriber.owner) return;
            subscriber.cb(
                isError ? message : undefined,
                isError ? undefined : message
            );
            delete this.#subscribers[id];
        });
    }

    /**
     * @param {_StreamObservableOriginator_} owner
     * @param {any} error
     * @param {any} data
     * @param {{queue: boolean}} [options]
     */
    emit(owner, error, data, options = {}) {
        const { queue } = options;
        const done = data?.done || error?.done;
        if (queue) {
            const id = this.#getSubscriberIdByOrder(owner);
            if (id) {
                const subscriber = this.#subscribers[id];
                if (subscriber) {
                    subscriber.cb(error?.chunk, data?.chunk);
                    if (done) this.#removeSubscriber(id);
                }
                return;
            }
        }
        this.#notifyAllSubscribers(owner, error?.chunk, data?.chunk);
    }

    #notifyAllSubscribers(owner, error, data) {
        for (const id of Object.keys(this.#subscribers)) {
            const subscriber = this.#subscribers[id];
            if (owner !== subscriber?.owner) return;
            subscriber.cb(error, data);
        }
    }

    #createSubscriber(owner, cb) {
        const id = randomUUID();
        this.#subscribers[id] = { owner, cb };
        this.#subscriber_ids.push(id);
        return id;
    }

    #getSubscriberIdByOrder(owner) {
        let id;
        for (let _id of this.#subscriber_ids) {
            const subscriber = this.#subscribers[_id];
            if (owner === subscriber?.owner) {
                id = _id;
                break;
            }
        }
        return id;
    }

    #removeSubscriber(id) {
        if (!id) return;
        delete this.#subscribers[id];
        this.#removeSubscriberById(id);
    }

    #removeSubscriberById(id) {
        const i = this.#subscriber_ids.indexOf(id);
        return i > -1 ? this.#subscriber_ids.splice(i, 1)[0] : null;
    }
}
