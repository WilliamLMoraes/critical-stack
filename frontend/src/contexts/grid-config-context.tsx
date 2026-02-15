import { createContext, useContext, useState, type ReactNode } from "react";
import {
  DEFAULT_GRID_CONFIG as INITIAL_CONFIG,
  saveGridConfig,
  loadGridConfig,
} from "../config";

type GridConfig = typeof INITIAL_CONFIG;

interface GridConfigContextType {
  config: GridConfig;
  updateConfig: (config: Partial<GridConfig>) => void;
  saveConfig: () => void;
  resetConfig: () => void;
}

const GridConfigContext = createContext<GridConfigContextType | undefined>(
  undefined,
);

export function GridConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<GridConfig>(loadGridConfig());

  const updateConfig = (newConfig: Partial<GridConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const saveConfig = () => {
    saveGridConfig(config);
  };

  const resetConfig = () => {
    setConfig(INITIAL_CONFIG);
    saveGridConfig(INITIAL_CONFIG);
  };

  return (
    <GridConfigContext.Provider
      value={{
        config,
        updateConfig,
        saveConfig,
        resetConfig,
      }}
    >
      {children}
    </GridConfigContext.Provider>
  );
}

export function useGridConfig() {
  const context = useContext(GridConfigContext);
  if (context === undefined) {
    throw new Error("useGridConfig must be used within a GridConfigProvider");
  }
  return context;
}
