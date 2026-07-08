import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import GridMap from "../../components/grid-map";
import Modal from "../../components/modal";
import ConfirmDialog from "../../components/confirm-dialog";
import Button from "../../components/button";
import styles from "./style.module.css";
import noImage from "../../../assets/images/grid-backgrounds/no-image.png";
import {
  BackgroundIcon,
  ChevronIcon,
  GridChangeColorIcon,
  GridOffIcon,
  GridResizeIcon,
  ImageIcon,
  PersonGroupIcon,
  EyeIcon,
  EditIcon,
  PlusIcon,
  FolderIcon,
} from "../../icons";
import type { GridConfig } from "../../components/grid-map";
import { useApi } from "../../../hooks/use-api";
import { NOTIFICATIONS, ROUTES } from "../../../config";
import toast from "react-hot-toast";
import type CampaignSearchResponse from "../../../types/responses/campaign-search";
import type CampaignFolderListResponse from "../../../types/responses/campaign-folder-list-item";
import type CampaignFolderResponse from "../../../types/responses/campaign-folder";
import type CampaignGridListItemResponse from "../../../types/responses/campaign-grid-list-item";
import type CampaignGridResponse from "../../../types/responses/campaign-grid";

interface Token {
  id: string;
  image: string;
  x: number;
  y: number;
}

