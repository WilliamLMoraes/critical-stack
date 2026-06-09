import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./contexts/auth-context";
import HomePage from "./ui/pages/home";
import GridMap from "./ui/pages/grid-map";
import LoginPage from "./ui/pages/login";
import RegisterPage from "./ui/pages/register";
import PrivateRoute from "./ui/pages/private-router";
import { ROUTES } from "./config";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.WILDCARD} element={<PrivateRoute />}>
          <Route path="" element={<HomePage />} />
          <Route path="map/:campaignId" element={<GridMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster position="top-right" />
  </AuthProvider>,
);
