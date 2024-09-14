import { useRef, useContext, Context } from 'react'

// Define the type for the selector function
export type SelectorFunction<State, Selected> = (state: State) => Selected

// Define a generic function to extract the State type from the context value
function useSelectorHelper<State, Selected>(
  selector: SelectorFunction<State, Selected>,
  contextValue: State | undefined,
): Selected {
  const latestSelectedStateRef = useRef<Selected>()
  const latestSelectedResultRef = useRef<Selected>()

  const selectedState = selector(contextValue as State)

  if (selectedState !== latestSelectedResultRef.current) {
    latestSelectedResultRef.current = selectedState
    latestSelectedStateRef.current = selectedState
  }

  return latestSelectedResultRef.current as Selected
}

// Define the type for the useSelector hook
export function useSelector<State, Selected>(
  selector: SelectorFunction<State, Selected>,
  context: Context<State>,
): Selected {
  const contextValue = useContext(context)
  return useSelectorHelper(selector, contextValue)
}
