import {
  addKeysToObject,
  expectedEventName as expectedEventName_,
  getKeyFromObject,
} from "oberknecht-utils";
import { oberknechtActionEmitterOptions } from "../types/oberknecht.action.emitter.options";
import { i } from "..";
let symNum = 0;

export class oberknechtActionEmitter {
  readonly #symbol: string = `oberknechtActionEmitter-${symNum++}`;
  get symbol() {
    return this.#symbol;
  }

  defaultdelay = 300;
  timeout = 3000;
  #alwaysResolve = ["PRIVMSG"];
  #alwaysIgnore = ["PRIVMSG"];

  get _options(): oberknechtActionEmitterOptions {
    return (
      getKeyFromObject(i.actionEmitterData, [this.symbol, "_options"]) ?? {}
    );
  }
  set _options(options) {
    addKeysToObject(i.actionEmitterData, [this.symbol, "_options"], options);
  }

  num = 0;

  constructor(options: oberknechtActionEmitterOptions) {
    i.actionEmitterData[this.symbol] = {};
    i.actionEmitterData[this.symbol].queue = [];
    i.actionEmitterData[this.symbol].isWorkingHard = false;
    let _options = options ?? {};

    i.actionEmitterData[this.symbol]._options = this._options = _options;
  }

  emit = (eventName: string, args: any, returntype?: number) => {
    if (i.actionEmitterData[this.symbol].queue.length === 0) return;
    if (this.#alwaysIgnore.includes(eventName)) return;

    let events = i.actionEmitterData[this.symbol].queue.filter((e) => {
      return (
        e.inQueue &&
        !e.isDone &&
        !e.timedOut &&
        (!e.expectedEventName || typeof e.expectedEventName !== "function"
          ? (e.expectedEventName ?? e.eventName).toUpperCase() === eventName
          : e.expectedEventName({
              response: {
                eventName: eventName,
                args: args,
              },
            }))
      );
    });
    let event = events[0];

    if (!event) {
      if (
        i.actionEmitterData[this.symbol].queue.filter((e) => {
          return !e.isDone && e.inQueue && !e.timedOut;
        }).length === 0
      ) {
        i.actionEmitterData[this.symbol].queue = [];
      }
      return;
    }

    event.inQueue = false;
    event.isDone = true;
    clearTimeout(event.to);
    returntype = !(returntype ?? undefined) ? 1 : returntype;
    switch (returntype) {
      case 1:
      default:
        return event.resolve(args);
      case 2:
        return event.reject(args);
    }
  };

  emitresolve = (eventName: string, args: any) => {
    return this.emit(eventName, args, 1);
  };

  emitreject = (eventName: string, args: any) => {
    return this.emit(eventName, args, 2);
  };

  once = (
    eventName: string,
    fn: Function,
    args?: any,
    expectedEventName?: boolean | Function,
    customDelay?: number,
    sendAsync?: boolean
  ) => {
    return new Promise<any>((resolve, reject) => {
      if (this.#alwaysResolve.includes(eventName) || sendAsync) {
        fn(args);
        return resolve(undefined);
      }

      const itemsym = `${this.num++}`;
      const item = {
        sym: itemsym,
        eventName: eventName,
        expectedEventName:
          expectedEventName ??
          (this._options.useExpectedEventNames
            ? expectedEventName_(eventName)
            : undefined),
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

      i.actionEmitterData[this.symbol].queue.push(item);

      if (!i.actionEmitterData[this.symbol].isWorkingHard) this.next(itemsym);
    });
  };

  next = (sym: string) => {
    i.actionEmitterData[this.symbol].isWorkingHard = true;
    let item = i.actionEmitterData[this.symbol].queue.filter((v) => {
      return v.sym === sym;
    })[0];

    if (!item)
      return console.error(
        Error("EROAIOAIOSDAOERRROR ITEM NOT FOUND BABYRAGE")
      );

    item.inQueue = true;
    item.fn(item.args);
    item.to = setTimeout(() => {
      item.timedOut = true;
      return item.reject(Error(`action timed out\n${JSON.stringify(item)}`));
    }, this.timeout);

    let queue = i.actionEmitterData[this.symbol].queue;
    const next =
      queue.indexOf(item) > -1 && queue[queue.indexOf(item) + 1]
        ? queue[queue.indexOf(item) + 1]
        : undefined;

    if (!next) {
      i.actionEmitterData[this.symbol].isWorkingHard = false;
      return;
    }

    setTimeout(() => {
      this.next(next.sym);
    }, next.delay ?? this.defaultdelay);
  };
}
