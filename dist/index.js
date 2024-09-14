import { useRef, useContext } from 'react';
// Define a generic function to extract the State type from the context value
function useSelectorHelper(selector, contextValue) {
    const latestSelectedStateRef = useRef();
    const latestSelectedResultRef = useRef();
    const selectedState = selector(contextValue);
    if (selectedState !== latestSelectedResultRef.current) {
        latestSelectedResultRef.current = selectedState;
        latestSelectedStateRef.current = selectedState;
    }
    return latestSelectedResultRef.current;
}
// Define the type for the useSelector hook
export function useSelector(selector, context) {
    const contextValue = useContext(context);
    return useSelectorHelper(selector, contextValue);
}
