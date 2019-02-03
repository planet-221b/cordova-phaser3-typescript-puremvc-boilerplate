import { gameConfig } from '../../constants/GameConfig';
import BaseScene from './BaseScene';

export default class PreloadScene extends BaseScene {
  public static NAME: string = 'PreloadScene';
  public static LOAD_COMPLETE_NOTIFICATION: string = `${
    PreloadScene.NAME
  }LoadCompleteNotification`;
  public static LOAD_COMPLETE_EVENT: string = `${
    PreloadScene.NAME
  }LoadCompleteEvent`;

  private progress: number;
  private graphics: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.Text;

  constructor() {
    super(PreloadScene.NAME);
    this.progress = 0;
  }

  public preload(): void {
    this.createGraphics();
    this.createText();
  }

  public create(): void {
    this.onProgress(1);
  }

  private onProgress(progress: number): void {
    this.tweens.add({
      targets: this,
      progress,
      duration: 200,
      onUpdate: () => {
        this.graphics.clear();
        this.graphics.fillStyle(0x15e2ff);
        this.graphics.fillRect(
          gameConfig.canvasWidth * 0.1,
          gameConfig.canvasHeight / 2,
          gameConfig.canvasWidth * 0.8 * this.progress,
          gameConfig.canvasHeight * 0.01,
        );
      },
      onComplete: () => {
        if (progress !== 1) {
          return;
        }
        this.events.emit(PreloadScene.LOAD_COMPLETE_EVENT);
      },
    });
  }

  private createGraphics(): void {
    this.graphics = this.add.graphics({});
  }

  private createText(): void {
    this.text = this.add.text(
      gameConfig.canvasWidth / 2,
      gameConfig.canvasHeight * 0.6,
      'Loading',
    );
    this.text.setOrigin(0.5);
  }
}
