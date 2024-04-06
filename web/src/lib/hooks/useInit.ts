import { useState } from "react";
import useMounted from "./useMounted";
import useOnMount from "./useOnMount";

const useInit = (init: () => Promise<void>) => {
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();

  useOnMount(async () => {
    await init();
    mounted.current && setLoading(false);
  });

  return loading;
};

export default useInit;
