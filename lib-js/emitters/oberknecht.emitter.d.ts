import { oberknechtEmitterOptions } from "../types/oberknecht.emitter.options";
export declare class oberknechtEmitter {
    readonly _symbol: string;
    get symbol(): string;
    get _options(): oberknechtEmitterOptions;
    set _options(options: oberknechtEmitterOptions);
    constructor(options?: oberknechtEmitterOptions);
    on: (eventName: string | string[], callback: Function, returnNames?: boolean, clientNames?: string | string[]) => void;
    addListener: (eventName: string | string[], callback: Function, returnNames?: boolean, clientNames?: string | string[]) => void;
    once: (eventName: string | string[], callback: Function, returnNames?: boolean) => void;
    removeListener: (eventName: string, callback: Function) => void;
    removeClientListeners: (clientName: string, eventName?: string[]) => void;
    removeAllListeners: (eventName: string) => void;
    getListeners: (eventName: string) => any;
    getListenersWithNames: (eventName: string) => any;
    emit: (eventName: string | string[], ...args: any) => void;
    emitError: (eventName: string | string[], error: Error | Record<string, any> | any) => void;
    destroy: () => void;
}
