import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../../lib/components/Spinner";
import useInit from "../../lib/hooks/useInit";
import useAuth from "../hooks/api/useAuth";
import { useSelector } from "../store";

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

export const AccessRefreshRoute: React.FC = () => {
  const { refresh } = useAuth();
  const loading = useInit(refresh);
  return loading ? <Spinner /> : <Outlet />;
};
