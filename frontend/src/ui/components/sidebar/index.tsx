import { useLocation, useNavigate } from "react-router";
import { ROUTES } from "../../../config";
import { useAuth } from "../../../contexts/auth-context";
import { CiGrid42 } from "react-icons/ci";
import { MdOutlinePeople } from "react-icons/md";
import {
  LibraryIcon,
  CommunityIcon,
  SettingsIcon,
  LogoutIcon,
} from "../../icons";
import logoPath from "../../../assets/svgs/logos/logo-2.svg";
import styles from "./style.module.css";

const NAV_ITEMS = [
  { label: "Campanhas", icon: CiGrid42, path: ROUTES.HOME },
  { label: "Personagens", icon: MdOutlinePeople, path: ROUTES.CHARACTERS },
  { label: "Biblioteca", icon: LibraryIcon, path: ROUTES.LIBRARY },
  { label: "Comunidade", icon: CommunityIcon, path: ROUTES.COMMUNITY },
  { label: "Configurações", icon: SettingsIcon, path: ROUTES.SETTINGS },
] as const;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LANDING);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src={logoPath} alt="Critical Stack" className={styles.logo} />
        <span className={styles.logoText}>CriticalStack</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === ROUTES.HOME
              ? location.pathname === ROUTES.HOME
              : location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogoutIcon className={styles.logoutIcon} />
          <span className={styles.logoutLabel}>Sair</span>
        </button>
      </div>
    </aside>
  );
}
