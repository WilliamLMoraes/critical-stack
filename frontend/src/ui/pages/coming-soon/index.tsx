import { useNavigate } from "react-router";
import { ROUTES } from "../../../config";
import Button from "../../components/button";
import PageHeader from "../../components/page-header";
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";
import styles from "./style.module.css";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <PageHeader title={title} description={description} />
      <div className={styles.content}>
        <div className={styles.illustration}>
          <GiDiceTwentyFacesTwenty className={styles.diceIcon} />
        </div>
        <h2 className={styles.heading}>Em construção</h2>
        <p className={styles.message}>
          Estamos desenvolvendo essa página ainda. Em breve ela estará
          disponível!
        </p>
        <Button onClick={() => navigate(ROUTES.HOME)}>
          Voltar para Campanhas
        </Button>
      </div>
    </div>
  );
}
