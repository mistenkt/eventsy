# eventsy
JS Event System with redux integration

#### Installation

```
yarn add eventsy
```

#### Basic Usage

```javascript
...
import Event from 'eventsy';

class Foo extends Component {
    componentDidMount() {
        this.listener = Event.sub('foo', this.handleFoo);
    }
    
    componentWillUnmount() {
        Event.unsub(this.listener);
    }
    
    somethingThatTriggeredFoo = () => {
        Event.publish('foo', data);
    }
    
    handleFoo = () => {
        // Run your code here
    };
}
```

#### Integration with Redux

If you want the Event system to listen to and broadcast redux actions just import the redux middleware.

```javascript
//store.js
import {eventSystemReduxMiddleware} from 'eventsy';


const store = createStore(
    reducers,
    applyMiddleware(eventSystemReduxMiddleware)
);
```
Now you can execute code in your components based on dispatched redux actions

### API

#### ``subscribe(event, callback)`` 

* ``event`` (string|array) supports either a string or an array of strings that will all execute the same callback.
* ``callback`` (function) expects a function that will be executed when the event triggers
* `returns` (string) the method will return a subscription key that can be used to unsubscribe

#### ``sub(event, callback)``
* shorthand version of ``subscribe()``

#### ``unsubscribe(key)``
* ``key`` (string|array) subscription key (or array of keys) returned from ``subscribe``

#### `unsub(key)`
* shorthand version of `unsubscribe()`

#### `publish(event, payload)`
* `event` (string) event that will be broadcasted to all relevant subscribers
* `payload` (mixed) payload that will be passed to the subscribers callback

#### `clearAll()`
* clears all subscribers


### Wildcards
3 different wildcards levels are supported

#### `login*`
* Would trigger on `login`, `login/success`, `login/failed`, `login/failed/wrong_password`

#### `login/*`
* Would trigger on `login/success`, `login/failed` ...
* Would not trigger on `login`, `login/failed/wrong_pass`

#### `login/**`
* Would trigger on `login/success`, `login/failed`, `login/failed/wrong_password`
* Would not trigger on `login`


