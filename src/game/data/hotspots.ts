export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Hotspot {
  id: string;
  label: string;
  icon: string;
  bounds: Rect;
  standPoint: Point;
  color: number;
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'about',
    label: 'About Me',
    icon: '💻',
    bounds: { x: 280, y: 180, width: 180, height: 140 },
    standPoint: { x: 370, y: 340 },
    color: 0x646cff,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '🎮',
    bounds: { x: 580, y: 140, width: 220, height: 140 },
    standPoint: { x: 690, y: 320 },
    color: 0x00d2ff,
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: '⚡',
    bounds: { x: 1040, y: 150, width: 140, height: 160 },
    standPoint: { x: 1110, y: 330 },
    color: 0xffa500,
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: '💼',
    bounds: { x: 80, y: 200, width: 140, height: 160 },
    standPoint: { x: 230, y: 340 },
    color: 0x38ef7d,
  },
  {
    id: 'education',
    label: 'Education',
    icon: '🎓',
    bounds: { x: 150, y: 470, width: 160, height: 140 },
    standPoint: { x: 330, y: 540 },
    color: 0xff007f,
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: '📬',
    bounds: { x: 960, y: 470, width: 180, height: 150 },
    standPoint: { x: 890, y: 540 },
    color: 0x9c1fe8,
  },
];
