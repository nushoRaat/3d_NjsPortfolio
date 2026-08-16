import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { CollisionSystem } from '../engine/CollisionSystem';
import { InputManager } from '../engine/InputManager';

export type Direction = 'down' | 'up' | 'left' | 'right';

export class Character {
  public container: Container;
  public position: { x: number; y: number };
  public speed: number = 220; // Pixels per second
  public direction: Direction = 'down';

  public isMoving: boolean = false;
  private animFrame: number = 0;
  private animTimer: number = 0;

  private sprite?: Sprite;
  private placeholderGraphics?: Graphics;

  public bodySize = { width: 36, height: 28 };

  constructor(x: number, y: number, texture?: Texture) {
    this.position = { x, y };
    this.container = new Container();
    this.container.position.set(x, y);

    if (texture) {
      this.sprite = new Sprite(texture);
      this.sprite.anchor.set(0.5, 0.85);
      this.container.addChild(this.sprite);
    } else {
      // Fallback stylized character graphics
      this.placeholderGraphics = new Graphics();
      this.drawPlaceholderCharacter();
      this.container.addChild(this.placeholderGraphics);
    }
  }

  private drawPlaceholderCharacter(): void {
    if (!this.placeholderGraphics) return;
    this.placeholderGraphics.clear();

    // Shadow
    this.placeholderGraphics.ellipse(0, 4, 18, 8);
    this.placeholderGraphics.fill({ color: 0x000000, alpha: 0.3 });

    // Legs
    this.placeholderGraphics.roundRect(-10, -8, 8, 12, 3);
    this.placeholderGraphics.roundRect(2, -8, 8, 12, 3);
    this.placeholderGraphics.fill({ color: 0x1f2937 });

    // Body / Jacket
    this.placeholderGraphics.roundRect(-14, -28, 28, 24, 6);
    this.placeholderGraphics.fill({ color: 0x646cff });

    // Head / Face
    this.placeholderGraphics.circle(0, -36, 14);
    this.placeholderGraphics.fill({ color: 0xffdbac });

    // Hair / Cap
    this.placeholderGraphics.arc(0, -38, 15, Math.PI, 0);
    this.placeholderGraphics.fill({ color: 0x111827 });

    // Eyes direction
    let eyeOffsetX = 0;
    let eyeOffsetY = 0;
    if (this.direction === 'left') eyeOffsetX = -4;
    if (this.direction === 'right') eyeOffsetX = 4;
    if (this.direction === 'up') eyeOffsetY = -4;

    this.placeholderGraphics.circle(-4 + eyeOffsetX, -36 + eyeOffsetY, 2);
    this.placeholderGraphics.circle(4 + eyeOffsetX, -36 + eyeOffsetY, 2);
    this.placeholderGraphics.fill({ color: 0x111827 });
  }

  public update(deltaSeconds: number, inputManager: InputManager): void {
    let moveVec = inputManager.getMovementVector();
    const targetDest = inputManager.getTargetDestination();

    // If click/tap target exists
    if ((moveVec.x === 0 && moveVec.y === 0) && targetDest) {
      const dx = targetDest.x - this.position.x;
      const dy = targetDest.y - this.position.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 8) {
        moveVec = { x: dx / dist, y: dy / dist };
      } else {
        inputManager.setTargetDestination(null);
      }
    }

    if (moveVec.x !== 0 || moveVec.y !== 0) {
      this.isMoving = true;

      // Determine main cardinal direction
      if (Math.abs(moveVec.x) > Math.abs(moveVec.y)) {
        this.direction = moveVec.x > 0 ? 'right' : 'left';
      } else {
        this.direction = moveVec.y > 0 ? 'down' : 'up';
      }

      // Calculate step movement with AABB collision sliding
      const moveDist = this.speed * deltaSeconds;
      const delta = { x: moveVec.x * moveDist, y: moveVec.y * moveDist };

      const newPos = CollisionSystem.moveAndResolve(this.position, delta, this.bodySize);
      this.position = newPos;
      this.container.position.set(newPos.x, newPos.y);

      // Animate frame
      this.animTimer += deltaSeconds;
      if (this.animTimer >= 0.15) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 4;
      }
    } else {
      this.isMoving = false;
      this.animFrame = 0;
    }

    if (this.placeholderGraphics) {
      this.drawPlaceholderCharacter();
    }
  }

  public setPosition(x: number, y: number): void {
    this.position = { x, y };
    this.container.position.set(x, y);
  }
}
