import { convertToArray } from "oberknecht-utils";
import { i } from "..";

export class oberknechtEmitter {
  #symbol = Symbol();
  get symbol() { return String(this.#symbol) };

  constructor() {
    i.emitterData[this.symbol] = {
      "events": {}
    };
  };

  on = (eventName: string | string[], callback: Function) => {
    let eventName_ = convertToArray(eventName)

    eventName_.forEach((eventName2) => {
      if (!i.emitterData[this.symbol].events[eventName2]) i.emitterData[this.symbol].events[eventName2] = [];

      i.emitterData[this.symbol].events[eventName2].push(callback);
    });
  };

  addListener = this.on;

  once = (eventName: string | string[], callback: Function) => {
    let eventName_ = convertToArray(eventName);

    const onceCallback = (args) => {
      eventName_.forEach(a => {
        this.removeListener(a, onceCallback);
      });

      callback(args);
    };

    this.on(eventName_, onceCallback);
  };

  removeListener = (eventName: string, callback: Function) => {
    if (!i.emitterData[this.symbol].events[eventName]) return;

    i.emitterData[this.symbol].events[eventName] = i.emitterData[this.symbol].events[eventName].filter(
      (cb) => cb !== callback
    );
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

    eventName_.forEach(a => {
      this.getListeners(a).forEach((callback) => {
        callback(args ?? undefined);
      });
      this.getListeners("_all").forEach((callback) => {
        callback(args ?? undefined);
      })
    });
  };

  emitError = (eventName: string | string[], error) => {
    try {
      if (!error) return;
      if (this.getListeners("error").length === 0 && this.getListeners("unhandledRejection").length === 0) {
        // process.emitWarning((error?.error?.message ?? error.error ?? error?.message ?? error));
      };
      this.emit(["error"].concat(eventName), (error instanceof Error ? Error("Oida", { "cause": error }) : Error((error?.error?.message ?? error?.error ?? error?.message ?? error))));
    } catch (e) {
      console.error(Error(`Oida 2`, { "cause": error }));
    };
  };
};