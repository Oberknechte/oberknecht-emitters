"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtEmitter = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
let clientSymNum = 0;
class oberknechtEmitter {
    #symbol = `oberknechtEmitter-${clientSymNum++}`;
    get symbol() { return this.#symbol; }
    ;
    constructor() {
        __1.i.emitterData[this.symbol] = {
            "events": {}
        };
    }
    ;
    on = (eventName, callback) => {
        let eventName_ = (0, oberknecht_utils_1.convertToArray)(eventName);
        eventName_.forEach((eventName2) => {
            if (!__1.i.emitterData[this.symbol].events[eventName2])
                __1.i.emitterData[this.symbol].events[eventName2] = [];
            __1.i.emitterData[this.symbol].events[eventName2].push(callback);
        });
    };
    addListener = this.on;
    once = (eventName, callback) => {
        let eventName_ = (0, oberknecht_utils_1.convertToArray)(eventName);
        const onceCallback = (args) => {
            eventName_.forEach(a => {
                this.removeListener(a, onceCallback);
            });
            callback(args);
        };
        this.on(eventName_, onceCallback);
    };
    removeListener = (eventName, callback) => {
        if (!__1.i.emitterData[this.symbol].events[eventName])
            return;
        __1.i.emitterData[this.symbol].events[eventName] = __1.i.emitterData[this.symbol].events[eventName].filter((cb) => cb !== callback);
    };
    removeAllListeners = (eventName) => {
        if (!__1.i.emitterData[this.symbol].events[eventName])
            return;
        delete __1.i.emitterData[this.symbol].events[eventName];
    };
    getListeners = (eventName) => {
        return __1.i.emitterData[this.symbol].events[eventName] || [];
    };
    emit = (eventName, args) => {
        let eventName_ = (0, oberknecht_utils_1.convertToArray)(eventName);
        eventName_.forEach(a => {
            this.getListeners(a).forEach((callback) => {
                callback(args ?? undefined);
            });
            this.getListeners("_all").forEach((callback) => {
                callback(args ?? undefined);
            });
        });
    };
    emitError = (eventName, error) => {
        try {
            if (!error)
                return;
            if (this.getListeners("error").length === 0 && this.getListeners("unhandledRejection").length === 0) {
                // process.emitWarning((error?.error?.message ?? error.error ?? error?.message ?? error));
            }
            ;
            this.emit(["error"].concat(eventName), (error instanceof Error ? Error("Oida", { "cause": error }) : Error((error?.error?.message ?? error?.error ?? error?.message ?? error))));
        }
        catch (e) {
            console.error(Error(`Oida 2`, { "cause": error }));
        }
        ;
    };
    destroy = () => {
        delete __1.i.emitterData[this.symbol];
    };
}
exports.oberknechtEmitter = oberknechtEmitter;
;
