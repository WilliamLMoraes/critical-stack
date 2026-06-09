import Styles from "./style.module.css";
import { useEffect, useState } from "react";
import {
  useAuth,
  useApi,
  Container,
  LogoComponent,
  ROUTES,
} from "../../../index";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router";

const PrivateRoute = () => {
  const { logout, token, login } = useAuth();
  const { user, refreshToken } = useApi();
  const [userLogged, setUserLogged] = useState<{
    username: string;
    email: string;
  } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hideHeaderRoutes = [ROUTES.MAP];
  const shouldHideHeader = (hideHeaderRoutes as string[]).some((route) =>
    location.pathname.startsWith(route + "/"),
  );

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const response = await user();
      if (response) {
        setUserLogged(response);
        setAuthChecked(true);
        return;
      }

      const refreshed = await refreshToken();
      if (refreshed) {
        login(refreshed.token, refreshed.expiresIn);
        const retry = await user();
        if (retry) {
          setUserLogged(retry);
          setAuthChecked(true);
          return;
        }
      }

      logout();
      navigate(ROUTES.LOGIN, { replace: true });
    };

    if (token) {
      checkAuth();
    } else {
      setAuthChecked(true);
    }
  }, []);

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const selectedTheme = localStorage.getItem("theme");
  if (selectedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.setAttribute("data-theme", "light");
  }

  return (
    <>
      {isMenuOpen && (
        <div
          className={Styles.backdrop}
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      {!shouldHideHeader && (
        <header className={Styles.header}>
          <Container>
            <div
              onClick={() => navigate(ROUTES.HOME)}
              className={Styles.logoMobile}
            >
              <LogoComponent />
            </div>
            <div className={Styles.headerContainer}>
              <button
                className={Styles.buttonLogo}
                onClick={() => navigate(ROUTES.HOME)}
              >
                <LogoComponent />
              </button>
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <span style={{ color: "#666" }}>
                  {userLogged?.username || "Carregando..."}
                </span>
                <button onClick={handleLogout} className={Styles.logout}>
                  Sair
                </button>
              </div>
            </div>
          </Container>
        </header>
      )}
      <div className={Styles.space}></div>
      {authChecked && <Outlet />}
    </>
  );
};

export default PrivateRoute;
