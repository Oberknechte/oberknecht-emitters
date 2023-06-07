export class oberknechtQueueEmitter {
    events = {};

    constructor() {
        this.events = {};
    };

    once = (eventName: string, arg: any) => {
        return new Promise<any>((resolve, reject) => {
            if (!this.events[eventName]) this.events[eventName] = {};

            const sym = String(Symbol());

            this.events[eventName][sym] = {
                arg: arg ?? null,
                resolve: (args) => {
                    delete this.events[eventName][sym];
                    resolve(args);
                },
                reject: (args) => {
                    delete this.events[eventName][sym];
                    reject(args);
                },
            };
        });
    };

    emitResolve = (eventName: string, arg: any, resp?: any) => {
        const o = (this.events[eventName] ?? {});
        o[Object.keys(o).filter(a => (!(arg ?? undefined) || (o[a].arg && o[a].arg === arg)))[0]]?.resolve(resp);
    };

    emitReject = async (eventName: string, arg: any, e: Error) => {
        let o = (this.events[eventName] ?? {});
        o[Object.keys(o).filter(a => (!(arg ?? undefined) || (o[a].arg && o[a].arg === arg)))[0]]?.reject(e);
    };
};