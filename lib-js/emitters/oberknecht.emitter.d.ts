import { oberknechtEmitterOptions } from "../types/oberknecht.emitter.options";
export declare class oberknechtEmitter {
    #private;
    get symbol(): string;
    get _options(): oberknechtEmitterOptions;
    constructor(options?: oberknechtEmitterOptions);
    on: (eventName: string | string[], callback: Function) => void;
    addListener: (eventName: string | string[], callback: Function) => void;
    once: (eventName: string | string[], callback: Function) => void;
    removeListener: (eventName: string, callback: Function) => void;
    removeAllListeners: (eventName: string) => void;
    getListeners: (eventName: string) => any;
    emit: (eventName: string | string[], args: any) => void;
    emitError: (eventName: string | string[], error: Error | Record<string, any> | any) => void;
    destroy: () => void;
}
