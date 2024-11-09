"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtEmitter = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
let symNum = 0;
class oberknechtEmitter {
    _symbol = `oberknechtEmitter-${symNum++}`;
    get symbol() {
        return this._symbol;
    }
    get _options() {
        return (0, oberknecht_utils_1.getKeyFromObject)(__1.i.emitterData, [this.symbol, "_options"]) ?? {};
    }
    set _options(options) {
        (0, oberknecht_utils_1.addKeysToObject)(__1.i.emitterData, [this.symbol, "_options"], options);
    }
    constructor(options) {
        let _options = options ?? {};
        __1.i.emitterData[this.symbol] = {
            events: {},
            _options: _options,
        };
    }
    on = (eventName, callback, returnNames, clientNames) => {
        let eventName_ = (0, oberknecht_utils_1.convertToArray)(eventName);
        eventName_.forEach((eventName2) => {
            if (!__1.i.emitterData[this.symbol].events[eventName2])
                __1.i.emitterData[this.symbol].events[eventName2] = [];
            __1.i.emitterData[this.symbol].events[eventName2].push({
                cb: callback,
                returnNames: returnNames ?? this._options.withAllNames ?? false,
                clientNames: clientNames,
            });
        });
    };
    addListener = this.on;
    once = (eventName, callback, returnNames) => {
        let eventName_ = (0, oberknecht_utils_1.convertToArray)(eventName);
        const onceCallback = (args) => {
            eventName_.forEach((a) => {
                this.removeListener(a, onceCallback);
            });
            callback(args);
        };
        this.on(eventName_, onceCallback, returnNames);
    };
    removeListener = (eventName, callback) => {
        if (!__1.i.emitterData[this.symbol].events[eventName])
            return;
        __1.i.emitterData[this.symbol].events[eventName] = __1.i.emitterData[this.symbol].events[eventName].filter((dat) => dat.cb !== callback);
    };
    removeClientListeners = (clientName, eventName) => {
        if (!clientName)
            return;
        Object.keys(__1.i.emitterData[this.symbol].events).forEach((event) => {
            __1.i.emitterData[this.symbol].events[event].forEach((dat) => {
                if (dat.clientNames &&
                    dat.clientNames.includes(clientName) &&
                    (!eventName || eventName.includes(event))) {
                    this.removeListener(event, dat.cb);
                }
            });
        });
    };
    removeAllListeners = (eventName) => {
        if (!__1.i.emitterData[this.symbol].events[eventName])
            return;
        delete __1.i.emitterData[this.symbol].events[eventName];
    };
    getListeners = (eventName) => {
        return (__1.i.emitterData[this.symbol].events[eventName] || []).map((a) => a.cb);
    };
    getListenersWithNames = (eventName) => {
        return __1.i.emitterData[this.symbol].events[eventName] || [];
    };
    emit = (eventName, ...args) => {
        let eventName_ = (0, oberknecht_utils_1.convertToArray)(eventName);
        let eventNames = [...eventName_, "_all"];
        eventNames.forEach((a) => {
            this.getListenersWithNames(a).forEach((listener) => {
                let callback = listener.cb;
                let withNames = listener.returnNames ?? this._options.withNames;
                let withAllNames = listener.returnNames ?? this._options.withAllNames;
                if (withAllNames &&
                    (withAllNames === true ||
                        ((0, oberknecht_utils_1.extendedTypeof)(withAllNames) === "array" &&
                            withAllNames.includes(a))))
                    callback([a, ...eventNames.filter((b) => a !== b)], ...(args ?? undefined));
                else if (withNames &&
                    (withNames === true ||
                        ((0, oberknecht_utils_1.extendedTypeof)(withNames) === "array" && withNames.includes(a))))
                    callback(a, ...(args ?? undefined));
                else
                    callback(...(args ?? undefined));
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
