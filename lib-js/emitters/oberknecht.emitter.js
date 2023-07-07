"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtEmitter = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
let clientSymNum = 0;
class oberknechtEmitter {
    #symbol = `oberknechtEmitter-${clientSymNum++}`;
    get symbol() {
        return this.#symbol;
    }
    get _options() {
        return __1.i.emitterData[this.symbol]._options;
    }
    constructor(options) {
        let _options = options ?? {};
        __1.i.emitterData[this.symbol] = {
            events: {},
            _options: _options,
        };
    }
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
            eventName_.forEach((a) => {
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
        let eventNames = [...eventName_, "_all"];
        eventNames.forEach((a) => {
            this.getListeners(a).forEach((callback) => {
                if (this._options.withAllNames)
                    callback([a, ...eventNames.filter((b) => a !== b)], args ?? undefined);
                else if (this._options.withNames)
                    callback(a, args ?? undefined);
                else
                    callback(args ?? undefined);
            });
        });
    };
    emitError = (eventName, error) => {
        try {
            if (!error)
                return;
            if (this.getListeners("error").length === 0 &&
                this.getListeners("unhandledRejection").length === 0) {
                // process.emitWarning((error?.error?.message ?? error.error ?? error?.message ?? error));
            }
            this.emit(["error"].concat(eventName), error instanceof Error
                ? Error("Oida", { cause: error })
                : Error((0, oberknecht_utils_1.returnErr)(error)));
        }
        catch (e) {
            console.error(Error(`Oida 2`, { cause: error }));
        }
    };
    destroy = () => {
        delete __1.i.emitterData[this.symbol];
    };
}
exports.oberknechtEmitter = oberknechtEmitter;
