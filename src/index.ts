import { useRef, useContext, Context } from 'react'

// Define the type for the selektor function
export type SelektorFunction<State, Selekted> = (state: State) => Selekted

// Define a generic function to extract the State type from the context value
function useSelektorHelper<State, Selekted>(
  selektor: SelektorFunction<State, Selekted>,
  contextValue: State | undefined,
): Selekted {
  const latestSelektedStateRef = useRef<Selekted>()
  const latestSelektedResultRef = useRef<Selekted>()

  const selektedState = selektor(contextValue as State)

  if (selektedState !== latestSelektedResultRef.current) {
    latestSelektedResultRef.current = selektedState
    latestSelektedStateRef.current = selektedState
  }

  return latestSelektedResultRef.current as Selekted
}

// Define the type for the useSelektor hook
export function useSelektor<State, Selekted>(
  selektor: SelektorFunction<State, Selekted>,
  context: Context<State>,
): Selekted {
  const contextValue = useContext(context)
  return useSelektorHelper(selektor, contextValue)
}