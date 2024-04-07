import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../../lib/components/ErrorPage";
import { SidebarRoute } from "../components/sidebar";
import RootPage from "../pages";
import LoginPage from "../pages/login";
import { AccessRefreshRoute, LoginRoute, ProtectedRoute } from "./routes";

const router = createBrowserRouter([
  {
    element: <AccessRefreshRoute />,
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
            element: <SidebarRoute />,
            children: [
              {
                path: "/",
                element: <RootPage />,
              },
            ],
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
