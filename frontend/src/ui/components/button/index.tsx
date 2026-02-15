type ButtonProps = {
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "menu";
  size?: "small" | "medium" | "large";
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  className?: string;
  title?: string;
  active?: boolean;
};

import styles from "./style.module.css";

/*
Básico
  <Button>Click me</Button>

Variants
  <Button variant="secondary">Cancelar</Button>
  <Button variant="danger">Excluir</Button>
  <Button variant="success">Salvar</Button>

Tamanhos
  <Button size="large">Botão Grande</Button>
  <Button size="small">Pequeno</Button>

Estados
  <Button loading>Carregando...</Button>
  <Button disabled>Desabilitado</Button>

Botão Menu (com estado ativo)
  <Button 
    variant="menu" 
    iconOnly
    active={isActive}
    onActiveChange={setIsActive}
  >
    <MenuIcon />
  </Button>

Extras
  <Button fullWidth>100% Largura</Button>
  <Button iconOnly>🚀</Button>
  
Com ícone e texto
  <Button>
    <Icon /> Salvar Dados
  </Button>
*/

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  iconOnly = false,
  className = "",
  title = "",
  active = false,
  ...props
}: ButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    iconOnly && styles.iconOnly,
    variant === "menu" && active && styles.active,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClasses}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      title={title}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
}
