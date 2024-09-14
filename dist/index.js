import { useRef, useContext } from 'react';
// Define a generic function to extract the State type from the context value
function useSelektorHelper(selektor, contextValue) {
    const latestSelektedStateRef = useRef();
    const latestSelektedResultRef = useRef();
    const selektedState = selektor(contextValue);
    if (selektedState !== latestSelektedResultRef.current) {
        latestSelektedResultRef.current = selektedState;
        latestSelektedStateRef.current = selektedState;
    }
    return latestSelektedResultRef.current;
}
// Define the type for the useSelektor hook
export function useSelektor(selektor, context) {
    const contextValue = useContext(context);
    return useSelektorHelper(selektor, contextValue);
}
