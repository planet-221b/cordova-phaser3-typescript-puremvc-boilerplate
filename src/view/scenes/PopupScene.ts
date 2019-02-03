import { gameConfig } from '../../constants/GameConfig';
import StandardPopup from '../popups/StandardPopup';
import BaseScene from './BaseScene';

export default class PopupScene extends BaseScene {
  public static NAME: string = 'PopupScene';
  public static REGISTERED: string = `${PopupScene.NAME}Registered`;

  public popupCamera: Phaser.Cameras.Scene2D.Camera;
  private currentPopup: any;
  constructor() {
    super(PopupScene.NAME);
  }

  public create(): void {
    this.popupCamera = this.cameras.add(
      0,
      0,
      gameConfig.canvasWidth,
      gameConfig.canvasHeight,
    );
    this.popupCamera.setZoom(gameConfig.scaleMultiplier);
  }

  public addPopup(popup: StandardPopup): void {
    this.currentPopup = popup;
    this.currentPopup.setVisible(true);
    this.mainCamera.ignore(this.currentPopup);
  }

  public removePopup(): void {
    this.currentPopup.setVisible(false);
  }

  get mainCamera(): Phaser.Cameras.Scene2D.Camera {
    return this.cameras.main;
  }
}
