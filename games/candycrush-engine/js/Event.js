/** Event.ts
 * QuickJS Library made by BonesYT
 * Version 1.0 (06/16/23 MDY), #1
 * Lang: TS */
/** Creates an event remote/controller along with the event signal. Events are used to
 * run functions when an action happens. (Similar to Web API `Event`, but more simple?)*/
class EventRemote {
    /** The event that the remote controls.
     * @type {EventSignal<T>} */
    event = new EventSignal(this);
    /** Run all of this event's connections
     * @param {...T} args */
    fire(...args) {
        this.signals.forEach(v => {
            v.function.call(v.thisArg, ...args);
            if (v.isOnce)
                v.disconnect();
        });
    }
    /** List of listeners connected to this event. @type {} */
    signals = [];
}
/** The event signal controlled by the remote. Used to connect listeners.*/
class EventSignal {
    remote;
    /** @param {EventRemote<T>} remote */
    constructor(remote) {
        this.remote = remote;
    }
    /** Connects a function to listen for this event. Function will be called everytime the event is fired.
     * @param {(...args:T) => void} listener
     * @returns {EventConnection<T>} */
    connect(listener, thisArg) {
        const con = new EventConnection(listener, false, this.remote.signals, thisArg);
        this.remote.signals.push(con);
        return con;
    }
    /** Connects a function to listen for this event only once. Function will be called and disconnected once event fires.
     * @param {(...args:T) => void} listener
     * @returns {EventConnection<T>} */
    once(listener, thisArg) {
        const con = new EventConnection(listener, true, this.remote.signals, thisArg);
        this.remote.signals.push(con);
        return con;
    }
    /** Yields code then returns the arguments of the next event.
     * @returns {Promise<T>} */
    async wait(thisArg) {
        return await new Promise((r) => this.once((...args) => r(args), thisArg));
    }
    /** Disconnects all listeners connected to this event. */
    disconnectAll() {
        this.remote.signals = [];
    }
}
/** The connection listening for the event. Function is called when the event fires. */
class EventConnection {
    array;
    /** The function to be called */
    function;
    /** Determines whether or not the connection is only run once. If true, it will be disconnected once the event fires. */
    isOnce;
    active_ = true;
    thisArg;
    get active() {
        return this.active_;
    }
    constructor(f, once, array, thisArg) {
        this.array = array;
        this.function = f;
        this.isOnce = once;
        this.thisArg = thisArg ?? null;
    }
    /** Disconnects listener from the event. The object will be locked once disconnected. */
    disconnect() {
        this.active_ = false;
        this.array.splice(this.array.indexOf(this), 1);
    }
}
export { EventRemote, EventSignal, EventConnection };
//# sourceMappingURL=Event.js.map