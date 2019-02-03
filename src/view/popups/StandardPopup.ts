import { NinePatch } from '@koreez/phaser3-ninepatch';
import { GameObjects } from 'phaser';
import { gameConfig } from '../../constants/GameConfig';
import PopupScene from '../scenes/PopupScene';

export const SHOW_TWEEN_DURATION: number = 500;
export const HIDE_TWEEN_DURATION: number = SHOW_TWEEN_DURATION * 0.8;

export default class StandardPopup extends Phaser.GameObjects.Container {
  public static NAME: string = 'StandardPopup';
  public static ACTION_EVENT: string = `${StandardPopup.NAME}ActionEvent`;
  public static ACTION_CLOSE: number = 0;

  public static SHOW_START_EVENT: string = `${
    StandardPopup.NAME
  }ShowStartEvent`;
  public static SHOW_COMPLETE_EVENT: string = `${
    StandardPopup.NAME
  }ShowCompleteEvent`;
  public static HIDE_START_EVENT: string = `${
    StandardPopup.NAME
  }HideStartEvent`;
  public static HIDE_COMPLETE_EVENT: string = `${
    StandardPopup.NAME
  }HideCompleteEvent`;
  public static SHOW_START_NOTIFICATION: string = `${
    StandardPopup.NAME
  }ShowStartNotification`;
  public static SHOW_COMPLETE_NOTIFICATION: string = `${
    StandardPopup.NAME
  }ShowCompleteNotification`;
  public static HIDE_START_NOTIFICATION: string = `${
    StandardPopup.NAME
  }HideStartNotification`;
  public static HIDE_COMPLETE_NOTIFICATION: string = `${
    StandardPopup.NAME
  }HideCompleteNotification`;

  public blocker: Phaser.GameObjects.Graphics | Phaser.GameObjects.Image;
  public blockerZone: Phaser.GameObjects.Zone;
  public closeButton: Phaser.GameObjects.GameObject;
  public scene: PopupScene;
  protected bounds: Phaser.Geom.Rectangle;
  protected blockerAlpha: number;

  constructor() {
    super(
      (window as any).game.scene.getScene(PopupScene.NAME),
      gameConfig.canvasWidth / 2,
      gameConfig.canvasHeight / 2,
    );
    this.overrideStatics();
    this.createBody();
    this.scene.add.existing(this);
    this.setVisible(false);
  }

  public show(x: number, y: number, ...args: any[]): void {
    args;
    this.x = x;
    this.y = y;
    this.visible = true;
    if (this.blocker) {
      this.scene.add.existing(this.blocker);
    }
    this.createShowTween(...args);
  }

  public hide(actionId?: number): void {
    this.createHideTween(actionId);
  }

  public preDestroy(): void {
    this.blocker.destroy();
    super.preDestroy();
  }

  protected createBody(): void {
    throw new Error(
      `Method 'createBody' is not implemented in ${this.constructor.name}`,
    );
  }

  protected createShowTween(...args: any[]): void {
    this.emit(StandardPopup.SHOW_START_EVENT);
    if (this.blocker) {
      this.scene.popupCamera.ignore(this.blocker);
      this.scene.tweens.killTweensOf(this.blocker);
      this.blocker.visible = true;
      this.blocker.alpha = 0;
      this.scene.tweens.add({
        targets: this.blocker,
        alpha: this.blockerAlpha,
        duration: SHOW_TWEEN_DURATION,
        ease: 'Back.easeInOut',
      });
    }
    const toY: number = this.y;
    this.y += gameConfig.canvasHeight * 1.5;
    this.scene.tweens.add({
      targets: this,
      y: toY,
      duration: SHOW_TWEEN_DURATION,
      ease: 'Back.easeInOut',
      onComplete: () => {
        this.onShowComplete(...args);
      },
    });
  }

  protected onShowComplete(...args: any[]): void {
    args;
    if (this.blocker && this.blocker.input) {
      this.blocker.input.enabled = true;
    }
    if (this.blockerZone && this.blockerZone.input) {
      this.blockerZone.input.enabled = true;
      this.scene.add.existing(this.blockerZone);
    }
    this.emit(StandardPopup.SHOW_COMPLETE_EVENT);
    this.scene.sys.displayList.bringToTop(this);
  }

  protected createHideTween(actionId?: number): void {
    this.emit(StandardPopup.HIDE_START_EVENT);
    if (this.blocker) {
      this.scene.tweens.add({
        targets: this.blocker,
        duration: SHOW_TWEEN_DURATION,
        ease: 'Back.easeInOut',
        onComplete: () => {
          if (this.blocker && this.blocker.input) {
            this.blocker.input.enabled = false;
            this.blocker.visible = false;
            this.blocker.alpha = this.blockerAlpha;
          }
          if (this.blockerZone && this.blockerZone.input) {
            this.blockerZone.input.enabled = false;
            this.scene.sys.displayList.remove(this.blockerZone);
          }
          this.scene.sys.displayList.remove(this.blocker);
        },
      });
    }

    const toY: number = this.y + gameConfig.canvasHeight * 1.5;
    this.scene.tweens.add({
      targets: this,
      y: toY,
      duration: HIDE_TWEEN_DURATION,
      ease: 'Back.easeInOut',
      onComplete: () => {
        this.visible = false;
        this.emit(StandardPopup.HIDE_COMPLETE_EVENT, actionId);
      },
    });
  }

