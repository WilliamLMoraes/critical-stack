export const DEFAULT_GRID_CONFIG = {
  GRID_CELLS_WIDTH: 20,
  GRID_CELLS_HEIGHT: 20,
  CELL_SIZE: 32,
  SHOW_GRID: true,
  BACKGROUND_COLOR: "0xe9ecef",
  GRID_COLOR: "0xadb5bd",
  TRANSPARENT_BACKGROUND: false,
};

export const saveGridConfig = (config: typeof DEFAULT_GRID_CONFIG) => {
  localStorage.setItem("gridConfig", JSON.stringify(config));
};

export const loadGridConfig = (): typeof DEFAULT_GRID_CONFIG => {
  const saved = localStorage.getItem("gridConfig");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_GRID_CONFIG;
    }
  }
  return DEFAULT_GRID_CONFIG;
};
