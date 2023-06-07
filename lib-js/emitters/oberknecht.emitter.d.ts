export declare class oberknechtEmitter {
    #private;
    get symbol(): symbol;
    constructor();
    on: (eventName: any, callback: any) => void;
    addListener: (eventName: any, callback: any) => void;
    once: (eventName: any, callback: any) => void;
    removeListener: (eventName: any, callback: any) => void;
    removeAllListeners: (eventName: any) => void;
    getListeners: (eventName: any) => any;
    emit: (eventName: any, args: any) => void;
    emitError: (eventName: any, error: any) => void;
}
