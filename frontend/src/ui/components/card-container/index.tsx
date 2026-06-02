import { type ReactNode, type CSSProperties } from "react";
import styles from "./style.module.css";

interface CardContainerProps {
  children: ReactNode;
  type: "default" | "custom";
  className?: string;
  style?: CSSProperties;
}

const CardContainer = ({ children, type, className = "", style }: CardContainerProps) => {
  return (
    <div 
      style={style}
      className={`${styles.cardContainer} ${styles[type]} ${className}`}
    >
      {children}
    </div>
  );
};

export default CardContainer;