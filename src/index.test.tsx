import { act, cleanup, render, screen } from '@testing-library/react'
import { ReactNode, memo, useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { createSelektorContext } from './index'

afterEach(() => {
  cleanup()
})

describe('createSelektorContext', () => {
  it('rerenders only consumers whose selected slice changed', () => {
    type State = { count: number; label: string }
    const CounterContext = createSelektorContext<State>()

    const renderCounts = { count: 0, label: 0 }
    let setState!: (next: State | ((prev: State) => State)) => void

    const CountConsumer = memo(function CountConsumer() {
      renderCounts.count += 1
      const count = CounterContext.useSelektor(state => state.count)
      return <div data-testid="count">{count}</div>
    })

    const LabelConsumer = memo(function LabelConsumer() {
      renderCounts.label += 1
      const label = CounterContext.useSelektor(state => state.label)
      return <div data-testid="label">{label}</div>
    })

    function App() {
      const [state, setInternalState] = useState<State>({ count: 1, label: 'one' })
      setState = setInternalState

      return (
        <CounterContext.Provider value={state}>
          <CountConsumer />
          <LabelConsumer />
        </CounterContext.Provider>
      )
    }

    render(<App />)

    expect(renderCounts.count).toBe(1)
    expect(renderCounts.label).toBe(1)

    act(() => {
      setState(prev => ({ ...prev, label: 'two' }))
    })

    expect(screen.getByTestId('label').textContent).toBe('two')
    expect(renderCounts.count).toBe(1)
    expect(renderCounts.label).toBe(2)

    act(() => {
      setState(prev => ({ ...prev, count: 2 }))
    })

    expect(screen.getByTestId('count').textContent).toBe('2')
    expect(renderCounts.count).toBe(2)
    expect(renderCounts.label).toBe(2)
  })

  it('supports custom equality checks for selector output', () => {
    type State = { value: number; untouched: string }
    const ValueContext = createSelektorContext<State>()

    let setState!: (next: State | ((prev: State) => State)) => void
    let renderCount = 0

    const ValueConsumer = memo(function ValueConsumer() {
      renderCount += 1
      const selected = ValueContext.useSelektor(
        state => ({ value: state.value }),
        (a, b) => a.value === b.value
      )

      return <div data-testid="value">{selected.value}</div>
    })

    function App() {
      const [state, setInternalState] = useState<State>({ value: 1, untouched: 'a' })
      setState = setInternalState

      return (
        <ValueContext.Provider value={state}>
          <ValueConsumer />
        </ValueContext.Provider>
      )
    }

    render(<App />)

    expect(renderCount).toBe(1)

    act(() => {
      setState(prev => ({ ...prev, untouched: 'b' }))
    })

    expect(renderCount).toBe(1)

    act(() => {
      setState(prev => ({ ...prev, value: 2 }))
    })

    expect(screen.getByTestId('value').textContent).toBe('2')
    expect(renderCount).toBe(2)
  })

  it('throws when hook is used outside matching provider', () => {
    const CounterContext = createSelektorContext<{ count: number }>()

    function InvalidConsumer() {
      CounterContext.useSelektor(state => state.count)
      return null
    }

    expect(() => render(<InvalidConsumer />)).toThrow(
      'useSelektor must be used within its matching Selektor Provider.'
    )
  })

  it('uses default value when hook is used without matching provider', () => {
    const CounterContext = createSelektorContext<{ count: number }>({ count: 10 })

    function Consumer() {
      const count = CounterContext.useSelektor(state => state.count)
      return <div data-testid="count-with-default">{count}</div>
    }

    render(<Consumer />)

    expect(screen.getByTestId('count-with-default').textContent).toBe('10')
  })

  it('recomputes when selector function identity changes', () => {
    type State = { count: number; label: string }
    const CounterContext = createSelektorContext<State>()

    let setToggle!: (next: boolean | ((prev: boolean) => boolean)) => void

    function App() {
      const [toggle, setInternalToggle] = useState(false)
      setToggle = setInternalToggle

      const state: State = { count: 2, label: 'x' }
      const selected = CounterContext.useSelektor(toggle ? s => s.label : s => String(s.count))

      return <div data-testid="selected">{selected}</div>
    }

    function Wrapper({ children }: { children: ReactNode }) {
      const state: State = { count: 2, label: 'x' }
      return <CounterContext.Provider value={state}>{children}</CounterContext.Provider>
    }

    render(
      <Wrapper>
        <App />
      </Wrapper>
    )

    expect(screen.getByTestId('selected').textContent).toBe('2')

    act(() => {
      setToggle(true)
    })

    expect(screen.getByTestId('selected').textContent).toBe('x')
  })
})
