import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import sharp from 'sharp';

const outputDir = path.resolve('src/assets/images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Generate 1344x768 Pixel-Art Room Background
const canvas = createCanvas(1344, 768);
const ctx = canvas.getContext('2d');

// Floor - Isometric/Top-Down Pixel Grid Style
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 1344, 768);

// Floor Tiles
const tileSize = 48;
for (let x = 60; x < 1284; x += tileSize) {
  for (let y = 120; y < 680; y += tileSize) {
    ctx.fillStyle = ((x / tileSize + y / tileSize) % 2 === 0) ? '#1e293b' : '#111827';
    ctx.fillRect(x, y, tileSize, tileSize);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, tileSize, tileSize);
  }
}

// Walls (Top wall, left wall, right wall, bottom wall)
ctx.fillStyle = '#090d16';
ctx.fillRect(0, 0, 1344, 120); // Top wall
ctx.fillRect(0, 0, 60, 768);   // Left wall
ctx.fillRect(1284, 0, 60, 768); // Right wall
ctx.fillRect(0, 680, 1344, 88); // Bottom wall

// Wall Trim Line
ctx.strokeStyle = '#646cff';
ctx.lineWidth = 4;
ctx.beginPath();
ctx.moveTo(60, 120);
ctx.lineTo(1284, 120);
ctx.stroke();

// Room Features & Furniture Highlights
// 1. Cozy Central Rug
ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
ctx.strokeStyle = '#6366f1';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.roundRect(500, 360, 340, 180, 20);
ctx.fill();
ctx.stroke();

// 2. Desk & Computer (Top-Left Center)
ctx.fillStyle = '#1e1b4b';
ctx.fillRect(280, 180, 180, 120);
ctx.strokeStyle = '#818cf8';
ctx.strokeRect(280, 180, 180, 120);
// Dual Monitors
ctx.fillStyle = '#38bdf8';
ctx.fillRect(300, 195, 60, 40);
ctx.fillRect(370, 195, 60, 40);

// 3. Main Project Screen (Top-Center)
ctx.fillStyle = '#0c4a6e';
ctx.fillRect(580, 140, 220, 110);
ctx.strokeStyle = '#38bdf8';
ctx.lineWidth = 3;
ctx.strokeRect(580, 140, 220, 110);

// 4. Arcade Cabinet (Top-Right)
ctx.fillStyle = '#4c1d95';
ctx.fillRect(1040, 150, 140, 140);
ctx.strokeStyle = '#f43f5e';
ctx.strokeRect(1040, 150, 140, 140);

// 5. Bookshelf (Top-Left)
ctx.fillStyle = '#451a03';
ctx.fillRect(80, 190, 130, 130);
ctx.strokeStyle = '#f59e0b';
ctx.strokeRect(80, 190, 130, 130);

// 6. Education Desk (Bottom-Left)
ctx.fillStyle = '#064e3b';
ctx.fillRect(150, 470, 150, 110);
ctx.strokeStyle = '#34d399';
ctx.strokeRect(150, 470, 150, 110);

// 7. Beanbag & Phone Lounge (Bottom-Right)
ctx.fillStyle = '#701a75';
ctx.fillRect(970, 470, 160, 120);
ctx.strokeStyle = '#e879f9';
ctx.strokeRect(970, 470, 160, 120);

// Convert background canvas to WebP
const bgBuffer = canvas.toBuffer('image/png');
await sharp(bgBuffer)
  .webp({ quality: 85 })
  .toFile(path.join(outputDir, 'background.webp'));

console.log('✅ Generated background.webp (1344x768)');

// 2. Generate 64x64 Character Spritesheet PNG
const charCanvas = createCanvas(128, 128); // 4x4 frames (32x32 per frame)
const charCtx = charCanvas.getContext('2d');

const directions = ['down', 'up', 'left', 'right'];
for (let dirIdx = 0; dirIdx < 4; dirIdx++) {
  for (let frame = 0; frame < 4; frame++) {
    const x = frame * 32;
    const y = dirIdx * 32;

    // Body
    charCtx.fillStyle = '#646cff';
    charCtx.fillRect(x + 8, y + 10, 16, 14);

    // Head
    charCtx.fillStyle = '#ffdbac';
    charCtx.beginPath();
    charCtx.arc(x + 16, y + 8, 7, 0, Math.PI * 2);
    charCtx.fill();

    // Hair
    charCtx.fillStyle = '#1e293b';
    charCtx.fillRect(x + 9, y + 2, 14, 6);

    // Legs animation offset
    const legOffset = (frame % 2 === 0) ? 0 : (frame === 1 ? 2 : -2);
    charCtx.fillStyle = '#0f172a';
    charCtx.fillRect(x + 10 + legOffset, y + 24, 5, 7);
    charCtx.fillRect(x + 17 - legOffset, y + 24, 5, 7);
  }
}

const charBuffer = charCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(outputDir, 'character-sheet.png'), charBuffer);
console.log('✅ Generated character-sheet.png (128x128)');
