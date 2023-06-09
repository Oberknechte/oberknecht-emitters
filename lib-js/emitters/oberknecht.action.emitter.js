"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtActionEmitter = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
let clientSymNum = 0;
class oberknechtActionEmitter {
    #symbol = `oberknechtActionEmitter-${clientSymNum++}`;
    get symbol() { return this.#symbol; }
    ;
    defaultdelay = 300;
    timeout = 3000;
    #alwaysResolve = ["PRIVMSG"];
    #alwaysIgnore = ["PRIVMSG"];
    _options;
    num = 0;
    constructor(options) {
        __1.i.actionEmitterData[this.symbol] = {};
        __1.i.actionEmitterData[this.symbol].queue = [];
        __1.i.actionEmitterData[this.symbol].isWorkingHard = false;
        let _options = (options ?? {});
        __1.i.actionEmitterData[this.symbol]._options = this._options = _options;
    }
    ;
    emit = (eventName, args, returntype) => {
        if (__1.i.actionEmitterData[this.symbol].queue.length === 0)
            return;
        if (this.#alwaysIgnore.includes(eventName))
            return;
        let events = __1.i.actionEmitterData[this.symbol].queue.filter((e) => {
            return (e.inQueue && !e.isDone && !e.timedOut && (e.expectedEventName ?? e.eventName).toUpperCase() === eventName);
        });
        let event = events[0];
        if (!event) {
            if (__1.i.actionEmitterData[this.symbol].queue.filter((e) => {
                return (!e.isDone && e.inQueue && !e.timedOut);
            }).length === 0) {
                __1.i.actionEmitterData[this.symbol].queue = [];
            }
            ;
            return;
        }
        event.inQueue = false;
        event.isDone = true;
        clearTimeout(event.to);
        returntype = (!(returntype ?? undefined) ? 1 : returntype);
        switch (returntype) {
            case 1:
            default: return event.resolve(args);
            case 2: return event.reject(args);
        }
    };
    emitresolve = (eventName, args) => {
        return this.emit(eventName, args, 1);
    };
    emitreject = (eventName, args) => {
        return this.emit(eventName, args, 2);
    };
    once = (eventName, fn, args, expectedEventName, customDelay, sendAsync) => {
        return new Promise((resolve, reject) => {
            if (this.#alwaysResolve.includes(eventName) || sendAsync) {
                fn(args);
                return resolve();
            }
            ;
            const itemsym = `${this.num++}`;
            const item = {
                sym: itemsym,
                eventName: eventName,
                expectedEventName: expectedEventName ?? (this._options.useExpectedEventNames ? (0, oberknecht_utils_1.expectedEventName)(eventName) : undefined),
                fn: fn,
                resolve: resolve,
                reject: reject,
                delay: customDelay ?? null,
                args: args ?? undefined,
                inQueue: false,
                isDone: false,
                timedOut: false,
                to: undefined,
            };
            __1.i.actionEmitterData[this.symbol].queue.push(item);
            if (!__1.i.actionEmitterData[this.symbol].isWorkingHard)
                this.next(itemsym);
        });
    };
    next = (sym) => {
        __1.i.actionEmitterData[this.symbol].isWorkingHard = true;
        let item = __1.i.actionEmitterData[this.symbol].queue.filter(v => {
            return v.sym === sym;
        })[0];
        if (!item)
            return console.error(Error("EROAIOAIOSDAOERRROR ITEM NOT FOUND BABYRAGE"));
        item.inQueue = true;
        item.fn(item.args);
        item.to = setTimeout(() => {
            item.timedOut = true;
            return item.reject(Error(`action timed out\n${JSON.stringify(item)}`));
        }, this.timeout);
        let queue = __1.i.actionEmitterData[this.symbol].queue;
        const next = queue.indexOf(item) > -1 && queue[queue.indexOf(item) + 1] ? queue[queue.indexOf(item) + 1] : undefined;
        if (!next) {
            __1.i.actionEmitterData[this.symbol].isWorkingHard = false;
            return;
        }
        ;
        setTimeout(() => {
            this.next(next.sym);
        }, (next.delay ?? this.defaultdelay));
    };
}
exports.oberknechtActionEmitter = oberknechtActionEmitter;
;
