import Styles from "./style.module.css";
import { useEffect, useState } from "react";
import { useAuth, useApi, ROUTES } from "../../../index";
import { useLocation, Navigate, Outlet } from "react-router";
import Sidebar from "../../components/sidebar";
import D20Roller from "../../components/d20-roller";

const PrivateRoute = () => {
  const { token } = useAuth();
  const { user } = useApi();
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  const hideLayoutRoutes = [ROUTES.MAP];
  const shouldHideLayout = (hideLayoutRoutes as string[]).some((route) =>
    location.pathname.startsWith(route + "/"),
  );

  const hideD20Routes: string[] = [];
  const shouldShowD20 = !(hideD20Routes as string[]).some((route) =>
    location.pathname.startsWith(route + "/"),
  );

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        await user();
      }
      setAuthChecked(true);
    };

    loadUser();
  }, []);

  if (!token) {
    return <Navigate to={ROUTES.LANDING} replace />;
  }

  if (!authChecked) {
    return (
      <div className={Styles.spinnerContainer}>
        <div className={Styles.spinner} />
      </div>
    );
  }

  const selectedTheme = localStorage.getItem("theme");
  if (selectedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.setAttribute("data-theme", "light");
  }

  return (
    <>
      {!shouldHideLayout && <Sidebar />}
      {authChecked && (
        <div
          className={Styles.pageContainer}
          style={!shouldHideLayout ? { marginLeft: 256 } : undefined}
        >
          <Outlet />
          {!shouldHideLayout && (
            <footer className={Styles.footer}>
              <div className={Styles.footer__container}>
                <p>© 2026 Critical Stack</p>
              </div>
            </footer>
          )}
        </div>
      )}
      <D20Roller show={shouldShowD20} />
    </>
  );
};

export default PrivateRoute;
