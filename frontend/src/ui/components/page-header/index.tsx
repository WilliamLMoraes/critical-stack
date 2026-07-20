import { useNavigate } from "react-router";
import { ROUTES } from "../../../config";
import { SearchIcon, UserIcon } from "../../icons";
import { IoMdNotificationsOutline } from "react-icons/io";
import styles from "./style.module.css";

export interface PageHeaderProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export default function PageHeader({
  title,
  description,
  searchPlaceholder,
  onSearch,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div className={styles.headerRight}>
        {onSearch && (
          <div className={styles.searchBox}>
            <SearchIcon className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder={searchPlaceholder || "Buscar..."}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}
        <button className={styles.iconButton} title="Notificações">
          <IoMdNotificationsOutline className={styles.icon} />
        </button>
        <button
          className={`${styles.iconButton} ${styles.profileButton}`}
          title="Perfil"
          onClick={() => navigate(ROUTES.PROFILE)}
        >
          <UserIcon className={styles.icon} />
        </button>
      </div>
    </div>
  );
}
