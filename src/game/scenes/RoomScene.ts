import { Container, Graphics, Text, TextStyle, Texture, Sprite } from 'pixi.js';
import { Character } from '../entities/Character';
import { HOTSPOTS, Hotspot } from '../data/hotspots';
import { InputManager } from '../engine/InputManager';

export class RoomScene {
  public container: Container;
  public character: Character;

  private backgroundSprite?: Sprite;
  private bgGraphics: Graphics;
  private hotspotsContainer: Container;
  private activeHotspot: Hotspot | null = null;

  private hotspotGraphicsMap: Map<string, Graphics> = new Map();
  private hotspotLabelMap: Map<string, Text> = new Map();

  private pulsingTime: number = 0;

  private onHotspotTriggerCallback?: (id: string) => void;
  private onHotspotNearCallback?: (hotspot: Hotspot | null) => void;

  constructor(bgTexture?: Texture) {
    this.container = new Container();

    // 1. Background
    this.bgGraphics = new Graphics();
    this.drawRoomBackground();
    this.container.addChild(this.bgGraphics);

    if (bgTexture) {
      this.backgroundSprite = new Sprite(bgTexture);
      this.backgroundSprite.width = 1344;
      this.backgroundSprite.height = 768;
      this.container.addChild(this.backgroundSprite);
    }

    // 2. Hotspots Layer
    this.hotspotsContainer = new Container();
    this.container.addChild(this.hotspotsContainer);
    this.setupHotspots();

    // 3. Player Character (Starts near center of room)
    this.character = new Character(672, 420);
    this.container.addChild(this.character.container);
  }

  private drawRoomBackground(): void {
    this.bgGraphics.clear();

    // Floor (Dark blue-slate pixel room vibe)
    this.bgGraphics.rect(0, 0, 1344, 768);
    this.bgGraphics.fill({ color: 0x0d1b2a });

    // Grid pattern
    for (let x = 60; x < 1284; x += 48) {
      for (let y = 120; y < 680; y += 48) {
        this.bgGraphics.rect(x, y, 48, 48);
        this.bgGraphics.stroke({ color: 0x16283e, width: 1 });
      }
    }

    // Wall top border
    this.bgGraphics.rect(0, 0, 1344, 120);
    this.bgGraphics.fill({ color: 0x070e17 });
    this.bgGraphics.stroke({ color: 0xffd23f, width: 2 });

    // Center Rug (Hard square corners for pixel design)
    this.bgGraphics.rect(500, 360, 340, 180);
    this.bgGraphics.fill({ color: 0x16283e, alpha: 0.8 });
    this.bgGraphics.stroke({ color: 0x4ecdc4, width: 2, alpha: 0.5 });
  }

  private setupHotspots(): void {
    HOTSPOTS.forEach((spot) => {
      // Glow Graphic
      const g = new Graphics();
      this.hotspotsContainer.addChild(g);
      this.hotspotGraphicsMap.set(spot.id, g);

      // Pixel TextStyle for label
      const style = new TextStyle({
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 9,
        fill: 0xf7f3e9,
        stroke: { color: 0x000000, width: 3 },
      });

      const labelText = new Text({ text: `${spot.icon} ${spot.label.toUpperCase()}`, style });
      labelText.anchor.set(0.5, 1);
      labelText.position.set(spot.bounds.x + spot.bounds.width / 2, spot.bounds.y - 10);
      this.hotspotsContainer.addChild(labelText);
      this.hotspotLabelMap.set(spot.id, labelText);
    });
  }

  public setOnHotspotTrigger(cb: (id: string) => void): void {
    this.onHotspotTriggerCallback = cb;
  }

  public setOnHotspotNear(cb: (hotspot: Hotspot | null) => void): void {
    this.onHotspotNearCallback = cb;
  }

  public update(deltaSeconds: number, inputManager: InputManager): void {
    this.pulsingTime += deltaSeconds * 4;
    this.character.update(deltaSeconds, inputManager);

    // Check hotspot proximity & click interactions
    let nearestSpot: Hotspot | null = null;
    let minDist = Infinity;

    const charPos = this.character.position;

    HOTSPOTS.forEach((spot) => {
      const spotCenterX = spot.bounds.x + spot.bounds.width / 2;
      const spotCenterY = spot.bounds.y + spot.bounds.height / 2;

      const dist = Math.hypot(charPos.x - spotCenterX, charPos.y - spotCenterY);

      if (dist < 130 && dist < minDist) {
        minDist = dist;
        nearestSpot = spot;
      }

      // Update label color and pulse outline graphics
      const isCurrentActive = nearestSpot?.id === spot.id;
      const labelText = this.hotspotLabelMap.get(spot.id);
      if (labelText) {
        labelText.style.fill = isCurrentActive ? 0xffd23f : 0xf7f3e9;
      }

      const g = this.hotspotGraphicsMap.get(spot.id);
      if (g) {
        g.clear();
        const pulseAlpha = isCurrentActive
          ? 0.7 + Math.sin(this.pulsingTime) * 0.3
          : 0.2 + Math.sin(this.pulsingTime * 0.5) * 0.1;

        const pulseColor = isCurrentActive ? 0xffd23f : 0x4ecdc4;

        // Hard square box outline (0 border radius)
        g.rect(spot.bounds.x, spot.bounds.y, spot.bounds.width, spot.bounds.height);
        g.fill({ color: pulseColor, alpha: isCurrentActive ? 0.25 : 0.05 });
        g.stroke({ color: pulseColor, width: isCurrentActive ? 3 : 1.5, alpha: pulseAlpha });
      }
    });

    if (this.activeHotspot !== nearestSpot) {
      this.activeHotspot = nearestSpot;
      if (this.onHotspotNearCallback) {
        this.onHotspotNearCallback(nearestSpot);
      }
    }

    // Check interaction trigger (E key / Space)
    if (this.activeHotspot && inputManager.consumeInteract()) {
      if (this.onHotspotTriggerCallback) {
        this.onHotspotTriggerCallback(this.activeHotspot.id);
      }
    }
  }

  public handleCanvasClick(worldX: number, worldY: number, inputManager: InputManager): void {
    // Check if clicked directly inside a hotspot
    for (const spot of HOTSPOTS) {
      if (
        worldX >= spot.bounds.x &&
        worldX <= spot.bounds.x + spot.bounds.width &&
        worldY >= spot.bounds.y &&
        worldY <= spot.bounds.y + spot.bounds.height
      ) {
        // Walk character to stand point & trigger hotspot
        inputManager.setTargetDestination(spot.standPoint);
        if (this.onHotspotTriggerCallback) {
          this.onHotspotTriggerCallback(spot.id);
        }
        return;
      }
    }

    // Otherwise set target destination to walk character to clicked point
    inputManager.setTargetDestination({ x: worldX, y: worldY });
  }
}
