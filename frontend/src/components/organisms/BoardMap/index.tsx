'use client';

import { Box, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState, useCallback } from 'react';
import { TokenAvatar } from '@/components/atoms';
import type P5 from 'p5';
import map from '@/assets/images/map.jpg';
import { Character } from '@/schemas/entities/character';

const MapContainer = styled(Card)(({ theme }) => ({
  padding: 1,
  position: 'relative',
  border: `1px solid ${theme.palette.secondary.main}`,
  borderRadius: 8,
  overflow: 'hidden',
  height: '100%',
  minHeight: 400,
  display: 'flex',
  flexDirection: 'column',
}));

const MapCanvas = styled(Box)({
  position: 'relative',
  flex: 1,
  overflow: 'hidden',
});

const TokensOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  zIndex: 10,
  '& > *': { pointerEvents: 'auto' },
});

interface BoardMapProps {
  players: Character[];
  isMaster?: boolean;
  onTokenMove?: (playerId: string, newPosition: { x: number; y: number }) => void;
}

export const BoardMap = ({ players, isMaster = false, onTokenMove }: BoardMapProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<P5 | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mapSize, setMapSize] = useState({ width: 800, height: 600 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const toRelativePosition = useCallback(
    (pos: { x: number; y: number }) => ({
      x: pos.x / mapSize.width,
      y: pos.y / mapSize.height,
    }),
    [mapSize]
  );

  const toAbsolutePosition = useCallback(
    (rel: { x: number; y: number }) => ({
      x: rel.x * canvasSize.width,
      y: rel.y * canvasSize.height,
    }),
    [canvasSize]
  );

  const cleanupP5 = useCallback(() => {
    if (p5InstanceRef.current) {
      try {
        p5InstanceRef.current.remove();
      } catch {}
      p5InstanceRef.current = null;
    }
  }, []);

  useEffect(() => {
    const loadSketch = async () => {
      cleanupP5();
      if (!sketchRef.current) return;

      const p5 = (await import('p5')).default;
      if (p5InstanceRef.current) return

      const sketch = (p: P5) => {
        let backgroundImg: P5.Image | null = null;
        let isDragging = false;
        let localCanvasSize = { width: 0, height: 0 };

        p.setup = async () => {
          const container = sketchRef.current;
          if (!container) return;

          const rect = container.getBoundingClientRect();

          // Cria o canvas com a largura total do container
          const canvasWidth = Math.max(400, rect.width);
          const canvasHeight = Math.max(300, rect.height);

          setCanvasSize({ width: canvasWidth, height: canvasHeight });
          localCanvasSize = { width: canvasWidth, height: canvasHeight };

          // Carrega a imagem usando async (p5.js 2.0)
          backgroundImg = await new Promise((resolve) => {
            p.loadImage(map.src, (img) => resolve(img));
          });

          const aspect = (backgroundImg?.height || 0) / (backgroundImg?.width || 0);
          const drawWidth = localCanvasSize.width;
          const drawHeight = drawWidth * aspect;
          p.createCanvas(drawWidth, drawHeight).parent(container);
          // Define tamanho do mapa com base na imagem original
          setMapSize({
            width: backgroundImg?.width || 0,
            height: backgroundImg?.height || 0,
          });
        };

        p.draw = () => {
          p.background('#241528');

          p.push();

          if (backgroundImg) {
            const aspect = backgroundImg.height / backgroundImg.width;
            const drawWidth = localCanvasSize.width;
            const drawHeight = drawWidth * aspect;

            p.image(backgroundImg, 0, 0, drawWidth, drawHeight);
          }

          p.pop();
        };

        // Pan
        p.mousePressed = () => {
          if (!isMaster) return;
          isDragging = true;
        };

        p.mouseDragged = () => {
          if (!isMaster || !isDragging) return;
        };

        p.mouseReleased = () => (isDragging = false);
      };

      p5InstanceRef.current = new p5(sketch, sketchRef.current);
    };

    loadSketch();
    return cleanupP5;
  }, []);

  const handleTokenMove = (id: string, pos: { x: number; y: number }) => {
    if (isMaster && onTokenMove) {
      const rel = toRelativePosition(pos);
      onTokenMove(id, { x: rel.x * mapSize.width, y: rel.y * mapSize.height });
    }
  };

  return (
    <MapContainer ref={containerRef}>
      <MapCanvas
        ref={sketchRef}
        as="div"
        sx={{
          backgroundColor: '#241528',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      <TokensOverlay>
        {players.map((p) => {
          const abs = toAbsolutePosition(toRelativePosition(p.character_sheet.position as { x: number; y: number }));
          return (
            <TokenAvatar
              key={p.id}
              src={p.character_sheet.avatar as string}
              alt={p.name}
              size={32}
              status={p.status.hitPoints.current > 0 ? 'alive' : 'dead'}
              isDraggable={isMaster}
              position={{ x: abs.x, y: abs.y }}
              onDrag={(np) => handleTokenMove(p.id, { x: np.x, y: np.y })}
              tooltip={`${p.name} (${p.character_sheet.playerName})`}
            />
          );
        })}
      </TokensOverlay>
    </MapContainer>
  );
};
