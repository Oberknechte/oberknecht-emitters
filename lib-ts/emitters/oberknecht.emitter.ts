import {
  addKeysToObject,
  convertToArray,
  extendedTypeof,
  getKeyFromObject,
  returnErr,
} from "oberknecht-utils";
import { i } from "..";
import { oberknechtEmitterOptions } from "../types/oberknecht.emitter.options";
let symNum = 0;

export class oberknechtEmitter {
  readonly #symbol: string = `oberknechtEmitter-${symNum++}`;
  get symbol() {
    return this.#symbol;
  }

  get _options(): oberknechtEmitterOptions {
    return getKeyFromObject(i.emitterData, [this.symbol, "_options"]) ?? {};
  }

  set _options(options) {
    addKeysToObject(i.emitterData, [this.symbol, "_options"], options);
  }

  constructor(options?: oberknechtEmitterOptions) {
    let _options = options ?? {};
    i.emitterData[this.symbol] = {
      events: {},
      _options: _options,
    };
  }

  on = (eventName: string | string[], callback: Function, returnNames?: boolean) => {
    let eventName_ = convertToArray(eventName);

    eventName_.forEach((eventName2) => {
      if (!i.emitterData[this.symbol].events[eventName2])
        i.emitterData[this.symbol].events[eventName2] = [];

      i.emitterData[this.symbol].events[eventName2].push({
        cb: callback,
        returnNames: returnNames ?? this._options.withAllNames ?? false,
      });
    });
  };

  addListener = this.on;

  once = (eventName: string | string[], callback: Function, returnNames?: boolean) => {
    let eventName_ = convertToArray(eventName);

    const onceCallback = (args) => {
      eventName_.forEach((a) => {
        this.removeListener(a, onceCallback);
      });

      callback(args);
    };

    this.on(eventName_, onceCallback, returnNames);
  };

  removeListener = (eventName: string, callback: Function) => {
    if (!i.emitterData[this.symbol].events[eventName]) return;

    i.emitterData[this.symbol].events[eventName] = i.emitterData[
      this.symbol
    ].events[eventName].filter((cb: Function) => cb !== callback);
  };

  removeAllListeners = (eventName: string) => {
    if (!i.emitterData[this.symbol].events[eventName]) return;

    delete i.emitterData[this.symbol].events[eventName];
  };

  getListeners = (eventName: string) => {
    return (i.emitterData[this.symbol].events[eventName] || []).map(a => a.cb);
  };
  
  getListenersWithNames = (eventName: string) => {
    return i.emitterData[this.symbol].events[eventName] || [];
  };

  emit = (eventName: string | string[], ...args: any) => {
    let eventName_ = convertToArray(eventName);
    let eventNames = [...eventName_, "_all"];

    eventNames.forEach((a) => {
      this.getListenersWithNames(a).forEach((listener: Record<string, any>) => {
        let callback = listener.cb;

        let withNames = listener.returnNames ?? this._options.withNames;
        let withAllNames = listener.returnNames ?? this._options.withAllNames;

        if (
          withAllNames &&
          (withAllNames === true ||
            (extendedTypeof(withAllNames) === "array" &&
              withAllNames.includes(a)))
        )
          callback(
            [a, ...eventNames.filter((b) => a !== b)],
            ...args ?? undefined
          );
        else if (
          withNames &&
          (withNames === true ||
            (extendedTypeof(withNames) === "array" && withNames.includes(a)))
        )
          callback(a, ...args ?? undefined);
        else callback(...args ?? undefined);
      });
    });
  };

  emitError = (
    eventName: string | string[],
    error: Error | Record<string, any> | any
  ) => {
    try {
      if (!error) return;
      if (
        this.getListeners("error").length === 0 &&
        this.getListeners("unhandledRejection").length === 0
      ) {
        // process.emitWarning((error?.error?.message ?? error.error ?? error?.message ?? error));
      }
      this.emit(
        ["error"].concat(eventName),
        error instanceof Error
          ? Error("Oida", { cause: error })
          : Error(returnErr(error))
      );
    } catch (e) {
      console.error(Error(`Oida 2`, { cause: error }));
    }
  };

  destroy = () => {
    delete i.emitterData[this.symbol];
  };
}
