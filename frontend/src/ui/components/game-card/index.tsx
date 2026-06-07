import styles from "./style.module.css";

interface GameCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  level?: string;
  players?: string;
  duration?: string;
  onPlay?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "default" | "featured" | "compact";
}

/*
Básico
    <GameCard 
    title="Dungeon Quest"
    description="Uma aventura épica em masmoras escuras"
    imageUrl="/game1.jpg"
    onPlay={() => console.log('Jogar')}
    />

Completo
    <GameCard 
    title="Dragon Quest XI"
    description="Jogo de RPG clássico com gráficos modernos"
    imageUrl="/dragon-quest.jpg"
    category="RPG"
    level="Nível 15-25"
    players="1-4 jogadores"
    duration="40-60 horas"
    variant="featured"
    onPlay={handlePlay}
    onEdit={handleEdit}
    onDelete={handleDelete}
    loading={isLoading}
    />

Compacto
    <GameCard 
    title="Mini Game"
    variant="compact"
    onPlay={quickPlay}
    />
*/

const DEFAULT_IMAGE =
  "https://shop-api.leaseweb.com/medias/background-default-banner-1-.png?context=bWFzdGVyfHJvb3R8ODM4OHxpbWFnZS9wbmd8YUdGbUwyZ3hOUzg0TnprNE1ETTBPRFV6T1RFNEwySmhZMnRuY205MWJtUXRaR1ZtWVhWc2RDMWlZVzV1WlhJZ0tERXBMbkJ1Wnd8MzZlN2FjYWFhYWJmYmFjM2FiNDMzZTNmNDYyOGMxZjE5ODFmNzQ2M2NkNDBiZTNjN2IyMmQ1ZWMzNzk0OWRiZg";

export default function GameCard({
  title,
  description,
  imageUrl,
  imageAlt,
  category,
  level,
  players,
  duration,
  onPlay,
  onEdit,
  onDelete,
  loading = false,
  disabled = false,
  variant = "default",
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
      {/* Imagem do Card */}
      <div className={styles.imageContainer}>
        <img
          src={imageUrl || DEFAULT_IMAGE}
          alt={imageAlt || title}
          className={styles.image}
          loading="lazy"
        />
        {variant === "featured" && (
          <span className={styles.badge}>Em Destaque</span>
        )}
        {category && <span className={styles.category}>{category}</span>}
      </div>

      {/* Conteúdo do Card */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {onEdit && (
            <button
              className={styles.actionButton}
              onClick={onEdit}
              disabled={disabled}
              aria-label="Editar"
            >
              ✏️
            </button>
          )}
        </div>

        {/* Descrição */}
        {description && variant !== "compact" && (
          <p className={styles.description}>{description}</p>
        )}

        {/* Metadados */}
        <div className={styles.metadata}>
          {level && (
            <div className={styles.metadataItem}>
              <span className={styles.metadataIcon}>⚔️</span>
              <span className={styles.metadataText}>{level}</span>
            </div>
          )}
          {players && (
            <div className={styles.metadataItem}>
              <span className={styles.metadataIcon}>👥</span>
              <span className={styles.metadataText}>{players}</span>
            </div>
          )}
          {duration && (
            <div className={styles.metadataItem}>
              <span className={styles.metadataIcon}>⏱️</span>
              <span className={styles.metadataText}>{duration}</span>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className={styles.actions}>
          {onPlay && (
            <button
              className={styles.playButton}
              onClick={onPlay}
              disabled={disabled || loading}
            >
              {loading ? "Carregando..." : "Jogar"}
            </button>
          )}
          {onDelete && (
            <button
              className={styles.deleteButton}
              onClick={onDelete}
              disabled={disabled}
              aria-label="Excluir"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
