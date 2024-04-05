import { useEffect, useRef } from "react";

const useOnMount = (onMount: () => void) => {
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      onMount();
      mountedRef.current = true;
    }
  }, [onMount]);
};

export default useOnMount;
