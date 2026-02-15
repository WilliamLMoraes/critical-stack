import { useState, useEffect, useRef } from "react";
import GridMap from "../../components/grid-map";
import Modal from "../../components/modal";
import Button from "../../components/button";
import styles from "./style.module.css";
import logoIcon from "../../../assets/svgs/logos/logo-2.svg";
import {
  BackgroundIcon,
  GridChangeColorIcon,
  GridOffIcon,
  GridResizeIcon,
  ImageIcon,
  PersonGroupIcon,
} from "../../icons";
import { useGridConfig } from "../../../contexts/grid-config-context";
import { DEFAULT_GRID_CONFIG, loadGridConfig } from "../../../config";

type GridConfig = typeof DEFAULT_GRID_CONFIG;

interface Token {
  id: string;
  image: string;
  x: number;
  y: number;
}

const BACKGROUND_IMAGES = [
  "/images/grid-backgrounds/antiguamente-arena-colosseum-ruins-map-fantasy-tabletop-rpg-exterior-battlemap-ttrpg-adventures-encounges-entra-nas-344021629.webp",
  "/images/grid-backgrounds/images (1).jpeg",
  "/images/grid-backgrounds/images (2).jpeg",
  "/images/grid-backgrounds/czx8cb6zah831.png",
  "/images/grid-backgrounds/7c0abc4207dfa3a98a9e478ff05ef88d.jpg",
  "/images/grid-backgrounds/599d66420ce710cdbfa83e3db238c7e5.jpg",
  "/images/grid-backgrounds/6515c521a85c18ab7ea65fcf29ce3785.jpg",
];

const TOKEN_IMAGES = [
  "/images/tokens/Images_H0SqZbnlzsnHLn7lsFof_resized_1748359002114l_w_800x800.webp",
];

