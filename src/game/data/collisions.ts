import { Rect } from './hotspots';

export const ROOM_BOUNDS: Rect = {
  x: 60,
  y: 120,
  width: 1220,
  height: 560,
};

export const SOLID_OBSTACLES: Rect[] = [
  // Top Wall
  { x: 0, y: 0, width: 1344, height: 120 },
  // Bottom Wall
  { x: 0, y: 680, width: 1344, height: 88 },
  // Left Wall
  { x: 0, y: 0, width: 60, height: 768 },
  // Right Wall
  { x: 1284, y: 0, width: 60, height: 768 },

  // Bookshelf (Top-Left)
  { x: 80, y: 190, width: 130, height: 130 },

  // Desk & PC Setup (Top Left-Center)
  { x: 280, y: 180, width: 180, height: 120 },

  // Main Showcase Monitor (Top Center)
  { x: 580, y: 140, width: 220, height: 110 },

  // Arcade Machine (Top-Right)
  { x: 1040, y: 150, width: 140, height: 140 },

  // Education Table & Diploma (Bottom-Left)
  { x: 150, y: 470, width: 150, height: 110 },

  // Beanbag Lounge & Phone (Bottom-Right)
  { x: 970, y: 470, width: 160, height: 120 },
];
