import { FaFolderOpen, FaEdit } from "react-icons/fa";
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";
import styles from "./style.module.css";
import Button from "../button";

interface GameCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  owner?: string;
  variant?: "default" | "featured" | "compact";
  onPlay?: () => void;
  onEdit?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function GameCard({
  title,
  description,
  imageUrl,
  imageAlt,
  owner,
  variant = "default",
  onPlay,
  onEdit,
  loading = false,
  disabled = false,
}: GameCardProps) {
  const cardClasses = [
    styles.card,
    styles[variant],
    loading && styles.loading,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClasses}>
      <div className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className={styles.image}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder}>
              <GiDiceTwentyFacesTwenty className={styles.placeholderIcon} />
            </div>
          )}
        </div>
        {variant === "featured" && (
          <span className={styles.badge}>Em Destaque</span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        {description && (
          <p className={styles.description}>{description}</p>
        )}

        <div className={styles.contentBottom}>
        {owner && (
          <p className={styles.owner}>Owner: {owner}</p>
        )}

        <div className={styles.actions}>
          {onPlay && (
            <div className={styles.actionPrimary}>
              <Button
                variant="primary"
                size="small"
                onClick={onPlay}
                disabled={disabled || loading}
                className={styles.actionButton}
              >
                <FaFolderOpen /> Open
              </Button>
            </div>
          )}
          {onEdit && (
            <div className={styles.actionSecondary}>
              <Button
                variant="secondary"
                size="small"
                onClick={onEdit}
                disabled={disabled}
                className={styles.actionButton}
              >
                <FaEdit /> Edit
              </Button>
            </div>
          )}
        </div>

        </div>
      </div>
    </article>
  );
}
