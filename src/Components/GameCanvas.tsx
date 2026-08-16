import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/engine/GameEngine';

interface GameCanvasProps {
  onProgress: (progress: number) => void;
  onHotspotTrigger: (id: string) => void;
  onHotspotNear: (spotName: string | null) => void;
  gameEngineRef: React.MutableRefObject<GameEngine | null>;
}

export default function GameCanvas({
  onProgress,
  onHotspotTrigger,
  onHotspotNear,
  gameEngineRef,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let engine: GameEngine | null = new GameEngine();
    gameEngineRef.current = engine;

    engine.init(containerRef.current, onProgress, onHotspotTrigger, onHotspotNear);

    return () => {
      if (engine) {
        engine.destroy();
        engine = null;
      }
      gameEngineRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        overflow: 'hidden',
      }}
    />
  );
}
