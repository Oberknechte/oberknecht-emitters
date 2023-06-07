import { oberknechtActionEmitterOptions } from "../types/oberknecht.action.emitter.options";
export declare class oberknechtActionEmitter {
    #private;
    get symbol(): string;
    defaultdelay: number;
    timeout: number;
    _options: oberknechtActionEmitterOptions;
    constructor(options: oberknechtActionEmitterOptions);
    emit: (eventName: string, args: any, returntype?: number) => any;
    emitresolve: (eventName: string, args: any) => any;
    emitreject: (eventName: string, args: any) => any;
    once: (eventName: string, fn: Function, args?: any, expectedEventName?: boolean, customDelay?: number, sendAsync?: boolean) => Promise<void>;
    next: (sym: string) => void;
}
