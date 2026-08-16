export interface InputVector {
  x: number;
  y: number;
}

export class InputManager {
  private keys: Record<string, boolean> = {};
  private targetDestination: { x: number; y: number } | null = null;
  private joystickVector: InputVector = { x: 0, y: 0 };
  private interactPressed: boolean = false;

  private onInteractCallback?: () => void;

  constructor() {
    this.setupListeners();
  }

  private setupListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if ((e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
        this.interactPressed = true;
        if (this.onInteractCallback) {
          this.onInteractCallback();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        this.interactPressed = false;
      }
    });
  }

  public setInteractCallback(callback: () => void): void {
    this.onInteractCallback = callback;
  }

  public setTargetDestination(pos: { x: number; y: number } | null): void {
    this.targetDestination = pos;
  }

  public getTargetDestination(): { x: number; y: number } | null {
    return this.targetDestination;
  }

  public setJoystickVector(vec: InputVector): void {
    this.joystickVector = vec;
    if (vec.x !== 0 || vec.y !== 0) {
      this.targetDestination = null; // Override tap-to-move
    }
  }

  public getMovementVector(): InputVector {
    let dx = 0;
    let dy = 0;

    // Keyboard controls (WASD / Arrows)
    if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;

    if (dx !== 0 || dy !== 0) {
      this.targetDestination = null; // Keyboard cancels click destination
      // Normalize diagonal keyboard speed
      const len = Math.hypot(dx, dy);
      return { x: dx / len, y: dy / len };
    }

    // Touch Joystick controls
    if (this.joystickVector.x !== 0 || this.joystickVector.y !== 0) {
      return this.joystickVector;
    }

    return { x: 0, y: 0 };
  }

  public consumeInteract(): boolean {
    const pressed = this.interactPressed;
    this.interactPressed = false;
    return pressed;
  }

  public destroy(): void {
    // Listeners automatically clean up when window reloads or component unmounts
  }
}
