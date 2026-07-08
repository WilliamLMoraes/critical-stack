import Styles from "./style.module.css";
import { useEffect, useRef, useState } from "react";
import {
  useAuth,
  useApi,
  LogoComponent,
  ROUTES,
} from "../../../index";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router";
import { BiSolidUserCircle } from "react-icons/bi";

const PrivateRoute = () => {
  const { logout, token } = useAuth();
  const { user } = useApi();
  const [userLogged, setUserLogged] = useState<{
    username: string;
    email: string;
  } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hideHeaderRoutes = [ROUTES.MAP];
  const shouldHideHeader = (hideHeaderRoutes as string[]).some((route) =>
    location.pathname.startsWith(route + "/"),
  );

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate(ROUTES.LANDING);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const result = await user();
      if (result) {
        setUserLogged(result);
      }
      setAuthChecked(true);
    };

    if (token) {
      loadUser();
    } else {
      setAuthChecked(true);
    }
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
      {!shouldHideHeader && (
        <header className={Styles.header}>
          <div className={Styles.headerInner}>
            <div className={Styles.headerContent}>
              <button
                className={Styles.logoButton}
                onClick={() => navigate(ROUTES.HOME)}
              >
                <LogoComponent />
              </button>
              <div className={Styles.headerRight} ref={dropdownRef}>
                <button
                  className={`${Styles.userButton} ${isMenuOpen ? Styles.userButtonActive : ""}`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className={Styles.username}>
                    {userLogged?.username || "Carregando..."}
                  </span>
                  <div className={`${Styles.avatar} ${isMenuOpen ? Styles.avatarActive : ""}`}>
                    <BiSolidUserCircle className={Styles.avatarIcon} />
                  </div>
                </button>
                {isMenuOpen && (
                  <div className={Styles.dropdown}>
                    <button
                      onClick={handleLogout}
                      className={Styles.dropdownItem}
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
      <div className={Styles.space}></div>
      {authChecked && (
        <div className={Styles.pageContainer}>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default PrivateRoute;
