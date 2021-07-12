import Event from '../index';

describe('Unsubscription functionality', () => {

    beforeEach(() => {
        Event.clearAll();
    });

    test('Can unsubscribe from an event', () => {
        const fooEvent = Event.sub('foo');

        Event.unsub(fooEvent);

        expect(Event.subscriptions['foo']).toBeFalsy();
    });

    test('Can unsubscribe from an array of events', () => {
        const subIds = Event.sub(['foo', 'bar']);
        const singleSub = Event.sub('baz');

        expect(Object.keys(Event.subscriptions).length).toBe(3);

        Event.unsub(subIds);

        expect(Object.keys(Event.subscriptions).length).toBe(1);
        expect(Object.keys(Event.subscriptions)[0]).toBe('baz');
    });

    test('Unsubscribing to an event will not affect other subscriptions', () => {
        const fooEvent = Event.sub('foo');
        const barEvent = Event.sub('bar');

        expect(Object.keys(Event.subscriptions).length).toBe(2);

        Event.unsub(fooEvent);

        expect(Object.keys(Event.subscriptions).length).toBe(1);
        expect(Event.subscriptions['foo']).toBeFalsy();
        expect(Event.subscriptions['bar']).toBeTruthy();
    });
});
