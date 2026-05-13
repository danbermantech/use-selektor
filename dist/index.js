import { createElement, createContext, useEffect, useContext, useLayoutEffect, useRef, useSyncExternalStore, } from 'react';
function createStore(initialState) {
    let currentState = initialState;
    const listeners = new Set();
    return {
        getSnapshot: () => currentState,
        setSnapshot: (nextState) => {
            if (Object.is(currentState, nextState)) {
                return;
            }
            currentState = nextState;
            listeners.forEach(listener => listener());
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
    };
}
export function createSelektorContext() {
    const StoreContext = createContext(null);
    const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
    function Provider(props) {
        const { value, children } = props;
        const storeRef = useRef(null);
        if (!storeRef.current) {
            storeRef.current = createStore(value);
        }
        const store = storeRef.current;
        useIsomorphicLayoutEffect(() => {
            store.setSnapshot(value);
        }, [store, value]);
        return createElement(StoreContext.Provider, { value: store }, children);
    }
    function useSelektor(selektor, isEqual) {
        const store = useContext(StoreContext);
        if (!store) {
            throw new Error('useSelektor must be used within its matching Selektor Provider.');
        }
        const latestSelektorRef = useRef(selektor);
        const latestIsEqualRef = useRef(isEqual);
        const latestSelektedRef = useRef({
            hasValue: false,
            value: undefined,
        });
        latestSelektorRef.current = selektor;
        latestIsEqualRef.current = isEqual;
        const getSelektedSnapshot = () => {
            const selectedState = latestSelektorRef.current(store.getSnapshot());
            const previousSelection = latestSelektedRef.current;
            const equal = latestIsEqualRef.current ?? Object.is;
            if (previousSelection.hasValue && equal(previousSelection.value, selectedState)) {
                return previousSelection.value;
            }
            latestSelektedRef.current = {
                hasValue: true,
                value: selectedState,
            };
            return selectedState;
        };
        return useSyncExternalStore(store.subscribe, getSelektedSnapshot, getSelektedSnapshot);
    }
    return {
        Provider,
        useSelektor,
    };
}
