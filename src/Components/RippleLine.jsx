import React, { useRef, useEffect, useState } from 'react';

export default function RopeWaveLine({
  x = '50%',
  y = '50%',
  width = 500,
  height = 80,
  color = '#e4d4c8',
  waveAmplitude = 10,
  waveFrequency = 0.02,
  speed = 0.04,
  waveStart = 0.3, // wave starts at 30% of width
  waveEnd = 0.7    // wave ends at 70% of width
}) {
  const pathRef = useRef(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frameId;

    const updateWave = () => {
      const numPoints = 100;
      const spacing = width / numPoints;
      let path = `M 0 ${height / 2}`;

      for (let i = 0; i <= numPoints; i++) {
        const px = i * spacing;
        const progress = px / width;

        const isInWave = progress >= waveStart && progress <= waveEnd;
        const py = isInWave
          ? height / 2 + Math.sin((i + time) * waveFrequency) * waveAmplitude
          : height / 2;

        path += ` L ${px} ${py}`;
      }

      if (pathRef.current) {
        pathRef.current.setAttribute('d', path);
      }

      setTime((prev) => prev + speed);
      frameId = requestAnimationFrame(updateWave);
    };

    frameId = requestAnimationFrame(updateWave);
    return () => cancelAnimationFrame(frameId);
  }, [time, waveStart, waveEnd, waveAmplitude, waveFrequency, speed, width, height]);

  return (
    <svg
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
      }}
      width={width}
      height={height}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
