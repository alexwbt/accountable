import { toast } from "react-toastify";
import * as authApi from "../../api/auth";
import { useDispatch, useSelector } from "../../store";
import { setAccessToken } from "../../store/user";

const useAuth = () => {
  const accessToken = useSelector(s => s.user.accessToken);
  const dispatch = useDispatch();

  const refresh = async () => {
    if (accessToken) return;
    const token = await authApi.refresh().catch(() => "");
    dispatch(setAccessToken(token));
  };

  const login = async (username: string, password: string) => {
    const token = await authApi.login(username, password).catch(() => {
      toast.error("Login failed.");
      return "";
    });
    dispatch(setAccessToken(token));
  };

  const logout = async () => {
    await authApi.logout().catch(() => {
      toast.error("Logout failed.");
    });
    dispatch(setAccessToken(""));
  };

  return {
    login,
    logout,
    refresh,
    accessToken,
  };
};

export default useAuth;