  protected createBg(
    key: string,
    frame: string,
    width: number,
    height: number,
  ): NinePatch {
    const config: any = {
      key,
      frame,
      width,
      height,
    };
    const bg: NinePatch = (this.scene.make as any).ninePatch(config, false);
    bg.setInteractive();
    this.add(bg);

    this.bounds = new Phaser.Geom.Rectangle(bg.x, bg.y, bg.width, bg.height);
    return bg;
  }

  protected createBgImage(key: string, frame: string): GameObjects.Image {
    const config: any = {
      key,
      frame,
    };
    const bg: GameObjects.Image = this.scene.make.image(config, false);
    bg.setInteractive();
    this.add(bg);

    this.bounds = new Phaser.Geom.Rectangle(bg.x, bg.y, bg.width, bg.height);
    return bg;
  }

  protected createBlocker(
    _key: string,
    _frame: string,
    alpha: number = 1,
  ): void {
    const config: any = {
      x: gameConfig.canvasWidth / 2,
      y: gameConfig.canvasHeight / 2,
      key: _key,
      frame: _frame,
    };
    this.blocker = this.scene.make.image(config);
    this.blocker.setInteractive();
    this.blocker.alpha = alpha;
    this.blockerAlpha = this.blocker.alpha;
    this.blocker.visible = false;
    this.blocker.input.enabled = false;
  }

  protected createGraphicsBlocker(alpha: number = 1, color?: number): void {
    this.blocker = this.scene.make.graphics({
      fillStyle: { color: color ? color : 0x000000 },
    });
    this.blocker.fillRect(
      0,
      0,
      gameConfig.canvasWidth,
      gameConfig.canvasHeight,
    );
    this.blocker.alpha = alpha;
    this.blockerAlpha = this.blocker.alpha;
    this.blocker.visible = false;
    this.blockerZone = this.scene.make.zone({
      x: 0,
      y: 0,
      width: gameConfig.canvasWidth,
      height: gameConfig.canvasHeight,
    });
    this.blockerZone.setInteractive();
    // this.blockerZone.on('pointerdown', this.blockerPointerDown, this);
    // this.blockerZone.on('pointerover', this.blockerPointerOver, this);
    // this.blockerZone.on('pointerout', this.blockerPointerOut, this);
    // this.blockerZone.on('pointerup', this.blockerPointerUp, this);
  }

  protected createCancelButton(
    key: string,
    frame: string,
    x?: number,
    y?: number,
  ): void {
    x;
    y;
    const config: any = {
      x: this.bounds.width * 0.5 - 25,
      y: -this.bounds.height * 0.5 + 25,
      key,
      frame,
    };
    const closeBtn: Phaser.GameObjects.Image = this.scene.make.image(config);
    closeBtn.setInteractive();
    closeBtn.on('pointerdown', this.emitClose, this);
    this.add(closeBtn);
  }

  protected blockerPointerDown(): void {
    //
  }
  protected blockerPointerUp(): void {
    //
  }
  protected blockerPointerOver(): void {
    //
  }
  protected blockerPointerOut(): void {
    //
  }

  protected emitClose(): void {
    this.emit(StandardPopup.ACTION_EVENT, StandardPopup.ACTION_CLOSE);
  }

  protected onAction(action: number): void {
    this.emit(StandardPopup.ACTION_EVENT, action);
  }

  protected overrideStatics(): void {
    (this.constructor as any).SHOW_START_EVENT = `${
      (this.constructor as any).NAME
    }ShowStartEvent`;
    (this.constructor as any).SHOW_COMPLETE_EVENT = `${
      (this.constructor as any).NAME
    }ShowCompleteEvent`;
    (this.constructor as any).HIDE_START_EVENT = `${
      (this.constructor as any).NAME
    }HideStartEvent`;
    (this.constructor as any).HIDE_COMPLETE_EVENT = `${
      (this.constructor as any).NAME
    }HideCompleteEvent`;
    (this.constructor as any).SHOW_START_NOTIFICATION = `${
      (this.constructor as any).NAME
    }ShowStartNotification`;
    (this.constructor as any).SHOW_COMPLETE_NOTIFICATION = `${
      (this.constructor as any).NAME
    }ShowCompleteNotification`;
    (this.constructor as any).HIDE_START_NOTIFICATION = `${
      (this.constructor as any).NAME
    }HideStartNotification`;
    (this.constructor as any).HIDE_COMPLETE_NOTIFICATION = `${
      (this.constructor as any).NAME
    }HideCompleteNotification`;
  }
}
