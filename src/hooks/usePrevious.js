import { useEffect, useRef } from "react";

export function usePrevious(value, initialValue = null) {
    const ref = useRef(initialValue);

    useEffect(() => {
        ref.current = value;
    }, [value]);
    
    return ref.current;
}