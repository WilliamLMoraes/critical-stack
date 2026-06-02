import { type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`container ${className}`} style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1rem" }}>
      {children}
    </div>
  );
}
