import Styles from "./style.module.css";
import logoIcon from "../../../assets/svgs/logos/logo-1.svg";
import Button from "../../components/button";
import GameCard from "../../components/game-card";

export default function HomePage() {
  return (
    <div className="container">
      <div className={Styles.main__content}>
        <header className={Styles.header}>
          <img src={logoIcon} alt="Critical Stack Logo" width={90} />
        </header>

        <main>
          <div className={Styles.page}>
            <section>
              <div className={Styles.page__header}>
                <h1>Minhas Mesas:</h1>
                <div>
                  <Button>Criar Mesa</Button>
                  <Button>Acessar Mesa</Button>
                </div>
              </div>
            </section>
            <section>
              <GameCard
                title="Dragon Quest XI"
                description="Jogo de RPG clássico com gráficos modernos e uma história épica que vai te prender por horas."
                imageUrl="../../../assets/images/backgrounds/images.jpeg"
                category="RPG"
                level="Nível 15-25"
                players="1-4 jogadores"
                duration="40-60 horas"
                variant="featured"
                onPlay={() => console.log('Iniciando Dragon Quest XI')}
                onEdit={() => console.log('Editando jogo')}
                onDelete={() => console.log('Excluindo jogo')}
              />
            </section>
          </div>
        </main>

        <footer className={Styles.footer}>
          <div>
            <div className={Styles.footer__container}>
              <p>Critical Stack - 2026</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