export default function GridMapPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const {
    search,
    getFolder,
    getCampaignGridById,
    createCampaignGrid,
    updateCampaignGrid,
    deleteCampaignGrid,
    createFolder,
    updateFolder,
    deleteFolder,
  } = useApi();

  const carouselRef = useRef<HTMLDivElement>(null);

  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [tokensModalOpen, setTokensModalOpen] = useState(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [renameFolderModalOpen, setRenameFolderModalOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [createGridModalOpen, setCreateGridModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedFolder, setSelectedFolder] =
    useState<CampaignFolderResponse | null>(null);
  const [selectedGrid, setSelectedGrid] =
    useState<CampaignGridResponse | null>(null);

  const [tokens, setTokens] = useState<Token[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [folderToEdit, setFolderToEdit] =
    useState<CampaignFolderListResponse | null>(null);

  const [searchResult, setSearchResult] =
    useState<CampaignSearchResponse | null>(null);

  const [collapsedFolders, setCollapsedFolders] = useState<Set<number>>(new Set());

  const toggleCollapse = (folderId: number) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);

      if (next.has(folderId)) {
        next.delete(folderId);

      } else {
        next.add(folderId);

      }

      return next;
    });
  };

  const gridConfig = useMemo((): GridConfig | null => {
    if (!selectedGrid) return null;
    return {
      GRID_CELLS_WIDTH: selectedGrid.width,
      GRID_CELLS_HEIGHT: selectedGrid.height,
      CELL_SIZE: selectedGrid.cellSize,
      SHOW_GRID: selectedGrid.showGrid,
      GRID_COLOR: selectedGrid.lineColor,
      BACKGROUND_COLOR: selectedGrid.backgroundColor,
      TRANSPARENT_BACKGROUND: selectedGrid.showBackgroundImage,
    };
  }, [selectedGrid]);

  const selectGrid = async (gridId: number) => {
    if (!campaignId) return;

    const grid = await getCampaignGridById(Number(campaignId), gridId);
    if (!grid) return;

    setSelectedGrid(grid);
  };

  const selectFolder = async (folderId: number) => {
    if (!campaignId) return;
    if (selectedFolder?.id === folderId) return;

    const folder = await getFolder(Number(campaignId), folderId);

    if (folder) {
      setSelectedFolder(folder);

      if (!selectedGrid && folder.grids && folder.grids.length > 0) {
        await selectGrid(folder.grids[0].id);
      }
    }
  };

  const handleSelectGrid = async (grid: CampaignGridListItemResponse) => {
    if (grid.id === selectedGrid?.id) return;

    await selectGrid(grid.id);
  };

  const saveSelectedGrid = async (grid: CampaignGridResponse) => {
    if (!campaignId) return;

    const success = await updateCampaignGrid(Number(campaignId), grid.id, {
      name: grid.name,
      width: grid.width,
      height: grid.height,
      cellSize: grid.cellSize,
      lineColor: grid.lineColor,
      backgroundColor: grid.backgroundColor,
      showGrid: grid.showGrid,
      imageBackgroundUrl: grid.imageBackgroundUrl,
      showBackgroundImage: grid.showBackgroundImage,
      description: grid.description ?? undefined,
    });

    if (success) {
      toast.success(NOTIFICATIONS.GRID_SAVED);
    } else {
      toast.error(NOTIFICATIONS.GRID_ERROR);
    }
  };

  const loadSearch = useCallback(async () => {
    if (!campaignId) return;

    setLoadingData(true);
    const result = await search(Number(campaignId), searchQuery || undefined);

    if (!result) {
      setLoadError(true);
      setLoadingData(false);
      toast.error("Erro de conexão com o servidor.");
      navigate(ROUTES.HOME, { replace: true });
      return;
    }

    setSearchResult(result);
    setLoadError(false);

    const root = result.folders.find((f) => f.parentId === null);
    if (root && !selectedFolder) {
      await selectFolder(root.id);
    }

    setLoadingData(false);
  }, [campaignId, searchQuery]);

  useEffect(() => {
    if (!campaignId) return;

    loadSearch();
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) return;

    const timer = setTimeout(() => loadSearch(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCreateGrid = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!campaignId) return;

    const data = new FormData(e.currentTarget);
    const imageUrl = (data.get("imageUrl") as string) || "";
    const success = await createCampaignGrid(Number(campaignId), {
      name: data.get("name") as string,
      width: 20,
      height: 20,
      cellSize: 32,
      lineColor: "#cccccc",
      backgroundColor: "#1a1a1a",
      showGrid: true,
      imageBackgroundUrl: imageUrl || null,
      description: (data.get("description") as string) || undefined,
      showBackgroundImage: !!imageUrl,
      folderId: data.get("folderId")
        ? parseInt(data.get("folderId") as string)
        : null,
    });
    if (success) {
      toast.success(NOTIFICATIONS.GRID_CREATED);
      setCreateGridModalOpen(false);

      if (selectedFolder) await selectFolder(selectedFolder.id);

      await loadSearch();
    } else {
      toast.error(NOTIFICATIONS.GRID_ERROR);
    }
  };

  const handleSaveViewModal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGrid || !campaignId) return;

    const data = new FormData(e.currentTarget);
    const updated: CampaignGridResponse = {
      ...selectedGrid,
      name: data.get("name") as string,
      width: parseInt(data.get("width") as string) || 1,
      height: parseInt(data.get("height") as string) || 1,
      cellSize: parseInt(data.get("cellSize") as string) || 8,
      lineColor: data.get("lineColor") as string,
      backgroundColor: data.get("bgColor") as string,
      showGrid: data.get("showGrid") === "on",
      imageBackgroundUrl: (data.get("imageUrl") as string) || null,
      description: (data.get("description") as string) || null,
    };

    const success = await updateCampaignGrid(
      Number(campaignId),
      selectedGrid.id,
      {
        name: updated.name,
        width: updated.width,
        height: updated.height,
        cellSize: updated.cellSize,
        lineColor: updated.lineColor,
        backgroundColor: updated.backgroundColor,
        showGrid: updated.showGrid,
        imageBackgroundUrl: updated.imageBackgroundUrl,
        showBackgroundImage: updated.showBackgroundImage,
        description: updated.description ?? undefined,
      },
    );

    if (success) {
      toast.success(NOTIFICATIONS.GRID_SAVED);
      setViewModalOpen(false);
      setSelectedGrid(updated);

      if (selectedFolder) await selectFolder(selectedFolder.id);
      await loadSearch();
    } else {
      toast.error(NOTIFICATIONS.GRID_ERROR);
    }
  };

  const handleDeleteGrid = async () => {
    if (!selectedGrid || !campaignId) return;

    const { success, error } = await deleteCampaignGrid(
      Number(campaignId),
      selectedGrid.id,
    );
    if (success) {
      toast.success(NOTIFICATIONS.GRID_DELETED);
      setDeleteDialogOpen(false);

      if (selectedFolder) await selectFolder(selectedFolder.id);
      await loadSearch();
    } else if (error) {
      toast.error(error);
    } else {
      toast.error(NOTIFICATIONS.GRID_DELETE_ERROR);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!campaignId) return;

    const data = new FormData(e.currentTarget);

    const result = await createFolder(Number(campaignId), {
      name: data.get("name") as string,
      parentId: data.get("parentId")
        ? parseInt(data.get("parentId") as string)
        : null,
    });

    if (result) {
      toast.success(NOTIFICATIONS.FOLDER_CREATED);
      setCreateFolderModalOpen(false);
      await loadSearch();
    } else {
      toast.error(NOTIFICATIONS.FOLDER_ERROR);
    }
  };

  const openRenameFolderModal = (folder: CampaignFolderListResponse) => {
    setFolderToEdit(folder);
    setRenameFolderModalOpen(true);
  };

  const handleRenameFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!campaignId || !folderToEdit) return;

    const data = new FormData(e.currentTarget);

    const result = await updateFolder(Number(campaignId), folderToEdit.id, {
      name: data.get("name") as string,
      parentId: data.get("parentId")
        ? parseInt(data.get("parentId") as string)
        : null,
    });

    if (result) {
      toast.success(NOTIFICATIONS.FOLDER_UPDATED);
      setRenameFolderModalOpen(false);
      setFolderToEdit(null);

      if (selectedFolder) await selectFolder(selectedFolder.id);
      await loadSearch();

    } else {
      toast.error(NOTIFICATIONS.FOLDER_ERROR);
    }
  };

  const openDeleteFolderDialog = (folder: CampaignFolderListResponse) => {
    setFolderToEdit(folder);
    setDeleteFolderDialogOpen(true);
  };

  const handleDeleteFolder = async () => {
    if (!campaignId || !folderToEdit) return;

    const rootFolder = searchResult?.folders.find((f) => f.parentId === null);

    const success = await deleteFolder(Number(campaignId), folderToEdit.id);
    
    if (success) {
      toast.success(NOTIFICATIONS.FOLDER_DELETED);
      setDeleteFolderDialogOpen(false);
      setFolderToEdit(null);

      if (rootFolder) {
        await selectFolder(rootFolder.id);

      } else {
        setSelectedFolder(null);
      }
      await loadSearch();

    } else {
      toast.error(NOTIFICATIONS.FOLDER_ERROR);
    }
  };

  const rootFolder = searchResult?.folders.find((f) => f.parentId === null);

  const renderFolderItem = (
    folder: CampaignFolderListResponse,
    depth: number,
    allFolders: CampaignFolderListResponse[],
  ) => {
    const children = allFolders.filter((f) => f.parentId === folder.id);
    const isSelected = selectedFolder?.id === folder.id;
    const isCollapsed = collapsedFolders.has(folder.id);

    return (
      <div key={folder.id}>
        <div
          className={`${styles.folderItemRow} ${isSelected ? styles.selected : ""}`}
          style={{ paddingLeft: `${16 + depth * 16}px` }}
          onClick={() => selectFolder(folder.id)}
        >
          <div className={styles.folderLabel}>
            <span className={styles.folderIcon}>
              {isSelected ? <FolderIcon /> : <FolderIcon />}
            </span>
            <span className={styles.folderName}>{folder.name}</span>
            <span className={styles.folderCount}>({folder.gridCount})</span>
          </div>
          <div className={styles.folderActions}>
            <button
              className={styles.folderActionBtn}
              title="Abrir menu"
              onClick={async (e) => {
                e.stopPropagation();
                await selectFolder(folder.id);
                setTopMenuOpen(true);
              }}
            >
              <EyeIcon />
            </button>
          </div>
          {children.length > 0 && (
            <button
              className={styles.folderChevron}
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(folder.id);
              }}
            >
              <ChevronIcon
                className={isCollapsed ? styles.chevronCollapsed : styles.chevronExpanded}
              />
            </button>
          )}
        </div>
        {!isCollapsed &&
          children.map((child) =>
            renderFolderItem(child, depth + 1, allFolders),
          )}
      </div>
    );
  };

  if (loadingData) {
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (loadError) {
    return null;
  }

  if (!rootFolder && !loadingData) {
    return (
      <div className={styles.container}>
        <p>Nenhuma pasta encontrada.</p>
      </div>
    );
  }

  return (
    <div>
      <div className={`${styles.sidebar} ${sideMenuOpen ? styles.open : ""}`}>
        <div className={styles.menuHeader}>
          <h3>Pastas</h3>
          <button
            className={styles.closeButton}
            onClick={() => setSideMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar pastas e grids..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedFolder(null);
            }}
          />
        </div>

        <div className={styles.folderTree}>
          {searchResult?.folders
            .filter((f) => f.parentId === null)
            .map((root) => renderFolderItem(root, 0, searchResult.folders))}
        </div>

        <button
          className={styles.createFolderBtn}
          onClick={() => setCreateFolderModalOpen(true)}
        >
          <PlusIcon /> Nova Pasta
        </button>

        <div className={styles.menuItems}>
          <div className={styles.menuItem}>
            <h4>Ferramentas</h4>
            <ul>
              <li>
                <Button
                  title="Mudar tamanho da grade"
                  variant="menu"
                  iconOnly
                  onClick={() => setConfigModalOpen(true)}
                  disabled={!selectedGrid}
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
                  disabled={!selectedGrid}
                >
                  <GridChangeColorIcon />
                </Button>
              </li>
              <li>
                <Button
                  title="Desativar grade"
                  variant="menu"
                  iconOnly
                  active={selectedGrid ? !selectedGrid.showGrid : false}
                  disabled={!selectedGrid}
                  onClick={() => {
                    if (!selectedGrid) return;
                    const updated = { ...selectedGrid, showGrid: !selectedGrid.showGrid };
                    setSelectedGrid(updated);
                    saveSelectedGrid(updated);
                  }}
                >
                  <GridOffIcon />
                </Button>
              </li>
              <li>
                <Button
                  title="Exibir imagem"
                  variant="menu"
                  iconOnly
                  disabled={!selectedGrid?.imageBackgroundUrl}
                  active={selectedGrid ? selectedGrid.showBackgroundImage : false}
                  onClick={() => {
                    if (!selectedGrid) return;
                    const updated = { ...selectedGrid, showBackgroundImage: !selectedGrid.showBackgroundImage };
                    setSelectedGrid(updated);
                    saveSelectedGrid(updated);
                  }}
                >
                  <ImageIcon />
                </Button>
              </li>
            </ul>
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
        </div>
      </div>

      <div className={`${styles.topbar} ${topMenuOpen ? styles.open : ""}`}>
        <div className={styles.folderTitle}>
          {selectedFolder?.name || "Nenhuma pasta selecionada"}
        </div>

        <div className={styles.carouselContainer}>
          <button
            className={styles.carouselButton}
            onClick={() => scrollCarousel("left")}
          >
            ‹
          </button>
          <div className={styles.carousel} ref={carouselRef}>
            {!selectedFolder || !selectedFolder.grids || selectedFolder.grids.length === 0 ? (
              <div className={styles.emptyFolder}>
                Pasta vazia. Crie uma nova grade.
              </div>
            ) : (
              selectedFolder.grids.map((grid) => (
                <div
                  key={grid.id}
                  className={`${styles.carouselItem} ${
                    selectedGrid?.id === grid.id ? styles.selected : ""
                  }`}
                  onClick={() => handleSelectGrid(grid)}
                >
                  <img
                    src={grid.imageBackgroundUrl || noImage}
                    alt={grid.name}
                  />
                  <span className={styles.carouselItemName}>{grid.name}</span>
                  <button
                    className={styles.carouselItemEdit}
                    title="Editar grade"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (selectedGrid?.id !== grid.id) {
                        await selectGrid(grid.id);
                      }
                      setViewModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </button>
                </div>
              ))
            )}
            <div
              className={styles.carouselItemAdd}
              onClick={() => setCreateGridModalOpen(true)}
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

        <div className={styles.gridActions}>
          {selectedFolder && (
            <Button
              title="Editar pasta"
              variant="menu"
              iconOnly
              onClick={() => openRenameFolderModal(selectedFolder)}
            >
              <EditIcon />
            </Button>
          )}
        </div>
      </div>

      {gridConfig ? (
        <GridMap
          config={gridConfig}
          backgroundImage={selectedGrid?.imageBackgroundUrl || undefined}
          tokens={tokens}
          onTokensChange={setTokens}
        />
      ) : (
        <div className={styles.container}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              color: "#666",
            }}
          >
            {selectedFolder
              ? selectedFolder.grids && selectedFolder.grids.length > 0
                ? "Selecione uma grade no carrossel acima."
                : "Nenhuma grade nesta pasta. Crie uma nova grade."
              : "Selecione uma pasta para começar."}
          </div>
        </div>
      )}

      <button
        className={styles.sideBarButton}
        onClick={() => setSideMenuOpen(!sideMenuOpen)}
        style={{ left: sideMenuOpen ? "260px" : "0" }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <button
        className={styles.topBarButton}
        onClick={() => setTopMenuOpen(!topMenuOpen)}
        style={{ top: topMenuOpen ? "150px" : "0" }}
      >
        <BackgroundIcon color="white" fontSize="large" />
      </button>

      <Modal
        isOpen={configModalOpen}
        toggleModal={setConfigModalOpen}
        closeOnOutsideClick={false}
        draggable={true}
        title="Configurar Grade"
      >
        <div className={styles.modalContainer}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedGrid || !campaignId) return;
              const data = new FormData(e.currentTarget);
              const updated: CampaignGridResponse = {
                ...selectedGrid,
                width: parseInt(data.get("width") as string) || 1,
                height: parseInt(data.get("height") as string) || 1,
              };
              setSelectedGrid(updated);
              setConfigModalOpen(false);
              saveSelectedGrid(updated);
            }}
          >
            <div>
              <label className={styles.modalLabel}>Largura da Grade:</label>
              <input
                type="number"
                name="width"
                className={styles.modalInput}
                defaultValue={selectedGrid?.width ?? 20}
                min="1"
                max="50"
              />
            </div>
            <div>
              <label className={styles.modalLabel}>Altura da Grade:</label>
              <input
                type="number"
                name="height"
                className={styles.modalInput}
                defaultValue={selectedGrid?.height ?? 20}
                min="1"
                max="50"
              />
            </div>
            <div className={styles.modalButton}>
              <Button
                onClick={() => setConfigModalOpen(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Salvar
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={colorModalOpen}
        toggleModal={setColorModalOpen}
        closeOnOutsideClick={false}
        draggable={true}
        title="Configurar Cor da Grade"
      >
        <div className={styles.modalContainer}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedGrid || !campaignId) return;
              const data = new FormData(e.currentTarget);
              const updated: CampaignGridResponse = {
                ...selectedGrid,
                lineColor: data.get("lineColor") as string,
                backgroundColor: data.get("bgColor") as string,
              };
              setSelectedGrid(updated);
              setColorModalOpen(false);
              saveSelectedGrid(updated);
            }}
          >
            <div>
              <label className={styles.modalLabel}>Cor da Linha:</label>
              <input
                type="color"
                name="lineColor"
                className={styles.modalColorPicker}
                defaultValue={selectedGrid?.lineColor ?? "#cccccc"}
              />
            </div>
            <div>
              <label className={styles.modalLabel}>Cor de Fundo:</label>
              <input
                type="color"
                name="bgColor"
                className={styles.modalColorPicker}
                defaultValue={selectedGrid?.backgroundColor ?? "#1a1a1a"}
              />
            </div>
            <div className={styles.modalButton}>
              <Button
                onClick={() => setColorModalOpen(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Salvar
              </Button>
            </div>
          </form>
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
        isOpen={createGridModalOpen}
        toggleModal={setCreateGridModalOpen}
        closeOnOutsideClick={true}
        draggable={false}
        title="Nova Grade"
      >
        <div className={styles.modalContainer}>
          <form onSubmit={(e) => handleCreateGrid(e)}>
            <div>
              <label className={styles.modalLabel}>
                Nome <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                required
                name="name"
                className={styles.modalInput}
                placeholder="Nome da grade"
              />
            </div>
            <div>
              <label className={styles.modalLabel}>Pasta</label>
              <select
                name="folderId"
                className={styles.modalSelect}
                defaultValue={selectedFolder?.id ?? ""}
              >
                {searchResult?.folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {"—".repeat(depthOf(f.id, searchResult.folders))} {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.modalLabel}>URL da Imagem:</label>
              <input
                type="text"
                name="imageUrl"
                className={styles.modalInput}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={styles.modalLabel}>Descrição:</label>
              <textarea
                name="description"
                className={styles.modalTextarea}
                placeholder="Descrição opcional..."
                rows={3}
              />
            </div>
            <div className={styles.modalButton}>
              <Button
                onClick={() => setCreateGridModalOpen(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Criar
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={viewModalOpen}
        toggleModal={setViewModalOpen}
        closeOnOutsideClick={true}
        draggable={false}
        title="Detalhes da Grade"
      >
        {selectedGrid && (
          <div className={styles.modalContainer}>
            <form onSubmit={(e) => handleSaveViewModal(e)}>
              <div>
                <label className={styles.modalLabel}>Nome:</label>
                <input
                  type="text"
                  name="name"
                  className={styles.modalInput}
                  defaultValue={selectedGrid.name}
                />
              </div>
              <div>
                <label className={styles.modalLabel}>URL da Imagem:</label>
                <input
                  type="text"
                  name="imageUrl"
                  className={styles.modalInput}
                  defaultValue={selectedGrid.imageBackgroundUrl ?? ""}
                />
              </div>
              <div>
                <label className={styles.modalLabel}>Descrição:</label>
                <textarea
                  name="description"
                  className={styles.modalTextarea}
                  defaultValue={selectedGrid.description ?? ""}
                  rows={3}
                />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label className={styles.modalLabel}>Largura:</label>
                  <input
                    type="number"
                    name="width"
                    className={styles.modalInput}
                    defaultValue={selectedGrid.width}
                    min="1"
                    max="100"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.modalLabel}>Altura:</label>
                  <input
                    type="number"
                    name="height"
                    className={styles.modalInput}
                    defaultValue={selectedGrid.height}
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label className={styles.modalLabel}>
                    Tamanho da Célula:
                  </label>
                  <input
                    type="number"
                    name="cellSize"
                    className={styles.modalInput}
                    defaultValue={selectedGrid.cellSize}
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
                    name="lineColor"
                    className={styles.modalColorPicker}
                    defaultValue={selectedGrid.lineColor}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.modalLabel}>Cor de Fundo:</label>
                  <input
                    type="color"
                    name="bgColor"
                    className={styles.modalColorPicker}
                    defaultValue={selectedGrid.backgroundColor}
                  />
                </div>
              </div>
              <div className={styles.modalButton}>
                <Button
                  onClick={() => {
                    setViewModalOpen(false);
                    setDeleteDialogOpen(true);
                  }}
                  variant="secondary"
                >
                  Excluir
                </Button>
                <Button
                  onClick={() => setViewModalOpen(false)}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={createFolderModalOpen}
        toggleModal={setCreateFolderModalOpen}
        closeOnOutsideClick={true}
        draggable={false}
        title="Nova Pasta"
      >
        <div className={styles.modalContainer}>
          <form onSubmit={(e) => handleCreateFolder(e)}>
            <div>
              <label className={styles.modalLabel}>
                Nome <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                required
                name="name"
                className={styles.modalInput}
                placeholder="Nome da pasta"
                autoFocus
              />
            </div>
            <div>
              <label className={styles.modalLabel}>Pasta pai</label>
              <select
                name="parentId"
                className={styles.modalSelect}
                defaultValue={selectedFolder?.id ?? ""}
              >
                <option value="">(Raiz)</option>
                {searchResult?.folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.modalButton}>
              <Button
                onClick={() => setCreateFolderModalOpen(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Criar
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={renameFolderModalOpen}
        toggleModal={setRenameFolderModalOpen}
        closeOnOutsideClick={true}
        draggable={false}
        title="Renomear Pasta"
      >
        <div className={styles.modalContainer}>
          <form onSubmit={(e) => handleRenameFolder(e)}>
            <div>
              <label className={styles.modalLabel}>
                Nome <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                required
                name="name"
                className={styles.modalInput}
                defaultValue={folderToEdit?.name ?? ""}
                placeholder="Nome da pasta"
                autoFocus
              />
            </div>
            <div>
              <label className={styles.modalLabel}>Mover para pasta</label>
              <select
                name="parentId"
                className={styles.modalSelect}
                defaultValue={folderToEdit?.parentId ?? ""}
              >
                <option value="">(Raiz)</option>
                {searchResult?.folders
                  .filter((f) => f.id !== folderToEdit?.id)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.modalButton}>
              <Button
                onClick={() => {
                  setRenameFolderModalOpen(false);
                  openDeleteFolderDialog(folderToEdit!);
                }}
                variant="secondary"
              >
                Excluir
              </Button>
              <Button
                onClick={() => setRenameFolderModalOpen(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Salvar
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteFolderDialogOpen}
        onClose={() => setDeleteFolderDialogOpen(false)}
        onConfirm={handleDeleteFolder}
        title="Excluir Pasta"
        message={
          folderToEdit
            ? `Tem certeza que deseja excluir "${folderToEdit.name}"? Todas as grades e subpastas dentro dela também serão excluídas.`
            : "Tem certeza que deseja excluir esta pasta?"
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
      />

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

function depthOf(
  folderId: number,
  folders: CampaignFolderListResponse[],
): number {
  let depth = 0;
  let current = folders.find((f) => f.id === folderId);

  while (current && current.parentId !== null) {
    depth++;
    current = folders.find((f) => f.id === current!.parentId);
  }
  return depth;
}
