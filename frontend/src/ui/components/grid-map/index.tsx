import { useRef, useEffect, useState, useCallback } from "react";
import { Application, extend } from "@pixi/react";
import {
  Graphics,
  Container,
  FederatedPointerEvent,
  type PointData,
  Sprite,
  Texture,
  Assets,
} from "pixi.js";
import { useGridConfig } from "../../../contexts/grid-config-context";
import styles from "./style.module.css";

extend({ Container, Graphics, Sprite, Texture });

interface Token {
  id: string;
  image: string;
  x: number;
  y: number;
}

interface GridMapProps {
  backgroundImage?: string;
  tokens?: Token[];
  onTokensChange?: (tokens: Token[]) => void;
}

export default function GridMap({ backgroundImage, tokens = [], onTokensChange }: GridMapProps) {
  const { config } = useGridConfig();
  const mapRef = useRef<Graphics>(null);

  const initialPosition: PointData = {
    x: (window.innerWidth - config.GRID_CELLS_WIDTH * config.CELL_SIZE) / 2,
    y: (window.innerHeight - config.GRID_CELLS_HEIGHT * config.CELL_SIZE) / 2,
  };

  const [position, setPosition] = useState<PointData>({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<PointData>({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [bgTexture, setBgTexture] = useState<Texture | null>(null);
  const [tokenTextures, setTokenTextures] = useState<Record<string, Texture>>({});
  const [draggingToken, setDraggingToken] = useState<string | null>(null);
  const [tokenDragStart, setTokenDragStart] = useState<PointData>({ x: 0, y: 0 });

  useEffect(() => {
    if (backgroundImage) {
      const loadTexture = async () => {
        const texture = await Assets.load(backgroundImage);
        setBgTexture(texture);
      };
      loadTexture();
    }
  }, [backgroundImage]);

  useEffect(() => {
    const loadTokenTextures = async () => {
      const textures: Record<string, Texture> = {};
      for (const token of tokens) {
        if (!tokenTextures[token.id]) {
          textures[token.id] = await Assets.load(token.image);
        }
      }
      if (Object.keys(textures).length > 0) {
        setTokenTextures((prev) => ({ ...prev, ...textures }));
      }
    };
    loadTokenTextures();
  }, [tokens]);

  useEffect(() => {
    if (!mapRef.current) return;

    drawMap(mapRef.current, bgTexture, config);
  }, [config]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(5, scale * zoomFactor));

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const worldX = (mouseX - position.x) / scale;
      const worldY = (mouseY - position.y) / scale;

      const newX = mouseX - worldX * newScale;
      const newY = mouseY - worldY * newScale;

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    },
    [scale, position],
  );

  const onDown = useCallback(
    (e: FederatedPointerEvent) => {
      if (e.button !== 1) return;
      
      setDragging(true);

      setDragStart({
        x: e.global.x - position.x,
        y: e.global.y - position.y,
      });
    },
    [position],
  );

  const onMove = useCallback(
    (e: FederatedPointerEvent) => {
      if (!dragging) return;

      setPosition({
        x: e.global.x - dragStart.x,
        y: e.global.y - dragStart.y,
      });
    },
    [dragging, dragStart],
  );

  const onUp = useCallback((e?: FederatedPointerEvent) => {
    if (e && e.button !== 1) return;
    setDragging(false);
  }, []);

  const onTokenDown = useCallback(
    (e: FederatedPointerEvent, tokenId: string) => {
      if (e.button !== 0) return;
      
      e.stopPropagation();
      e.preventDefault();
      setDraggingToken(tokenId);
      const token = tokens.find((t) => t.id === tokenId);
      if (token) {
        setTokenDragStart({
          x: e.global.x - token.x * scale,
          y: e.global.y - token.y * scale,
        });
      }
    },
    [tokens, scale],
  );

  const onTokenMove = useCallback(
    (e: FederatedPointerEvent) => {
      if (!draggingToken || !onTokensChange) return;

      const newX = (e.global.x - tokenDragStart.x) / scale;
      const newY = (e.global.y - tokenDragStart.y) / scale;

      const snappedX = Math.round(newX / config.CELL_SIZE) * config.CELL_SIZE;
      const snappedY = Math.round(newY / config.CELL_SIZE) * config.CELL_SIZE;

      const updatedTokens = tokens.map((t) =>
        t.id === draggingToken ? { ...t, x: snappedX, y: snappedY } : t
      );
      onTokensChange(updatedTokens);
    },
    [draggingToken, tokenDragStart, scale, config.CELL_SIZE, tokens, onTokensChange],
  );

  const onTokenUp = useCallback(() => setDraggingToken(null), []);

  return (
    <div className={styles.gridContainer}>
      <Application
        width={window.innerWidth}
        height={window.innerHeight}
        backgroundColor={0x2a2a2a}
        antialias
      >
        <pixiContainer
          position={position}
          scale={scale}
          eventMode="static"
          interactive
          onWheel={handleWheel}
          onPointerDown={onDown}
          onGlobalPointerMove={onMove}
          onPointerUp={onUp}
          onPointerUpOutside={onUp}
        >
          {bgTexture && (
            <pixiSprite
              texture={bgTexture}
              width={config.GRID_CELLS_WIDTH * config.CELL_SIZE}
              height={config.GRID_CELLS_HEIGHT * config.CELL_SIZE}
              alpha={0.8}
            />
          )}
          <pixiGraphics
            ref={(g) => {
              if (g) {
                mapRef.current = g;
                drawMap(g, bgTexture, config);
              }
            }}
            draw={() => {}}
          />
          {tokens.map((token) => (
            tokenTextures[token.id] && (
              <pixiSprite
                key={token.id}
                texture={tokenTextures[token.id]}
                x={token.x}
                y={token.y}
                width={config.CELL_SIZE}
                height={config.CELL_SIZE}
                eventMode="static"
                interactive
                onPointerDown={(e: FederatedPointerEvent) => onTokenDown(e, token.id)}
                onGlobalPointerMove={onTokenMove}
                onPointerUp={onTokenUp}
                onPointerUpOutside={onTokenUp}
              />
            )
          ))}
        </pixiContainer>
      </Application>
    </div>
  );
}

function drawMap(
  g: Graphics,
  bgTexture: Texture | null,
  config: {
    GRID_CELLS_WIDTH: number;
    GRID_CELLS_HEIGHT: number;
    CELL_SIZE: number;
    SHOW_GRID: boolean;
    BACKGROUND_COLOR: string;
    GRID_COLOR: string;
    TRANSPARENT_BACKGROUND: boolean;
  },
) {
  const gridWidth = config.GRID_CELLS_WIDTH * config.CELL_SIZE;
  const gridHeight = config.GRID_CELLS_HEIGHT * config.CELL_SIZE;

  g.clear();

  if (!config.TRANSPARENT_BACKGROUND || bgTexture === null) {
    for (let y = 0; y < config.GRID_CELLS_HEIGHT; y++) {
      for (let x = 0; x < config.GRID_CELLS_WIDTH; x++) {
        g.setFillStyle({ color: config.BACKGROUND_COLOR });
        g.rect(
          x * config.CELL_SIZE,
          y * config.CELL_SIZE,
          config.CELL_SIZE,
          config.CELL_SIZE,
        );
        g.fill();
      }
    }
  }

  if (!config.SHOW_GRID) return;

  g.setStrokeStyle({ width: 1, color: config.GRID_COLOR });

  for (let x = 0; x <= config.GRID_CELLS_WIDTH; x++) {
    g.moveTo(x * config.CELL_SIZE, 0);
    g.lineTo(x * config.CELL_SIZE, gridHeight);
  }

  for (let y = 0; y <= config.GRID_CELLS_HEIGHT; y++) {
    g.moveTo(0, y * config.CELL_SIZE);
    g.lineTo(gridWidth, y * config.CELL_SIZE);
  }

  g.stroke();
}
