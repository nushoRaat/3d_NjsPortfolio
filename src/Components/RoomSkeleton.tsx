import React from 'react';

interface RoomSkeletonProps {
  progress: number;
}

export default function RoomSkeleton({ progress }: RoomSkeletonProps) {
  return (
    <div style={skeletonContainerStyle}>
      <div style={contentBoxStyle}>
        <div style={pixelIconStyle}>🎮</div>
        <h2 style={titleStyle}>LOADING PORTFOLIO ROOM...</h2>
        <p style={subtitleStyle}>Initializing PixiJS Engine & Pixel Art Assets</p>

        {/* Pixel Styled Progress Bar */}
        <div style={trackStyle}>
          <div style={{ ...fillStyle, width: `${progress}%` }} />
        </div>
        <div style={progressTextStyle}>{progress}% COMPLETE</div>
      </div>
    </div>
  );
}

const skeletonContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'var(--bg-deep)',
  color: 'var(--parchment)',
  padding: '1.5rem',
  boxSizing: 'border-box',
};

const contentBoxStyle: React.CSSProperties = {
  maxWidth: '440px',
  width: '100%',
  textAlign: 'center',
  background: 'linear-gradient(180deg, var(--wall-mid), var(--bg-deep))',
  border: '3px solid var(--accent-gold)',
  boxShadow: '5px 5px 0 #000',
  padding: '2rem',
};

const pixelIconStyle: React.CSSProperties = {
  fontSize: '3rem',
  marginBottom: '0.5rem',
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 0.5rem 0',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '12px',
  color: 'var(--accent-gold)',
  lineHeight: '1.4',
};

const subtitleStyle: React.CSSProperties = {
  margin: '0 0 1.5rem 0',
  fontFamily: "'VT323', monospace",
  fontSize: '18px',
  color: 'var(--accent-teal)',
};

const trackStyle: React.CSSProperties = {
  width: '100%',
  height: '16px',
  backgroundColor: 'var(--bg-deep)',
  border: '2px solid var(--accent-teal)',
  position: 'relative',
  overflow: 'hidden',
};

const fillStyle: React.CSSProperties = {
  height: '100%',
  backgroundColor: 'var(--accent-pink)',
  transition: 'width 0.2s ease-out',
};

const progressTextStyle: React.CSSProperties = {
  marginTop: '0.8rem',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '9px',
  color: 'var(--accent-gold)',
};
