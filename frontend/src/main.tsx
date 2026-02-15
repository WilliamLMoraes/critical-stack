import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";

import { GridConfigProvider } from "./contexts/grid-config-context";
import HomePage from "./ui/pages/home";
import GridMap from "./ui/pages/grid-map";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/map",
    element: <GridMap />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <GridConfigProvider>
    <RouterProvider router={router} />
  </GridConfigProvider>,
);
