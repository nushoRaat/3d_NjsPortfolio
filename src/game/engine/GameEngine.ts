import { Application, Assets, Texture } from 'pixi.js';
import { RoomScene } from '../scenes/RoomScene';
import { InputManager } from './InputManager';

import bgImgUrl from '../../assets/images/background.webp';

export class GameEngine {
  public app: Application;
  public roomScene?: RoomScene;
  public inputManager: InputManager;

  public virtualWidth = 1344;
  public virtualHeight = 768;

  private isInitializing = false;
  private isInitialized = false;
  private isDestroyed = false;

  private resizeHandler?: () => void;

  constructor() {
    this.app = new Application();
    this.inputManager = new InputManager();
  }

  public async init(
    container: HTMLElement,
    onProgress: (progress: number) => void,
    onHotspotTrigger: (id: string) => void,
    onHotspotNear: (spotName: string | null) => void
  ): Promise<void> {
    if (this.isInitialized || this.isInitializing || this.isDestroyed) return;
    this.isInitializing = true;

    try {
      // 1. Initialize PixiJS v8 Application
      await this.app.init({
        width: this.virtualWidth,
        height: this.virtualHeight,
        backgroundColor: 0x0f172a,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        antialias: false, // Sharp pixel art look
      });

      if (this.isDestroyed) {
        this.safeDestroyApp();
        return;
      }

      if (this.app.canvas && container) {
        container.appendChild(this.app.canvas);
      }

      // 2. Load Assets using Vite ES import
      let bgTexture: Texture | undefined;
      try {
        bgTexture = await Assets.load({
          src: bgImgUrl,
          loadParser: 'loadTextures',
        });
        onProgress(100);
      } catch {
        onProgress(100);
      }

      if (this.isDestroyed) {
        this.safeDestroyApp();
        return;
      }

      // 3. Instantiate RoomScene
      this.roomScene = new RoomScene(bgTexture);
      this.app.stage.addChild(this.roomScene.container);

      this.roomScene.setOnHotspotTrigger(onHotspotTrigger);
      this.roomScene.setOnHotspotNear((spot) => {
        onHotspotNear(spot ? spot.label : null);
      });

      // 4. Setup Click / Touch Handler on Pixi Canvas
      if (this.app.canvas) {
        this.app.canvas.addEventListener('pointerdown', (e: MouseEvent | TouchEvent) => {
          if (!this.app.canvas) return;
          const rect = this.app.canvas.getBoundingClientRect();
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

          const scaleX = this.virtualWidth / rect.width;
          const scaleY = this.virtualHeight / rect.height;

          const worldX = (clientX - rect.left) * scaleX;
          const worldY = (clientY - rect.top) * scaleY;

          if (this.roomScene) {
            this.roomScene.handleCanvasClick(worldX, worldY, this.inputManager);
          }
        });
      }

      // 5. Game Loop Ticker
      this.app.ticker.add((ticker) => {
        if (this.isDestroyed) return;
        const deltaSeconds = ticker.deltaMS / 1000;
        if (this.roomScene) {
          this.roomScene.update(deltaSeconds, this.inputManager);
        }
      });

      this.resizeHandler = () => this.resizeCanvas(container);
      this.resizeCanvas(container);
      window.addEventListener('resize', this.resizeHandler);

      this.isInitialized = true;
      this.isInitializing = false;
    } catch (err) {
      console.warn('Game Engine Init Warning:', err);
      this.isInitializing = false;
    }
  }

  public resizeCanvas(container: HTMLElement): void {
    if (!this.app.canvas || !container) return;

    const parentWidth = container.clientWidth || window.innerWidth;
    const parentHeight = container.clientHeight || window.innerHeight;

    const scale = Math.min(parentWidth / this.virtualWidth, parentHeight / this.virtualHeight);

    const newWidth = Math.floor(this.virtualWidth * scale);
    const newHeight = Math.floor(this.virtualHeight * scale);

    this.app.canvas.style.width = `${newWidth}px`;
    this.app.canvas.style.height = `${newHeight}px`;
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.inputManager.destroy();

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    this.safeDestroyApp();
  }

  private safeDestroyApp(): void {
    try {
      if (this.app && typeof this.app.destroy === 'function') {
        this.app.destroy(true, { children: true });
      }
    } catch {
      // Ignore StrictMode unmount race conditions
    }
  }
}
