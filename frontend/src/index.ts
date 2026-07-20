export { AuthProvider, useAuth, AuthContext } from "./contexts/auth-context";

export { useApi, useForm } from "./hooks";
export type {
  AuthUserRequest,
  AuthUserResponse,
  RegisterUserRequest,
  LoggedUserResponse,
} from "./types";

export {
  ROUTES,
  APP_ROUTES,
  TOKEN_KEY,
  API_BASE_URL,
  PASSWORD_MIN_LENGTH,
  mensagemPadrao,
  MIN_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  EMAIL_REGEX,
  NOTIFICATIONS,
} from "./config";

export { default as Button } from "./ui/components/button";
export { default as Container } from "./ui/components/container";
export { default as CardContainer } from "./ui/components/card-container";
export { default as Form } from "./ui/components/form";
export { default as LogoComponent } from "./ui/components/logo-component";
export { default as PageHeader } from "./ui/components/page-header";
export { default as Sidebar } from "./ui/components/sidebar";

export { default as LandingPage } from "./ui/pages/landing";
export { default as HomePage } from "./ui/pages/home";
export { default as GridMap } from "./ui/pages/grid-map";
export { default as LoginPage } from "./ui/pages/login";
export { default as RegisterPage } from "./ui/pages/register";
export { default as PrivateRoute } from "./ui/pages/private-router";
export { default as CharactersPage } from "./ui/pages/characters";
export { default as LibraryPage } from "./ui/pages/library";
export { default as CommunityPage } from "./ui/pages/community";
export { default as SettingsPage } from "./ui/pages/settings";
export { default as ProfilePage } from "./ui/pages/profile";
