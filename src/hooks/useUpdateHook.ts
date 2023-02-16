/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";

function useUpdateEffect(effect:any, dependencies: Array<any> = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
  }, dependencies);
}

export default useUpdateEffect;
