import React, { useRef, useState } from 'react';
import { InputVector } from '../game/engine/InputManager';

interface TouchJoystickProps {
  onMove: (vec: InputVector) => void;
}

export default function TouchJoystick({ onMove }: TouchJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const radius = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setActive(true);
    updateJoystick(e.touches[0]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!active) return;
    updateJoystick(e.touches[0]);
  };

  const handleTouchEnd = () => {
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  const updateJoystick = (touch: React.Touch) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    const clampedDist = Math.min(dist, radius);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });

    // Normalized vector (-1 to 1)
    const normX = dx / radius;
    const normY = dy / radius;
    const len = Math.hypot(normX, normY);

    if (len > 0.1) {
      onMove({ x: Math.min(1, Math.max(-1, normX)), y: Math.min(1, Math.max(-1, normY)) });
    } else {
      onMove({ x: 0, y: 0 });
    }
  };

  return (
    <div style={wrapperStyle}>
      <div
        ref={containerRef}
        style={baseStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div
          style={{
            ...knobStyle,
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        >
          🕹️
        </div>
      </div>
    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '2rem',
  left: '2rem',
  zIndex: 900,
  touchAction: 'none',
};

const baseStyle: React.CSSProperties = {
  width: '100px',
  height: '100px',
  background: 'linear-gradient(180deg, var(--wall-mid), var(--bg-deep))',
  border: '2px solid var(--accent-teal)',
  boxShadow: '3px 3px 0 #000',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
};

const knobStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  backgroundColor: 'var(--accent-pink)',
  border: '2px solid var(--accent-gold)',
  boxShadow: '2px 2px 0 #000',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
  fontSize: '18px',
  transition: 'transform 0.05s linear',
};
