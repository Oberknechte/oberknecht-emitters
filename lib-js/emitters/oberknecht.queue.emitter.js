"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtQueueEmitter = void 0;
const __1 = require("..");
let clientSymNum = 0;
class oberknechtQueueEmitter {
    _symbol = `oberknechtQueueEmitter-${clientSymNum++}`;
    get symbol() {
        return this._symbol;
    }
    get events() {
        return __1.i.queueEmitterData[this.symbol];
    }
    constructor() {
        __1.i.queueEmitterData[this.symbol] = {};
    }
    once = (eventName, arg) => {
        return new Promise((resolve, reject) => {
            if (!this.events[eventName])
                this.events[eventName] = {};
            const sym = String(Symbol());
            this.events[eventName][sym] = {
                arg: arg ?? null,
                resolve: (args) => {
                    delete this.events[eventName][sym];
                    resolve(args);
                },
                reject: (args) => {
                    delete this.events[eventName][sym];
                    reject(args);
                },
            };
        });
    };
    emitResolve = (eventName, arg, resp) => {
        const o = this.events[eventName] ?? {};
        o[Object.keys(o).filter((a) => !(arg ?? undefined) || (o[a].arg && o[a].arg === arg))[0]]?.resolve(resp);
    };
    emitReject = async (eventName, arg, e) => {
        let o = this.events[eventName] ?? {};
        o[Object.keys(o).filter((a) => !(arg ?? undefined) || (o[a].arg && o[a].arg === arg))[0]]?.reject(e);
    };
}
exports.oberknechtQueueEmitter = oberknechtQueueEmitter;