export default function GridMapPage() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [topMenuOpen, setTopMenuOpen] = useState(false);

  const [configValues, setConfigValues] = useState(loadGridConfig());
  const { config, updateConfig, saveConfig: saveToStorage } = useGridConfig();

  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [tokensModalOpen, setTokensModalOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<
    string | undefined
  >();
  const [tokens, setTokens] = useState<Token[]>([]);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveToStorage();
  }, [config]);

  const handleConfigChange = <K extends keyof GridConfig>(
    field: K,
    value: GridConfig[K],
  ) => {
    setConfigValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveConfig = () => {
    updateConfig(configValues);
  };

  useEffect(() => {
    saveConfig();
  }, [configValues.SHOW_GRID, configValues.TRANSPARENT_BACKGROUND]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSelectBackground = (image: string) => {
    setSelectedBackground(image);
    if (!configValues.TRANSPARENT_BACKGROUND) {
      setConfigValues((prev) => ({ ...prev, TRANSPARENT_BACKGROUND: true }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} ${sideMenuOpen ? styles.open : ""}`}>
        <div className={styles.menuHeader}>
          <img src={logoIcon} alt="Critical Stack Logo" width={40} />
        </div>

        <nav className={styles.menuItems}>
          <div className={styles.menuItem}>
            <h4>Grade</h4>
            <ul>
              <li>
                <Button
                  title="Mudar tamanho da grade"
                  variant="menu"
                  iconOnly
                  onClick={() => setConfigModalOpen(true)}
                >
                  <GridResizeIcon />
                </Button>
              </li>
              <li>
                <Button
                  title="Mudar cor da grade"
                  variant="menu"
                  iconOnly
                  onClick={() => setColorModalOpen(true)}
                >
                  <GridChangeColorIcon />
                </Button>
              </li>
              <li>
                <Button
                  title="Desativar grade"
                  variant="menu"
                  iconOnly
                  active={!configValues.SHOW_GRID}
                  onClick={() =>
                    handleConfigChange("SHOW_GRID", !configValues.SHOW_GRID)
                  }
                >
                  <GridOffIcon fontSize="large" />
                </Button>
              </li>
            </ul>
            <h4 style={{ fontSize: "8px" }}>Ferramentas</h4>
            <ul>
              <li>
                <Button
                  title="Adicionar token"
                  variant="menu"
                  iconOnly
                  onClick={() => setTokensModalOpen(true)}
                >
                  <PersonGroupIcon />
                </Button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={`${styles.tobbar}  ${topMenuOpen ? styles.open : ""}`}>
        <div className={styles.carouselContainer}>
          <button
            className={styles.carouselButton}
            onClick={() => scrollCarousel("left")}
          >
            ‹
          </button>
          <div className={styles.carousel} ref={carouselRef}>
            {BACKGROUND_IMAGES.map((image, index) => (
              <div
                key={index}
                className={`${styles.carouselItem} ${
                  selectedBackground === image ? styles.selected : ""
                }`}
                onClick={() => handleSelectBackground(image)}
              >
                <img src={image} alt={`Background ${index + 1}`} />
              </div>
            ))}
          </div>
          <button
            className={styles.carouselButton}
            onClick={() => scrollCarousel("right")}
          >
            ›
          </button>
        </div>
        <div className={styles.showImageButton}>
          <Button
            title="Exibir imagem"
            variant="menu"
            iconOnly
            active={configValues.TRANSPARENT_BACKGROUND}
            onClick={() =>
              handleConfigChange(
                "TRANSPARENT_BACKGROUND",
                !configValues.TRANSPARENT_BACKGROUND,
              )
            }
          >
            <ImageIcon />
          </Button>
        </div>
      </div>

      <GridMap backgroundImage={selectedBackground} tokens={tokens} onTokensChange={setTokens} />

      <button
        className={styles.sideBarButton}
        onClick={() => setSideMenuOpen(!sideMenuOpen)}
        style={{ left: sideMenuOpen ? "70px" : "0" }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <Modal
        isOpen={configModalOpen}
        toggleModal={setConfigModalOpen}
        closeOnOutsideClick={false}
        draggable={true}
        title="Configurar Grade"
      >
        <div className={styles.modalContainer}>
          <div>
            <label className={styles.modalLabel}>Largura da Grade:</label>
            <input
              type="number"
              value={configValues.GRID_CELLS_WIDTH}
              onChange={(e) =>
                handleConfigChange(
                  "GRID_CELLS_WIDTH",
                  parseInt(e.target.value) || 1,
                )
              }
              min="1"
              max="50"
              className={styles.modalImput}
            />
          </div>

          <div>
            <label className={styles.modalLabel}>Altura da Grade:</label>
            <input
              type="number"
              value={configValues.GRID_CELLS_HEIGHT}
              onChange={(e) =>
                handleConfigChange(
                  "GRID_CELLS_HEIGHT",
                  parseInt(e.target.value) || 1,
                )
              }
              min="1"
              max="50"
              className={styles.modalImput}
            />
          </div>

          <div className={styles.modalButton}>
            <Button
              onClick={() => setConfigModalOpen(false)}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button onClick={saveConfig} variant="primary">
              Salvar
            </Button>
          </div>
        </div>
      </Modal>

      <button
        className={styles.topBarButton}
        onClick={() => setTopMenuOpen(!topMenuOpen)}
        style={{ top: topMenuOpen ? "150px" : "0" }}
      >
        <BackgroundIcon color="white" fontSize="large" />
      </button>
      <Modal
        isOpen={colorModalOpen}
        toggleModal={setColorModalOpen}
        closeOnOutsideClick={false}
        draggable={true}
        title="Configurar Cor da Grade"
      >
        <div className={styles.modalContainer}>
          <div>
            <label className={styles.modalLabel}>Cor da Linha:</label>
            <input
              type="color"
              value={configValues.GRID_COLOR}
              onChange={(e) => handleConfigChange("GRID_COLOR", e.target.value)}
              className={styles.modalColorPicker}
            />
          </div>
          <div>
            <label className={styles.modalLabel}>Cor de Fundo:</label>
            <input
              type="color"
              value={configValues.BACKGROUND_COLOR}
              onChange={(e) =>
                handleConfigChange("BACKGROUND_COLOR", e.target.value)
              }
              className={styles.modalColorPicker}
            />
          </div>

          <div className={styles.modalButton}>
            <Button
              onClick={() => setColorModalOpen(false)}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button onClick={saveConfig} variant="primary">
              Salvar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={tokensModalOpen}
        toggleModal={setTokensModalOpen}
        closeOnOutsideClick={false}
        draggable={true}
        title="Selecionar Token"
      >
        <div className={styles.modalContainer}>
          <div className={styles.tokenList}>
            {TOKEN_IMAGES.map((image, index) => (
              <div
                key={index}
                className={styles.tokenItem}
                onClick={() => {
                  const newToken: Token = {
                    id: `${Date.now()}-${index}`,
                    image,
                    x: 0,
                    y: 0,
                  };
                  setTokens((prev) => [...prev, newToken]);
                  setTokensModalOpen(false);
                }}
              >
                <img src={image} alt={`Token ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className={styles.modalButton}>
            <Button
              onClick={() => setTokensModalOpen(false)}
              variant="secondary"
            >
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
