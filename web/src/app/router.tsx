import { createBrowserRouter } from "react-router-dom";
import RootPage from "./pages";
import LoginPage from "./pages/login";
import ErrorPage from "../lib/components/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <ErrorPage message="Page Not Found" />,
  },
]);

export default router;
