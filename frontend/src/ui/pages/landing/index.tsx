import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Button, ROUTES, useAuth } from "../../../index";
import styles from "./style.module.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.bgBlur1} />
      <div className={styles.bgBlur2} />

      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.badge}>
            <div className={styles.badgeDot} />
            NOVO SISTEMA VTT
          </div>

          <h1 className={styles.title}>
            Crie e participe de<br />
            campanhas de RPG de<br />
            maneira <span className={styles.highlight}>fácil e rápida.</span>
          </h1>

          <p className={styles.subtitle}>
            Uma plataforma moderna que prioriza a sua narrativa. Menos tempo
            configurando fichas, mais tempo vivendo aventuras épicas.
          </p>

          <div className={styles.actions}>
            <Button
              variant="primary"
              size="medium"
              onClick={() => navigate(ROUTES.REGISTER)}
              className={styles.ctaButton}
            >
              Criar Conta
            </Button>
            <Link to={ROUTES.LOGIN} className={styles.loginLink}>
              Já possui conta? Faça o login
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>150k+</span>
              <span className={styles.statLabel}>Mestres Ativos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1.2M</span>
              <span className={styles.statLabel}>Sessões Realizadas</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4.9/5</span>
              <span className={styles.statLabel}>Avaliação Média</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={`${styles.floatingCard} ${styles.card1}`}>
            <div className={styles.cardImage}>
              <img
                src="/images/mapa.jpg"
                alt="Mapa"
                className={styles.cardImg}
              />
            </div>
          </div>

          <div className={`${styles.floatingCard} ${styles.card2}`}>
            <div className={styles.cardImageLarge}>
              <img
                src="/images/d20.jpg"
                alt="D20"
                className={styles.cardImg}
              />
            </div>
          </div>

          <div className={`${styles.floatingCard} ${styles.card3}`}>
            <div className={styles.cardImageTall}>
              <img
                src="/images/Elfo.jpg"
                alt="Elfo"
                className={styles.cardImg}
              />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardBar} style={{ width: "60%" }} />
              <div className={styles.cardBar} style={{ width: "40%" }} />
              <div className={styles.cardBarRow}>
                <div className={styles.cardBarSmall} style={{ background: "#22C55E", width: "16px" }} />
                <div className={styles.cardBarSmall} style={{ background: "#22C55E", width: "48px" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
