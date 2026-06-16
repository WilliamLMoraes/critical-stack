import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useParams, useNavigate } from "react-router";
import GridMap from "../../components/grid-map";
import Modal from "../../components/modal";
import ConfirmDialog from "../../components/confirm-dialog";
import Button from "../../components/button";
import styles from "./style.module.css";
import logoIcon from "../../../assets/svgs/logos/logo-2.svg";
import noImage from "../../../assets/images/grid-backgrounds/no-image.png";
import {
  BackgroundIcon,
  GridChangeColorIcon,
  GridOffIcon,
  GridResizeIcon,
  ImageIcon,
  PersonGroupIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
} from "../../icons";
import type { GridConfig } from "../../components/grid-map";
import { useApi } from "../../../hooks/use-api";
import { NOTIFICATIONS, ROUTES } from "../../../config";
import toast from "react-hot-toast";

interface Token {
  id: string;
  image: string;
  x: number;
  y: number;
}

interface GridListItem {
  id: number;
  folderId: number | null;
  name: string;
  imageBackgroundUrl: string | null;
}

export default function GridMapPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { getCampaignGrids, getCampaignGridById, createCampaignGrid, updateCampaignGrid, deleteCampaignGrid } = useApi();

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [topMenuOpen, setTopMenuOpen] = useState(false);

  const [configValues, setConfigValues] = useState<GridConfig | null>(null);
  const [draftValues, setDraftValues] = useState<GridConfig | null>(null);

  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [tokensModalOpen, setTokensModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [tokens, setTokens] = useState<Token[]>([]);
  const [gridList, setGridList] = useState<GridListItem[]>([]);
  const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
  const [loadingGrids, setLoadingGrids] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedBackgroundUrl, setSelectedBackgroundUrl] = useState<string | null>(null);

  const [selectedGridDetails, setSelectedGridDetails] = useState<{
    name: string;
    description: string;
    imageUrl: string;
    width: number;
    height: number;
    cellSize: number;
    lineColor: string;
    backgroundColor: string;
    showGrid: boolean;
  } | null>(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    imageUrl: "",
    description: "",
  });
  const [createFormError, setCreateFormError] = useState("");

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!campaignId) return;

    loadGrids();
  }, [campaignId]);

  const loadGrids = async () => {
    setLoadingGrids(true);
    const grids = await getCampaignGrids(Number(campaignId));
    if (!grids) {
      setLoadError(true);
      setLoadingGrids(false);
      toast.error("Erro de conexão com o servidor.");
      navigate(ROUTES.HOME, { replace: true });
      return;
    }
    if (grids.length > 0) {
      setGridList(grids);
      selectGrid(grids[0].id);
    }
    setLoadingGrids(false);
  };

  const selectGrid = async (gridId: number) => {
    setSelectedGridId(gridId);
    const grid = await getCampaignGridById(Number(campaignId), gridId);
    if (!grid) return;

    const newConfig = {
      GRID_CELLS_WIDTH: grid.width,
      GRID_CELLS_HEIGHT: grid.height,
      CELL_SIZE: grid.cellSize,
      SHOW_GRID: grid.showGrid,
      GRID_COLOR: grid.lineColor,
      BACKGROUND_COLOR: grid.backgroundColor,
      TRANSPARENT_BACKGROUND: grid.showBackgroundImage,
    };
    setConfigValues(newConfig);
    setSelectedBackgroundUrl(grid.imageBackgroundUrl);
  };

  const handleConfigChange = <K extends keyof GridConfig>(
    field: K,
    value: GridConfig[K],
  ) => {
    setConfigValues((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleDraftChange = <K extends keyof GridConfig>(
    field: K,
    value: GridConfig[K],
  ) => {
    setDraftValues((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const openModal = (setOpen: Dispatch<SetStateAction<boolean>>) => () => {
    setDraftValues(configValues);
    setOpen(true);
  };

  const closeModal = (setOpen: Dispatch<SetStateAction<boolean>>) => () => {
    setDraftValues(null);
    setOpen(false);
  };

  const saveDraft = (setOpen: Dispatch<SetStateAction<boolean>>) => async () => {
    if (!draftValues || !selectedGridId || !campaignId) return;
    setConfigValues(draftValues);
    setDraftValues(null);
    setOpen(false);
    await saveToApiConfig({ source: draftValues });
  };

  const saveToApiConfig = async (overrides?: {
    showGrid?: boolean;
    imageBackgroundUrl?: string | null;
    showBackgroundImage?: boolean;
    source?: GridConfig;
  }) => {
    const cfg = overrides?.source ?? configValues;
    if (!cfg || !campaignId || !selectedGridId) return;

    const bgUrl = overrides?.imageBackgroundUrl !== undefined
      ? overrides.imageBackgroundUrl
      : selectedBackgroundUrl;

    const success = await updateCampaignGrid(Number(campaignId), selectedGridId, {
      name: "Grid",
      width: cfg.GRID_CELLS_WIDTH,
      height: cfg.GRID_CELLS_HEIGHT,
      cellSize: cfg.CELL_SIZE,
      lineColor: cfg.GRID_COLOR,
      backgroundColor: cfg.BACKGROUND_COLOR,
      showGrid: overrides?.showGrid ?? cfg.SHOW_GRID,
      imageBackgroundUrl: bgUrl,
      showBackgroundImage: overrides?.showBackgroundImage ?? cfg.TRANSPARENT_BACKGROUND,
    });

    if (success) {
      toast.success(NOTIFICATIONS.GRID_SAVED);
    } else {
      toast.error(NOTIFICATIONS.GRID_ERROR);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSelectBackground = async (grid: GridListItem) => {
    if (grid.id === selectedGridId) return;
    setSelectedGridId(grid.id);
    await selectGrid(grid.id);
  };

  const openCreateModal = () => {
    setCreateForm({ name: "", imageUrl: "", description: "" });
    setCreateFormError("");
    setCreateModalOpen(true);
  };

  const handleCreateGrid = async () => {
    if (!createForm.name.trim()) {
      setCreateFormError("O nome é obrigatório.");
      return;
    }

    const success = await createCampaignGrid(Number(campaignId), {
      name: createForm.name,
      width: 20,
      height: 20,
      cellSize: 32,
      lineColor: "#cccccc",
      backgroundColor: "#1a1a1a",
      showGrid: true,
      imageBackgroundUrl: createForm.imageUrl || null,
      description: createForm.description || undefined,
      showBackgroundImage: createForm.imageUrl ? true : false,
    });

    if (success) {
      toast.success(NOTIFICATIONS.GRID_CREATED);
      setCreateModalOpen(false);
      await loadGrids();
    } else {
      toast.error(NOTIFICATIONS.GRID_ERROR);
    }
  };

  const openViewModal = async (grid: GridListItem) => {
    const fullGrid = await getCampaignGridById(Number(campaignId), grid.id);
    if (!fullGrid) return;

    setSelectedGridDetails({
      name: fullGrid.name,
      description: fullGrid.description || "",
      imageUrl: fullGrid.imageBackgroundUrl || "",
      width: fullGrid.width,
      height: fullGrid.height,
      cellSize: fullGrid.cellSize,
      lineColor: fullGrid.lineColor,
      backgroundColor: fullGrid.backgroundColor,
      showGrid: fullGrid.showGrid,
    });
    setViewModalOpen(true);
  };

  const handleSaveViewModal = async () => {
    if (!selectedGridDetails || !selectedGridId || !campaignId) return;

    const success = await updateCampaignGrid(Number(campaignId), selectedGridId, {
      name: selectedGridDetails.name,
      width: selectedGridDetails.width,
      height: selectedGridDetails.height,
      cellSize: selectedGridDetails.cellSize,
      lineColor: selectedGridDetails.lineColor,
      backgroundColor: selectedGridDetails.backgroundColor,
      showGrid: selectedGridDetails.showGrid,
      imageBackgroundUrl: selectedGridDetails.imageUrl || null,
      description: selectedGridDetails.description || undefined,
      showBackgroundImage: configValues?.TRANSPARENT_BACKGROUND ?? false,
    });

    if (success) {
      toast.success(NOTIFICATIONS.GRID_SAVED);
      setViewModalOpen(false);
      await loadGrids();
    } else {
      toast.error(NOTIFICATIONS.GRID_ERROR);
    }
  };

  const handleDeleteGrid = async () => {
    if (!selectedGridId || !campaignId) return;

    const success = await deleteCampaignGrid(Number(campaignId), selectedGridId);

    if (success) {
      toast.success(NOTIFICATIONS.GRID_DELETED);
      setDeleteDialogOpen(false);
      await loadGrids();
    } else {
      toast.error(NOTIFICATIONS.GRID_DELETE_ERROR);
    }
  };

  if (loadingGrids) {
    return <div className={styles.container}><p>Carregando...</p></div>;
  }

  if (!loadError && !configValues) {
    return <div className={styles.container}><p>Nenhuma grade encontrada. Crie uma nova grade.</p></div>;
  }

  if (loadError) {
    return null;
  }

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
                  onClick={openModal(setConfigModalOpen)}
                >
                  <GridResizeIcon />
                </Button>
              </li>
              <li>
                <Button
                  title="Mudar cor da grade"
                  variant="menu"
                  iconOnly
                  onClick={openModal(setColorModalOpen)}
                >
                  <GridChangeColorIcon />
                </Button>
              </li>
              <li>
                <Button
                  title="Desativar grade"
                  variant="menu"
                  iconOnly
                  active={!configValues!.SHOW_GRID}
                  onClick={() => {
                    const newShowGrid = !configValues!.SHOW_GRID;
                    handleConfigChange("SHOW_GRID", newShowGrid);
                    saveToApiConfig({ showGrid: newShowGrid });
                  }}
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
            {gridList.map((grid) => (
              <div
                key={grid.id}
                className={`${styles.carouselItem} ${
                  selectedGridId === grid.id ? styles.selected : ""
                }`}
                onClick={() => handleSelectBackground(grid)}
              >
                <img src={grid.imageBackgroundUrl || noImage} alt={grid.name} />
              </div>
            ))}
            <div
              className={styles.carouselItemAdd}
              onClick={openCreateModal}
            >
              <PlusIcon />
            </div>
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
            disabled={!selectedBackgroundUrl}
            active={configValues!.TRANSPARENT_BACKGROUND}
            onClick={() => {
              const newValue = !configValues!.TRANSPARENT_BACKGROUND;
              handleConfigChange("TRANSPARENT_BACKGROUND", newValue);
              saveToApiConfig({ showBackgroundImage: newValue });
            }}
          >
            <ImageIcon />
          </Button>
        </div>
        <div className={styles.gridActions}>
          {selectedGridId && (
            <>
              <Button
                title="Visualizar detalhes"
                variant="menu"
                iconOnly
                onClick={() => {
                  const grid = gridList.find((g) => g.id === selectedGridId);
                  if (grid) openViewModal(grid);
                }}
              >
                <EyeIcon />
              </Button>
              <Button
                title="Excluir grade"
                variant="menu"
                iconOnly
                onClick={() => setDeleteDialogOpen(true)}
              >
                <TrashIcon />
              </Button>
            </>
          )}
        </div>
      </div>

      <GridMap config={configValues} backgroundImage={selectedBackgroundUrl || undefined} tokens={tokens} onTokensChange={setTokens} />

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
        toggleModal={(open) => { if (!open) setDraftValues(null); setConfigModalOpen(open); }}
        closeOnOutsideClick={false}
        draggable={true}
        title="Configurar Grade"
      >
        <div className={styles.modalContainer}>
          <div>
            <label className={styles.modalLabel}>Largura da Grade:</label>
            <input
              type="number"
              value={draftValues?.GRID_CELLS_WIDTH ?? configValues.GRID_CELLS_WIDTH}
              onChange={(e) =>
                handleDraftChange(
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
              value={draftValues?.GRID_CELLS_HEIGHT ?? configValues.GRID_CELLS_HEIGHT}
              onChange={(e) =>
                handleDraftChange(
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
              onClick={closeModal(setConfigModalOpen)}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button onClick={saveDraft(setConfigModalOpen)} variant="primary">
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
        toggleModal={(open) => { if (!open) setDraftValues(null); setColorModalOpen(open); }}
        closeOnOutsideClick={false}
        draggable={true}
        title="Configurar Cor da Grade"
      >
        <div className={styles.modalContainer}>
          <div>
            <label className={styles.modalLabel}>Cor da Linha:</label>
            <input
              type="color"
              value={draftValues?.GRID_COLOR ?? configValues.GRID_COLOR}
              onChange={(e) => handleDraftChange("GRID_COLOR", e.target.value)}
              className={styles.modalColorPicker}
            />
          </div>
          <div>
            <label className={styles.modalLabel}>Cor de Fundo:</label>
            <input
              type="color"
              value={draftValues?.BACKGROUND_COLOR ?? configValues.BACKGROUND_COLOR}
              onChange={(e) =>
                handleDraftChange("BACKGROUND_COLOR", e.target.value)
              }
              className={styles.modalColorPicker}
            />
          </div>

          <div className={styles.modalButton}>
            <Button
              onClick={closeModal(setColorModalOpen)}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button onClick={saveDraft(setColorModalOpen)} variant="primary">
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

      <Modal
        isOpen={createModalOpen}
        toggleModal={setCreateModalOpen}
        closeOnOutsideClick={true}
        draggable={false}
        title="Nova Grade"
      >
        <div className={styles.modalContainer}>
          <div>
            <label className={styles.modalLabel}>Nome <span style={{color: "red"}}>*</span></label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => { setCreateForm((f) => ({ ...f, name: e.target.value })); setCreateFormError(""); }}
              className={styles.modalImput}
              placeholder="Nome da grade"
            />
            {createFormError && (
              <span style={{ color: "red", fontSize: "12px" }}>{createFormError}</span>
            )}
          </div>
          <div>
            <label className={styles.modalLabel}>URL da Imagem:</label>
            <input
              type="text"
              value={createForm.imageUrl}
              onChange={(e) => setCreateForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className={styles.modalImput}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={styles.modalLabel}>Descrição:</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
              className={styles.modalTextarea}
              placeholder="Descrição opcional..."
              rows={3}
            />
          </div>
          <div className={styles.modalButton}>
            <Button onClick={() => setCreateModalOpen(false)} variant="secondary">
              Cancelar
            </Button>
            <Button onClick={handleCreateGrid} variant="primary">
              Criar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={viewModalOpen}
        toggleModal={setViewModalOpen}
        closeOnOutsideClick={true}
        draggable={false}
        title="Detalhes da Grade"
      >
        {selectedGridDetails && (
          <div className={styles.modalContainer}>
            <div>
              <label className={styles.modalLabel}>Nome:</label>
              <input
                type="text"
                value={selectedGridDetails.name}
                onChange={(e) => setSelectedGridDetails((d) => d ? { ...d, name: e.target.value } : d)}
                className={styles.modalImput}
              />
            </div>
            <div>
              <label className={styles.modalLabel}>URL da Imagem:</label>
              <input
                type="text"
                value={selectedGridDetails.imageUrl}
                onChange={(e) => setSelectedGridDetails((d) => d ? { ...d, imageUrl: e.target.value } : d)}
                className={styles.modalImput}
              />
            </div>
            <div>
              <label className={styles.modalLabel}>Descrição:</label>
              <textarea
                value={selectedGridDetails.description}
                onChange={(e) => setSelectedGridDetails((d) => d ? { ...d, description: e.target.value } : d)}
                className={styles.modalTextarea}
                rows={3}
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label className={styles.modalLabel}>Largura:</label>
                <input
                  type="number"
                  value={selectedGridDetails.width}
                  onChange={(e) => setSelectedGridDetails((d) => d ? { ...d, width: parseInt(e.target.value) || 1 } : d)}
                  className={styles.modalImput}
                  min="1"
                  max="100"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className={styles.modalLabel}>Altura:</label>
                <input
                  type="number"
                  value={selectedGridDetails.height}
                  onChange={(e) => setSelectedGridDetails((d) => d ? { ...d, height: parseInt(e.target.value) || 1 } : d)}
                  className={styles.modalImput}
                  min="1"
                  max="100"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label className={styles.modalLabel}>Tamanho da Célula:</label>
                <input
                  type="number"
                  value={selectedGridDetails.cellSize}
                  onChange={(e) => setSelectedGridDetails((d) => d ? { ...d, cellSize: parseInt(e.target.value) || 8 } : d)}
                  className={styles.modalImput}
                  min="8"
                  max="128"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label className={styles.modalLabel}>Cor da Linha:</label>
                <input
                  type="color"
                  value={selectedGridDetails.lineColor}
                  onChange={(e) => setSelectedGridDetails((d) => d ? { ...d, lineColor: e.target.value } : d)}
                  className={styles.modalColorPicker}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className={styles.modalLabel}>Cor de Fundo:</label>
                <input
                  type="color"
                  value={selectedGridDetails.backgroundColor}
                  onChange={(e) => setSelectedGridDetails((d) => d ? { ...d, backgroundColor: e.target.value } : d)}
                  className={styles.modalColorPicker}
                />
              </div>
            </div>
            <div className={styles.modalButton}>
              <Button onClick={() => setViewModalOpen(false)} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={handleSaveViewModal} variant="primary">
                Salvar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteGrid}
        title="Excluir Grade"
        message="Tem certeza que deseja excluir esta grade? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
