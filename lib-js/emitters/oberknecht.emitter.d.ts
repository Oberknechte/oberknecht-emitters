export declare class oberknechtEmitter {
    #private;
    get symbol(): string;
    constructor();
    on: (eventName: string | string[], callback: Function) => void;
    addListener: (eventName: string | string[], callback: Function) => void;
    once: (eventName: string | string[], callback: Function) => void;
    removeListener: (eventName: string, callback: Function) => void;
    removeAllListeners: (eventName: string) => void;
    getListeners: (eventName: string) => any;
    emit: (eventName: string | string[], args: any) => void;
    emitError: (eventName: string | string[], error: any) => void;
}
