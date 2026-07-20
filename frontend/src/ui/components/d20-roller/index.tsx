import { useState, useCallback, useRef } from "react";
import { D20Icon } from "../../icons";
import styles from "./style.module.css";

type D20RollerProps = {
  show?: boolean;
};

export default function D20Roller({ show = true }: D20RollerProps) {
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roll = useCallback(() => {
    if (rolling) return;

    setRolling(true);
    setResult(null);

    let count = 0;
    const maxTicks = 12;
    const interval = setInterval(() => {
      count++;
      if (count >= maxTicks) {
        clearInterval(interval);
        const final = Math.floor(Math.random() * 20) + 1;
        setResult(final);
        setRolling(false);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setResult(null);
        }, 2500);
      }
    }, 80);
  }, [rolling]);

  if (!show) return null;

  return (
    <div className={styles.wrapper}>
      {result !== null && (
        <div
          className={`${styles.result} ${
            result === 1 ? styles.criticalFail : ""
          } ${result === 20 ? styles.criticalSuccess : ""}`}
        >
          <span className={styles.resultValue}>{result}</span>
        </div>
      )}
      <button
        className={`${styles.button} ${rolling ? styles.rolling : ""} ${
          result === 1 ? styles.shake : ""
        } ${result === 20 ? styles.glow : ""}`}
        onClick={roll}
        disabled={rolling}
        title="Rolar D20"
      >
        <D20Icon size={28} color="white" />
      </button>
    </div>
  );
}
