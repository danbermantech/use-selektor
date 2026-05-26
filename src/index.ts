import {
  ReactNode,
  createElement,
  createContext,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react'

export type SelektorFunction<State, Selekted> = (state: State) => Selekted
export type EqualityFunction<Selekted> = (a: Selekted, b: Selekted) => boolean

type Listener = () => void

type Store<State> = {
  getSnapshot: () => State
  setSnapshot: (nextState: State) => void
  subscribe: (listener: Listener) => () => void
}

function createStore<State>(initialState: State): Store<State> {
  let currentState = initialState
  const listeners = new Set<Listener>()

  return {
    getSnapshot: () => currentState,
    setSnapshot: (nextState: State) => {
      if (Object.is(currentState, nextState)) {
        return
      }

      currentState = nextState
      listeners.forEach(listener => listener())
    },
    subscribe: (listener: Listener) => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export type SelektorContext<State> = {
  Provider: (props: { value: State; children?: ReactNode }) => ReactNode
  useSelektor: <Selekted>(
    selektor: SelektorFunction<State, Selekted>,
    isEqual?: EqualityFunction<Selekted>
  ) => Selekted
}

export function createSelektorContext<State>(...args: [] | [defaultValue: State]): SelektorContext<State> {
  const hasDefaultValue = args.length === 1
  const defaultStore = hasDefaultValue ? createStore(args[0]) : null
  const StoreContext = createContext<Store<State> | null>(defaultStore)
  const useIsomorphicLayoutEffect =
    typeof window === 'undefined' ? useEffect : useLayoutEffect

  function Provider(props: { value: State; children?: ReactNode }) {
    const { value, children } = props
    const storeRef = useRef<Store<State> | null>(null)

    if (!storeRef.current) {
      storeRef.current = createStore(value)
    }

    const store = storeRef.current

    useIsomorphicLayoutEffect(() => {
      store.setSnapshot(value)
    }, [store, value])

    return createElement(StoreContext.Provider, { value: store }, children)
  }

  function useSelektor<Selekted>(
    selektor: SelektorFunction<State, Selekted>,
    isEqual?: EqualityFunction<Selekted>
  ): Selekted {
    const storeFromContext = useContext(StoreContext)
    const store = storeFromContext ?? defaultStore

    if (!store) {
      throw new Error('useSelektor must be used within its matching Selektor Provider.')
    }

    const latestSelektorRef = useRef(selektor)
    const latestIsEqualRef = useRef(isEqual)
    const latestSelektedRef = useRef<{ hasValue: boolean; value: Selekted }>({
      hasValue: false,
      value: undefined as unknown as Selekted,
    })

    latestSelektorRef.current = selektor
    latestIsEqualRef.current = isEqual

    const getSelektedSnapshot = (): Selekted => {
      const selectedState = latestSelektorRef.current(store.getSnapshot())
      const previousSelection = latestSelektedRef.current
      const equal = latestIsEqualRef.current ?? Object.is

      if (previousSelection.hasValue && equal(previousSelection.value, selectedState)) {
        return previousSelection.value
      }

      latestSelektedRef.current = {
        hasValue: true,
        value: selectedState,
      }

      return selectedState
    }

    return useSyncExternalStore(store.subscribe, getSelektedSnapshot, getSelektedSnapshot)
  }

  return {
    Provider,
    useSelektor,
  }
}