import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";

import { GridConfigProvider } from "./contexts/grid-config-context";
import { AuthProvider } from "./contexts/auth-context";
import HomePage from "./ui/pages/home";
import GridMap from "./ui/pages/grid-map";
import LoginPage from "./ui/pages/login";
import RegisterPage from "./ui/pages/register";
import PrivateRoute from "./ui/pages/private-router";
import { ROUTES } from "./config";

const router = createBrowserRouter([
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.WILDCARD,
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "map",
        element: <GridMap />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <GridConfigProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </GridConfigProvider>
  </AuthProvider>,
);
