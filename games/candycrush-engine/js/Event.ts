/** Event.ts
 * QuickJS Library made by BonesYT
 * Version 1.0 (06/16/23 MDY), #1
 * Lang: TS */

/** Creates an event remote/controller along with the event signal. Events are used to
 * run functions when an action happens. (Similar to Web API `Event`, but more simple?)*/
class EventRemote<T extends any[]> {
    /** The event that the remote controls.
     * @type {EventSignal<T>} */
    event: EventSignal<T> = new EventSignal<T>(this)

    /** Run all of this event's connections
     * @param {...T} args */
    fire(...args: T): void {
        this.signals.forEach(v => {
            v.function.call(v.thisArg, ...args)
            if (v.isOnce) v.disconnect()
        })
    }
    /** List of listeners connected to this event. @type {} */
    signals: EventConnection<T>[] = []
}
/** The event signal controlled by the remote. Used to connect listeners.*/
class EventSignal<T extends any[]> {
    /** @param {EventRemote<T>} remote */
    constructor(private remote: EventRemote<T>) {}

    /** Connects a function to listen for this event. Function will be called everytime the event is fired.
     * @param {(...args:T) => void} listener 
     * @returns {EventConnection<T>} */
    connect(listener: (...args:T) => void, thisArg?: any): EventConnection<T> {
        const con = new EventConnection<T>(listener, false, this.remote.signals, thisArg)
        this.remote.signals.push(con)
        return con
    }

    /** Connects a function to listen for this event only once. Function will be called and disconnected once event fires.
     * @param {(...args:T) => void} listener 
     * @returns {EventConnection<T>} */
    once(listener: (...args:T) => void, thisArg?: any): EventConnection<T> {
        const con = new EventConnection<T>(listener, true, this.remote.signals, thisArg)
        this.remote.signals.push(con)
        return con
    }

    /** Yields code then returns the arguments of the next event.
     * @returns {Promise<T>} */
    async wait(thisArg?: any): Promise<T> {
        return await new Promise((r:(_:T)=>void) =>
            this.once((...args) => r(args), thisArg)
        )
    }

    /** Disconnects all listeners connected to this event. */
    disconnectAll(): void {
        this.remote.signals = []
    }
}

/** The connection listening for the event. Function is called when the event fires. */
class EventConnection<T extends any[]> {
    /** The function to be called */
    readonly function: (...args:T) => void
    /** Determines whether or not the connection is only run once. If true, it will be disconnected once the event fires. */
    readonly isOnce: boolean
    private active_ = true
    thisArg: any
    get active(): boolean {
        return this.active_
    }

    constructor(f: (...args:T) => void, once: boolean, private array: EventConnection<T>[], thisArg?: any) {
        this.function = f
        this.isOnce = once
        this.thisArg = thisArg ?? null
    }

    /** Disconnects listener from the event. The object will be locked once disconnected. */
    disconnect() {
        this.active_ = false
        this.array.splice(this.array.indexOf(this), 1)
    }
}

export {EventRemote, EventSignal, EventConnection}