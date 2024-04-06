import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../../lib/components/Spinner";
import useInit from "../../lib/hooks/useInit";
import { refresh } from "../api/auth";
import { useDispatch, useSelector } from "../store";
import { setAccessToken } from "../store/user";

export const ProtectedRoute: React.FC = () => {
  const accessToken = useSelector(s => s.user.accessToken);
  return !accessToken
    ? <Navigate to="/login" replace />
    : <Outlet />;
};

export const LoginRoute: React.FC = () => {
  const accessToken = useSelector(s => s.user.accessToken);
  return accessToken
    ? <Navigate to="/" replace />
    : <Outlet />;
};

export const AppWrapper: React.FC = () => {
  const accessToken = useSelector(s => s.user.accessToken);
  const dispatch = useDispatch();

  const loading = useInit(async () => {
    if (accessToken) return;
    const token = await refresh().catch(() => "");
    dispatch(setAccessToken(token));
  });

  return loading ? <Spinner /> : <Outlet />
};
