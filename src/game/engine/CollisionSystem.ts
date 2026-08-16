import { Rect } from '../data/hotspots';
import { SOLID_OBSTACLES, ROOM_BOUNDS } from '../data/collisions';

export class CollisionSystem {
  /**
   * Checks if two rectangles intersect.
   */
  public static intersects(r1: Rect, r2: Rect): boolean {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  /**
   * Resolves player movement per-axis so the character slides smoothly along obstacles.
   */
  public static moveAndResolve(
    currentPos: { x: number; y: number },
    delta: { x: number; y: number },
    bodySize: { width: number; height: number }
  ): { x: number; y: number } {
    let nextX = currentPos.x + delta.x;
    let nextY = currentPos.y + delta.y;

    // Test X movement independently
    const playerXBox: Rect = {
      x: nextX - bodySize.width / 2,
      y: currentPos.y - bodySize.height / 2,
      width: bodySize.width,
      height: bodySize.height,
    };

    let collideX = false;
    for (const obstacle of SOLID_OBSTACLES) {
      if (this.intersects(playerXBox, obstacle)) {
        collideX = true;
        break;
      }
    }

    // Clamp to ROOM_BOUNDS X
    if (
      playerXBox.x < ROOM_BOUNDS.x ||
      playerXBox.x + playerXBox.width > ROOM_BOUNDS.x + ROOM_BOUNDS.width
    ) {
      collideX = true;
    }

    if (collideX) {
      nextX = currentPos.x;
    }

    // Test Y movement independently
    const playerYBox: Rect = {
      x: nextX - bodySize.width / 2,
      y: nextY - bodySize.height / 2,
      width: bodySize.width,
      height: bodySize.height,
    };

    let collideY = false;
    for (const obstacle of SOLID_OBSTACLES) {
      if (this.intersects(playerYBox, obstacle)) {
        collideY = true;
        break;
      }
    }

    // Clamp to ROOM_BOUNDS Y
    if (
      playerYBox.y < ROOM_BOUNDS.y ||
      playerYBox.y + playerYBox.height > ROOM_BOUNDS.y + ROOM_BOUNDS.height
    ) {
      collideY = true;
    }

    if (collideY) {
      nextY = currentPos.y;
    }

    return { x: nextX, y: nextY };
  }
}
