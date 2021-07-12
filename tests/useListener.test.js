import React, {useEffect, useState} from 'react';
import {createStore, applyMiddleware} from "redux";
import Eventsy, {eventSystemReduxMiddleware, useListener} from "../index";
import { Provider } from 'react-redux';
import {renderHook, act} from "@testing-library/react-hooks";
import {render, fireEvent, screen, act as reactAct} from '@testing-library/react';
import '@testing-library/jest-dom'

const store = createStore((state) => state, applyMiddleware(eventSystemReduxMiddleware));
const dispatch = (type, payload) => store.dispatch({type, payload: payload || {}});
const wrapper = ({children}) => (
    <Provider store={store}>
        {children}
    </Provider>
);


describe('useListener tests', () => {
    test('Listener is triggered from redux action', async () => {
        const callback = jest.fn();
        const {result, waitForNextUpdate} = renderHook(
            () => useListener('foo/bar', callback),
            {
                wrapper
            }
        );

        expect(callback).not.toHaveBeenCalled();

        dispatch('foo/bar', 'data');

        expect(callback).toHaveBeenCalledWith('data', 'foo/bar');
    });

    /**
     * @jest-environment node || jsdom
     */
    test('Listener sees updated state', async () => {
        const TestComponent = () => {
            const [state, setState] = useState('foo');
            const [callbackState, setCallbackState] = useState('');
            useListener('foo/bar', () => {
                setCallbackState(state);
            }, [state]);

            useEffect(() => {
                if(state === 'foo') return;
                Eventsy.publish('foo/bar');
            }, [state]);

            const handleUpdate = () => {
                setState('bar');
            };

            return (
                <>
                    <div data-testid="value">{callbackState}</div>
                    <button data-testid="button" onClick={handleUpdate}/>
                </>
            )
        }

        render(
            <TestComponent/>
        );

        expect(screen.getByTestId('value')).toHaveTextContent('');
        fireEvent.click(screen.getByTestId('button'));
        expect(screen.getByTestId('value')).toHaveTextContent('bar');
    });
});
