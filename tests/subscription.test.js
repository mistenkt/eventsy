import Event from '../index';

describe('Subscription functionality', () => {
    test('subscription is added to stack', () => {
        Event.sub('foo');
        expect(Object.keys(Event.subscriptions)[0]).toBe('foo');
    });

    test('subscription returns a subscription id', () => {
        const eventKey = Event.sub('bar');
        expect(eventKey).toBeTruthy();
    });

    test('two subscripions return different subscriptions ids', () => {
        const fooSub = Event.sub('foo');
        const barSub = Event.sub('bar');
        expect(fooSub).not.toMatch(barSub);
    });

    test('a subscriptions callback is triggered when an event is published', () => {
        const fn = jest.fn();
        const otherFn = jest.fn();

        Event.sub('callbackEvent', fn);
        Event.sub('otherCallbackEvent', otherFn);

        Event.publish('callbackEvent');

        expect(fn).toHaveBeenCalled();
        expect(otherFn).not.toHaveBeenCalled();
    });
});

describe('Subscription works with wildcards', () => {
    test('wildcards work', () => {
        Event.clearAll();

        const events = {
            'foo': jest.fn(),
            'foo*': jest.fn(),
            'foo/*': jest.fn(),
            'foo/**': jest.fn(),
            'foo/bar': jest.fn(),
            'foo/bar*': jest.fn(),
            'foo/bar/*': jest.fn(),
            'foo/bar/**': jest.fn(),
            'foo/bar/baz': jest.fn(),
        };

        Object.keys(events).forEach(key => {
            Event.sub(key, events[key]);
        });

        Event.publish('foo');

        expect(events['foo']).toHaveBeenCalledTimes(1);
        expect(events['foo*']).toHaveBeenCalledTimes(1);
        expect(events['foo/*']).toHaveBeenCalledTimes(0);
        expect(events['foo/**']).toHaveBeenCalledTimes(0);
        expect(events['foo/bar']).toHaveBeenCalledTimes(0);
        expect(events['foo/bar*']).toHaveBeenCalledTimes(0);
        expect(events['foo/bar/*']).toHaveBeenCalledTimes(0);
        expect(events['foo/bar/**']).toHaveBeenCalledTimes(0);
        expect(events['foo/bar/baz']).toHaveBeenCalledTimes(0);

        Event.publish('foo/bar');

        expect(events['foo']).toHaveBeenCalledTimes(1);
        expect(events['foo*']).toHaveBeenCalledTimes(2);
        expect(events['foo/*']).toHaveBeenCalledTimes(1);
        expect(events['foo/**']).toHaveBeenCalledTimes(1);
        expect(events['foo/bar']).toHaveBeenCalledTimes(1);
        expect(events['foo/bar*']).toHaveBeenCalledTimes(1);
        expect(events['foo/bar/*']).toHaveBeenCalledTimes(0);
        expect(events['foo/bar/**']).toHaveBeenCalledTimes(0);
        expect(events['foo/bar/baz']).toHaveBeenCalledTimes(0);

        Event.publish('foo/bar/baz');

        expect(events['foo']).toHaveBeenCalledTimes(1);
        expect(events['foo*']).toHaveBeenCalledTimes(3);
        expect(events['foo/*']).toHaveBeenCalledTimes(1);
        expect(events['foo/**']).toHaveBeenCalledTimes(2);
        expect(events['foo/bar']).toHaveBeenCalledTimes(1);
        expect(events['foo/bar*']).toHaveBeenCalledTimes(2);
        expect(events['foo/bar/*']).toHaveBeenCalledTimes(1);
        expect(events['foo/bar/**']).toHaveBeenCalledTimes(1);
        expect(events['foo/bar/baz']).toHaveBeenCalledTimes(1);
    });
});