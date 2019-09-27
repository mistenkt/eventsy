class Event {
    constructor() {
        this.subscriptions = {};

        this.sub = this.subscribe;
        this.unsub = this.unsubscribe;
    }

    /**
     * Publish an event to all relevant subscribers
     * @param event
     * @param payload
     */
    publish(event, payload) {
        let eventSegments = event.split('/');
        let eventStack = '';
        let notify = [];

        if(this.subscriptions[event]) notify = this.subscriptions[event];

        // check for wildcards
        eventSegments.forEach((item,index) => {
            eventStack += item;

            // Matches all wildcard
            if(this.subscriptions[eventStack + '*']) {
                notify = [...notify, ...this.subscriptions[eventStack + '*']];
            }

            eventStack += '/';

            // Matches wildcard one level down
            if(this.subscriptions[eventStack + '*'] && eventSegments[index + 1] && ! eventSegments[index + 2]) {
                notify = [...notify, ...this.subscriptions[eventStack + '*']];
            }

            // Matches wildcard all levels down
            if(this.subscriptions[eventStack + '**'] && eventSegments[index+1]) {
                notify = [...notify, ...this.subscriptions[eventStack + '**']]
            }
        });

        notify.forEach((item, index) => {
            item.callback(payload, event);
        });
    }

    /**
     * Subscribes to an event
     * @param event
     * @param callback
     * @returns {*}
     */
    subscribe(event, callback) {
        if(typeof event === 'object') {
            let eventIds = [];
            event.forEach(item => {
                eventIds.push(this._subscribeSingle(item, callback));
            });

            return eventIds;
        } else {
            return this._subscribeSingle(event, callback);
        }
    }

    /**
     * Unsubscribes one more event listeners
     * @param event
     */
    unsubscribe(event) {
        if(typeof event === 'object') {
            event.forEach(eventId => this._unsubscribeSingle(eventId))
        } else {
            this._unsubscribeSingle(event);
        }

    }

    /**
     * Clears all subscriptions
     */
    clearAll() {
        this.subscriptions = [];
    }

    /**
     * Subscribes a single event
     * @param event
     * @param callback
     * @returns {*}
     * @private
     */
    _subscribeSingle(event, callback) {
        if(!this.subscriptions[event]) {
            this.subscriptions[event] = [];
        }

        const subscriptionId = this._generateId();

        this.subscriptions[event].push({callback, id: subscriptionId});

        return subscriptionId;
    }

    /**
     * Unsubscribes a single event
     * @param eventId
     * @private
     */
    _unsubscribeSingle(eventId) {
        Object.keys(this.subscriptions).forEach(event => {
            let subscriptions = this.subscriptions[event];

            if(subscriptions) {
                subscriptions.forEach((item, key) => {
                    if(item.id === eventId) subscriptions.splice(key, 1);
                });
            }

            if(!subscriptions.length) {
                delete this.subscriptions[event];
            } else {
                this.subscriptions[event] = subscriptions;
            }
        });
    }

    /**
     * Generates an ID
     * @returns {string}
     * @private
     */
    _generateId() {
        const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let text = [];

        for(let i=0; i < 10; i++) {
            text.push(possibleChars.charAt(Math.floor(Math.random() * possibleChars.length)));
        }

        return text.join('');
    }

}

const Eventsy = new Event();

export const useListener = (listener, callback, updateOn = []) => {
    const React = require('react');
    return React.useEffect(() => {
        const subscribedListener = Eventsy.sub(listener, callback);
        return () => Eventsy.unsubscribe(subscribedListener);
    }, updateOn);

};

export const eventSystemReduxMiddleware = store => next => action => {
    Eventsy.publish(action.type, action.payload);
    return next(action);
};

export default Eventsy;