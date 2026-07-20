import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./contexts/auth-context";
import LandingPage from "./ui/pages/landing";
import HomePage from "./ui/pages/home";
import GridMap from "./ui/pages/grid-map";
import LoginPage from "./ui/pages/login";
import RegisterPage from "./ui/pages/register";
import PrivateRoute from "./ui/pages/private-router";
import CharactersPage from "./ui/pages/characters";
import LibraryPage from "./ui/pages/library";
import CommunityPage from "./ui/pages/community";
import SettingsPage from "./ui/pages/settings";
import ProfilePage from "./ui/pages/profile";
import { ROUTES, APP_ROUTES } from "./config";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.APP} element={<PrivateRoute />}>
          <Route path={APP_ROUTES.HOME} element={<HomePage />} />
          <Route path={APP_ROUTES.CHARACTERS} element={<CharactersPage />} />
          <Route path={APP_ROUTES.LIBRARY} element={<LibraryPage />} />
          <Route path={APP_ROUTES.COMMUNITY} element={<CommunityPage />} />
          <Route path={APP_ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={APP_ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={APP_ROUTES.MAP} element={<GridMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster position="top-right" />
  </AuthProvider>,
);
