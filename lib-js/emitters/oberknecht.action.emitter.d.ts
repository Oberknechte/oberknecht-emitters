import { oberknechtActionEmitterOptions } from "../types/oberknecht.action.emitter.options";
export declare class oberknechtActionEmitter {
    #private;
    readonly _symbol: string;
    get symbol(): string;
    defaultdelay: number;
    timeout: number;
    get _options(): oberknechtActionEmitterOptions;
    set _options(options: oberknechtActionEmitterOptions);
    num: number;
    constructor(options: oberknechtActionEmitterOptions);
    emit: (eventName: string, args: any, returntype?: number) => any;
    emitresolve: (eventName: string, args: any) => any;
    emitreject: (eventName: string, args: any) => any;
    once: (eventName: string, fn: Function, args?: any, expectedEventName?: boolean | Function, customDelay?: number, sendAsync?: boolean) => Promise<any>;
    next: (sym: string) => void;
}
