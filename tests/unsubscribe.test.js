import Event from '../index';

describe('Unsubscription functionality', () => {

    test('Can unsubscribe from an event', () => {
        const fooEvent = Event.sub('foo');

        Event.unsub(fooEvent);

        expect(Event.subscriptions['foo']).toBeFalsy();
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
