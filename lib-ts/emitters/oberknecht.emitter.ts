import { convertToArray, returnErr } from "oberknecht-utils";
import { i } from "..";
import { oberknechtEmitterOptions } from "../types/oberknecht.emitter.options";
let clientSymNum = 0;

export class oberknechtEmitter {
  readonly #symbol: string = `oberknechtEmitter-${clientSymNum++}`;
  get symbol() {
    return this.#symbol;
  }

  get _options(): oberknechtEmitterOptions {
    return i.emitterData[this.symbol]._options;
  }

  constructor(options: oberknechtEmitterOptions) {
    let _options = options ?? {};
    i.emitterData[this.symbol] = {
      events: {},
      _options: _options,
    };
  }

  on = (eventName: string | string[], callback: Function) => {
    let eventName_ = convertToArray(eventName);

    eventName_.forEach((eventName2) => {
      if (!i.emitterData[this.symbol].events[eventName2])
        i.emitterData[this.symbol].events[eventName2] = [];

      i.emitterData[this.symbol].events[eventName2].push(callback);
    });
  };

  addListener = this.on;

  once = (eventName: string | string[], callback: Function) => {
    let eventName_ = convertToArray(eventName);

    const onceCallback = (args) => {
      eventName_.forEach((a) => {
        this.removeListener(a, onceCallback);
      });

      callback(args);
    };

    this.on(eventName_, onceCallback);
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
    return i.emitterData[this.symbol].events[eventName] || [];
  };

  emit = (eventName: string | string[], args: any) => {
    let eventName_ = convertToArray(eventName);
    let eventNames = [...eventName_, "_all"];

    eventNames.forEach((a) => {
      this.getListeners(a).forEach((callback: Function) => {
        if (this._options.withAllNames)
          callback(
            [a, ...eventNames.filter((b) => a !== b)],
            args ?? undefined
          );
        else if (this._options.withNames) callback(a, args ?? undefined);
        else callback(args ?? undefined);
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
