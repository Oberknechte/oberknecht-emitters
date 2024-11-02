export declare class oberknechtQueueEmitter {
    readonly _symbol: string;
    get symbol(): string;
    get events(): any;
    constructor();
    once: (eventName: string, arg: any) => Promise<any>;
    emitResolve: (eventName: string, arg: any, resp?: any) => void;
    emitReject: (eventName: string, arg: any, e: Error) => Promise<void>;
}
