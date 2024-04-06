import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../../lib/components/ErrorPage";
import RootPage from "../pages";
import LoginPage from "../pages/login";
import { AppWrapper, LoginRoute, ProtectedRoute } from "./auth";

const router = createBrowserRouter([
  {
    element: <AppWrapper />,
    children: [
      {
        path: "/login",
        element: <LoginRoute />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <RootPage />,
          },
          {
            path: "*",
            element: <ErrorPage message="Page Not Found" />,
          },
        ],
      },
    ],
  },
]);

export default router;
