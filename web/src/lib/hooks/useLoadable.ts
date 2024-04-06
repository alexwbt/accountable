import { useState } from "react";
import useMounted from "./useMounted";

const useLoadable = (loader: () => Promise<void>) => {
  const [loading, setLoading] = useState(false);
  const mounted = useMounted();

  const load = async () => {
    if (loading) return;
    setLoading(true);
    await loader();
    if (mounted.current)
      setLoading(false);
  }

  return [loading, load] as const;
};

export default useLoadable;
