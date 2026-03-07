import { useRef, useEffect } from 'react';

export default function RopeWaveLine({
  x = '50%',
  y = '50%',
  width = 500,
  height = 80,
  color = '#e4d4c8',
  waveAmplitude = 10,
  waveFrequency = 0.02,
  speed = 0.04,
  waveStart = 0.3,
  waveEnd = 0.7,
}) {
  const pathRef = useRef(null);
  // Use a ref instead of state — avoids 60 React re-renders per second
  const timeRef = useRef(0);

  useEffect(() => {
    let frameId;
    const numPoints = 100;
    const spacing = width / numPoints;
    const halfHeight = height / 2;

    const updateWave = () => {
      let path = `M 0 ${halfHeight}`;

      for (let i = 0; i <= numPoints; i++) {
        const px = i * spacing;
        const progress = px / width;
        const isInWave = progress >= waveStart && progress <= waveEnd;
        const py = isInWave
          ? halfHeight + Math.sin((i + timeRef.current) * waveFrequency) * waveAmplitude
          : halfHeight;
        path += ` L ${px} ${py}`;
      }

      if (pathRef.current) {
        pathRef.current.setAttribute('d', path);
      }

      timeRef.current += speed;
      frameId = requestAnimationFrame(updateWave);
    };

    frameId = requestAnimationFrame(updateWave);
    return () => cancelAnimationFrame(frameId);
  }, [waveStart, waveEnd, waveAmplitude, waveFrequency, speed, width, height]);

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
