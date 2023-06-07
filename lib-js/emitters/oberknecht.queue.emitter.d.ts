export declare class oberknechtQueueEmitter {
    events: {};
    constructor();
    once: (eventName: string, arg: any) => Promise<unknown>;
    emitResolve: (eventName: string, arg: any, resp?: any) => void;
    emitReject: (eventName: string, arg: any, e: Error) => Promise<void>;
}
