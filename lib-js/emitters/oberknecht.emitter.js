"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtEmitter = void 0;
const __1 = require("..");
class oberknechtEmitter {
    #symbol = Symbol();
    get symbol() { return this.#symbol; }
    ;
    constructor() {
        __1.i.emitterData[this.symbol] = {
            "events": {}
        };
    }
    ;
    on = (eventName, callback) => {
        if (!Array.isArray(eventName))
            eventName = [eventName];
        eventName.forEach((eventName2) => {
            if (!__1.i.emitterData[this.symbol].events[eventName2]) {
                __1.i.emitterData[this.symbol].events[eventName2] = [];
            }
            __1.i.emitterData[this.symbol].events[eventName2].push(callback);
        });
    };
    addListener = this.on;
    once = (eventName, callback) => {
        if (!Array.isArray(eventName))
            eventName = [eventName];
        const onceCallback = (args) => {
            this.removeListener(eventName, onceCallback);
            callback(args);
        };
        this.on(eventName, onceCallback);
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
        if (!Array.isArray(eventName))
            eventName = [eventName];
        eventName.forEach((eventName2) => {
            this.getListeners(eventName2).forEach((callback) => {
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
}
exports.oberknechtEmitter = oberknechtEmitter;
;
