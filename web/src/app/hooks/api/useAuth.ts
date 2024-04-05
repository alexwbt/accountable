import useOnMount from "../../../lib/hooks/useOnMount";
import { useSelector } from "../../store";

const useAuth = () => {
  const accessToken = useSelector(s => s.user.accessToken);

  useOnMount(() => {
    // if (!accessToken)
    
  });
};

export default useAuth;
