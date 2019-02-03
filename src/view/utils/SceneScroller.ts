export class SceneScroller {
  public scene: Phaser.Scene;
  public config: IScrollConfig;
  public events: Phaser.Events.EventEmitter;
  private startData: IScrollActionEventData;
  private directionState: IDirectionState;
  private isInScroll: boolean;
  private speedX: number;
  private speedY: number;
  private kineticScrollX: Phaser.Tweens.Tween;
  private kineticScrollY: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, config?: IScrollConfig) {
    this.scene = scene;
    this.events = new Phaser.Events.EventEmitter();
    const defaultConfig: IScrollConfig = {
      startPoint: {
        x: 0,
        y: 0,
      },
      camera: this.scene.cameras.main,
      vertical: {
        enabled: true,
        kineticScroll: true,
        distanceTrashHold: 30,
      },
      horizontal: {
        enabled: true,
        kineticScroll: true,
        distanceTrashHold: 30,
      },
      limits: {
        left: 0,
        right: scene.cameras.main.width,
        top: 0,
        bottom: scene.cameras.main.height,
      },
    };
    this.config = defaultConfig;
    this.config = { ...this.config, ...config };
    this.camera.scrollX = this.config.startPoint.x;
    this.camera.scrollY = this.config.startPoint.y;
    this.cancelScroll();
  }

  public scrollToTop(
    duration: number = 1000,
    customEvents?: ICustomEvents,
  ): void {
    this.scrollTo({ y: this.config.limits.top }, duration, false, customEvents);
  }

  public scrollToBottom(
    duration: number = 1000,
    customEvents?: ICustomEvents,
  ): void {
    this.scrollTo(
      { y: this.config.limits.bottom },
      duration,
      false,
      customEvents,
    );
  }

  public scrollToLeft(
    duration: number = 1000,
    customEvents?: ICustomEvents,
  ): void {
    this.scrollTo(
      { x: this.config.limits.left },
      duration,
      false,
      customEvents,
    );
  }

  public scrollToRight(
    duration: number = 1000,
    customEvents?: ICustomEvents,
  ): void {
    this.scrollTo(
      { x: this.config.limits.right },
      duration,
      false,
      customEvents,
    );
  }

  public setLimits(data: ILimitMovementData | Phaser.Geom.Rectangle): void {
    this.config.limits = {
      ...this.config.limits,
      ...(data as ILimitMovementData),
    };
  }

  public setHorizontalScrollState(enabled: boolean): void {
    this.config.horizontal.enabled = enabled;
  }
  public setVerticalScrollState(enabled: boolean): void {
    this.config.vertical.enabled = enabled;
  }

  public start(): void {
    this.scene.input.on('pointerdown', this.onStartScrolling, this);
  }

  public stop(): void {
    this.scene.input.off('pointerdown', this.onStartScrolling, this, false);
    this.scene.input.off('pointermove', this.onScrolling, this, false);
    this.scene.input.off('pointerup', this.onStopScrolling, this, false);
  }

  public startKineticScroll(framesCountX: number, framesCountY: number): void {
    this.scene.tweens.killTweensOf(this.camera);
    if (framesCountX !== 0) {
      this.kineticScrollX = this.scene.tweens.add({
        targets: this,
        speedX: 0,
        duration: (framesCountX * 1000) / 60,
        onUpdate: () => {
          this.applyScrollX();
        },
        onComplete: () => {
          if (framesCountX <= framesCountY) {
            return;
          }
          this.events.emit('scrollEnd');
        },
      });
    }
    if (framesCountY !== 0) {
      this.kineticScrollY = this.scene.tweens.add({
        targets: this,
        speedY: 0,
        duration: (framesCountY * 1000) / 60,
        onUpdate: () => {
          this.applyScrollY();
        },
        onComplete: () => {
          if (framesCountX > framesCountY) {
            return;
          }
          this.events.emit('scrollEnd');
        },
      });
    }
  }

  public scrollTo(
    target: IPoint,
    duration: number,
    force?: boolean,
    customEvents?: ICustomEvents,
  ): void {
    this.stopScroll();
    this.events.emit('scrollStart');
    if (customEvents && customEvents.start) {
      this.events.emit(customEvents.start);
    }
    let x: number = target.x ? target.x : this.camera.scrollX;
    let y: number = target.y ? target.y : this.camera.scrollY;
    if (!force) {
      x = this.limitMovementX(x);
      y = this.limitMovementY(y);
    }
    this.scene.tweens.killTweensOf(this.camera);
    this.scene.tweens.add({
      targets: this.camera,
      scrollX: target.x ? target.x : this.camera.scrollX,
      scrollY: target.y ? target.y : this.camera.scrollY,
      duration,
      onComplete: () => {
        this.events.emit('scrollEnd');
        if (customEvents && customEvents.end) {
          this.events.emit(customEvents.end);
        }
      },
    });
  }

  public getNearestStep(step: IPoint): IPoint {
    if (!this.config.limits) {
      return null;
    }
    const x: number = this.getNearestStepX(step.x);
    const y: number = this.getNearestStepY(step.y);
    return { x, y };
  }

  public scrollByStep(
    step: IPoint,
    duration: number,
    direction: number,
    force?: boolean,
    customEvents?: ICustomEvents,
  ): void {
    this.stopScroll();
    this.events.emit('scrollStart');
    if (customEvents && customEvents.start) {
      this.events.emit(customEvents.start);
    }
    this.scene.tweens.killTweensOf(this.camera);
    let scrollX: number = step.x
      ? this.camera.scrollX - Math.sign(direction) * step.x
      : 0;
    let scrollY: number = step.y
      ? this.camera.scrollY - Math.sign(direction) * step.y
      : 0;
    if (!force) {
      scrollX = this.limitMovementX(scrollX);
      scrollY = this.limitMovementY(scrollY);
    }
    this.scene.tweens.add({
      targets: this.camera,
      scrollX,
      scrollY,
      duration,
      onComplete: () => {
        this.events.emit('scrollEnd');
        if (customEvents && customEvents.end) {
          this.events.emit(customEvents.end);
        }
      },
    });
  }

  private onStartScrolling(pointer: Phaser.Input.Pointer): void {
    this.scene.tweens.killTweensOf(this);
    this.startData = {
      x: pointer.x,
      y: pointer.y,
      camX: this.camera.scrollX,
      camY: this.camera.scrollY,
    };

    this.scene.input.on('pointermove', this.onScrolling, this);
    this.scene.input.once('pointerup', this.onStopScrolling, this);
  }

  private onScrolling(pointer: Phaser.Input.Pointer): void {
    if (!this.isInScroll) {
      this.checkDistanceTrashHold(pointer);
      return;
    }
    if (this.horizontalScrollEnabled) {
      const difX: number = this.startData.x - pointer.x;
      const newX: number = this.limitMovementX(this.startData.camX + difX);
      this.camera.scrollX = newX;
      // ---
      const direction: number = this.calculateCurrentDirectionX(pointer);
      if (direction !== this.directionState.x.direction) {
        this.directionState.x.direction = direction;
        this.directionState.x.moment = this.scene.time.now;
        this.directionState.x.directionValue = this.directionState.x.value;
      }
      this.directionState.x.value = pointer.x;
      this.directionState.x.lastUpdateMoment = this.scene.time.now;
    }
    if (this.verticalScrollEnabled) {
      const difY: number = this.startData.y - pointer.y;
      this.camera.scrollY = this.limitMovementY(this.startData.camY + difY);

      // ---
      const direction: number = this.calculateCurrentDirectionY(pointer);
      if (direction !== this.directionState.y.direction) {
        this.directionState.y.direction = direction;
        this.directionState.y.moment = this.scene.time.now;
        this.directionState.y.directionValue = this.directionState.y.value;
      }
      this.directionState.y.value = pointer.y;
      this.directionState.y.lastUpdateMoment = this.scene.time.now;
    }
  }

  private onStopScrolling(pointer: Phaser.Input.Pointer): void {
    this.scene.input.off('pointermove', this.onScrolling, this, false);
    this.scene.input.off('pointerup', this.onStopScrolling, this, false);
    if (!this.isInScroll) {
      this.checkDistanceTrashHold(pointer);
      return;
    }
    if (!this.directionState) {
      return;
    }
    const now: number = this.scene.time.now;
    const dtX: number =
      now - this.directionState.x.lastUpdateMoment <= 100
        ? Math.sqrt(now - this.directionState.x.moment)
        : 0;
    const dtY: number =
      now - this.directionState.y.lastUpdateMoment <= 100
        ? Math.sqrt(now - this.directionState.y.moment)
        : 0;
    if (this.horizontalScrollEnabled) {
      const difX: number = pointer.x - this.startData.x;
      this.speedX = difX / dtX;
    }
    if (this.verticalScrollEnabled) {
      const difY: number = pointer.y - this.startData.y;
      this.speedY = difY / dtY;
    }
    this.startKineticScroll(dtX, dtY);
  }

  private applyScrollX(): void {
    const resultPosition: number = this.limitMovementX(
      this.camera.scrollX - this.speedX,
    );
    this.camera.scrollX = resultPosition;
  }
  private applyScrollY(): void {
    const resultPosition: number = this.limitMovementY(
      this.camera.scrollY - this.speedY,
    );
    this.camera.scrollY = resultPosition;
  }

  private limitMovementX(newX: number): number {
    if (this.horizontalScrollEnabled) {
      if (newX > this.config.limits.right - this.camera.displayWidth) {
        this.kineticScrollX && this.kineticScrollX.stop();
        newX = this.config.limits.right - this.camera.displayWidth;
      } else if (newX < this.config.limits.left) {
        this.kineticScrollX && this.kineticScrollX.stop();
        newX = this.config.limits.left;
      }
    }
    return newX;
  }
  private limitMovementY(newY: number): number {
    if (this.verticalScrollEnabled) {
      if (newY > this.config.limits.bottom - this.camera.displayHeight) {
        this.kineticScrollY && this.kineticScrollY.stop();
        newY = this.config.limits.bottom - this.camera.displayHeight;
      } else if (newY < this.config.limits.top) {
        this.kineticScrollY && this.kineticScrollY.stop();
        newY = this.config.limits.top;
      }
    }
    return newY;
  }

  private stopScroll(): void {
    this.events.emit('scrollStopped');
    this.cancelScroll();
  }

  private cancelScroll(): void {
    this.speedX = null;
    this.speedY = null;
    this.startData = null;
    this.isInScroll = false;
  }

  private checkDistanceTrashHold(pointer: Phaser.Input.Pointer): void {
    if (!this.startData) {
      return;
    }
    const difX: number = pointer.x - this.startData.x;
    const difY: number = pointer.y - this.startData.y;

    const configDistanceTrashHold: boolean = this.checkConfigDistanceTrashHold(
      difX,
      difY,
    );
    const horizontalDistanceTrashHold: boolean = this.checkHorizontalDistanceTrashHold(
      difX,
    );
    const verticalDistanceTrashHold: boolean = this.checkVerticalDistanceTrashHold(
      difY,
    );
    this.isInScroll =
      configDistanceTrashHold ||
      horizontalDistanceTrashHold ||
      verticalDistanceTrashHold;
    if (this.isInScroll) {
      this.events.emit('scrollStart');
    }
    this.setLastStepState(pointer);
  }

  private setLastStepState(pointer: Phaser.Input.Pointer): void {
    if (!this.startData) {
      return;
    }
    this.directionState = {
      x: {
        moment: this.scene.time.now,
        lastUpdateMoment: this.scene.time.now,
        value: pointer.x,
        directionValue: pointer.x,
        direction: this.horizontalScrollEnabled
          ? this.startData.x - pointer.x
          : null,
      },
      y: {
        moment: this.scene.time.now,
        lastUpdateMoment: this.scene.time.now,
        value: pointer.y,
        directionValue: pointer.y,
        direction: this.horizontalScrollEnabled
          ? this.startData.y - pointer.y
          : null,
      },
    };
  }

  private calculateCurrentDirectionX(pointer: Phaser.Input.Pointer): number {
    return this.horizontalScrollEnabled
      ? Math.sign(this.startData.x - pointer.x)
      : null;
  }
  private calculateCurrentDirectionY(pointer: Phaser.Input.Pointer): number {
    return this.verticalScrollEnabled
      ? Math.sign(this.startData.y - pointer.y)
      : null;
  }

  private checkConfigDistanceTrashHold(difX: number, difY: number): boolean {
    const distance: number = Math.sqrt(difX ** 2 + difY ** 2);
    if (this.config.distanceTrashHold) {
      return distance > this.config.distanceTrashHold;
    }
  }
  private checkHorizontalDistanceTrashHold(difX: number): boolean {
    if (this.horizontalScrollEnabled) {
      return Math.abs(difX) > this.config.horizontal.distanceTrashHold;
    }
  }
  private checkVerticalDistanceTrashHold(difY: number): boolean {
    if (this.verticalScrollEnabled) {
      return Math.abs(difY) > this.config.vertical.distanceTrashHold;
    }
  }

  private getNearestStepX(stepX: number): number {
    if (!this.horizontalScrollEnabled) {
      return null;
    }
    const near1: number = Math.floor(this.camera.scrollX / stepX);
    const near2: number = Math.ceil(this.camera.scrollX / stepX);
    const dif1: number = Math.abs(
      Math.abs(this.camera.scrollX) - Math.abs(near1),
    );
    const dif2: number = Math.abs(
      Math.abs(this.camera.scrollX) - Math.abs(near2),
    );
    return stepX * (Math.min(dif1, dif2) === dif1 ? near1 : near2);
  }

  private getNearestStepY(stepY: number): number {
    if (!this.verticalScrollEnabled) {
      return null;
    }
    const near1: number = Math.floor(this.camera.scrollY / stepY);
    const near2: number = Math.ceil(this.camera.scrollY / stepY);
    const dif1: number = Math.abs(
      Math.abs(this.camera.scrollY) - Math.abs(near1),
    );
    const dif2: number = Math.abs(
      Math.abs(this.camera.scrollY) - Math.abs(near2),
    );
    return stepY * (Math.min(dif1, dif2) === dif1 ? near1 : near2);
  }

  get verticalScrollEnabled(): boolean {
    return (
      this.config.vertical &&
      this.config.vertical.enabled &&
      Math.abs(this.config.limits.bottom - this.config.limits.top) >
        this.camera.displayHeight
    );
  }
  get horizontalScrollEnabled(): boolean {
    return (
      this.config.horizontal &&
      this.config.horizontal.enabled &&
      Math.abs(this.config.limits.right - this.config.limits.left) >
        this.camera.displayWidth
    );
  }

  get camera(): Phaser.Cameras.Scene2D.Camera {
    return this.config.camera;
  }

  get startX(): number {
    return this.config.startPoint.x;
  }
  get startY(): number {
    return this.config.startPoint.y;
  }

  get limits(): ILimitMovementData {
    return this.config.limits;
  }
}

export interface IScrollConfig {
  camera?: Phaser.Cameras.Scene2D.Camera;
  startPoint?: IPoint;
  horizontal?: ISideScrollConfig;
  vertical?: ISideScrollConfig;
  distanceTrashHold?: number;
  limits?: ILimitMovementData;
}

export interface ISideScrollConfig {
  enabled: boolean;
  kineticScroll: boolean;
  distanceTrashHold: number;
}

interface IScrollActionEventData {
  x: number;
  y: number;
  camX?: number;
  camY?: number;
}

interface IDirectionState {
  x: {
    moment: number;
    lastUpdateMoment: number;
    value: number;
    directionValue: number;
    direction: number;
  };
  y: {
    moment: number;
    lastUpdateMoment: number;
    value: number;
    directionValue: number;
    direction: number;
  };
}

interface IPoint {
  x?: number;
  y?: number;
}

export interface ILimitMovementData {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

interface ICustomEvents {
  start?: string;
  end?: string;
}
