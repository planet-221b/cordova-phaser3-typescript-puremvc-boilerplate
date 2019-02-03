import StandardPopup from '../popups/StandardPopup';
import PopupManager from '../utils/PopupManager';
import BaseSceneMediator from './BaseSceneMediator';
import PopupScene from './PopupScene';
import PreloadScene from './PreloadScene';

export default class PopupSceneMediator extends BaseSceneMediator<PopupScene> {
  public static NAME: string = 'PopupSceneMediator';
  private popupManager: PopupManager<any>;

  constructor(viewComponent?: PopupScene) {
    super(PopupSceneMediator.NAME, viewComponent);
    this.popupManager = PopupManager.instance;
  }

  public registerNotificationInterests(): void {
    this.subscribeToNotifications(
      PreloadScene.LOAD_COMPLETE_NOTIFICATION,
      StandardPopup.SHOW_START_NOTIFICATION,
      StandardPopup.HIDE_COMPLETE_NOTIFICATION,
    );
  }

  public handleNotification(notificationName: string, ...args: any[]): void {
    switch (notificationName) {
      case PreloadScene.LOAD_COMPLETE_NOTIFICATION:
        this.registerGamePopups();
        break;
      case StandardPopup.SHOW_START_NOTIFICATION:
        this.updateLanguage();
        if (this.game.scene.isSleeping(PopupScene.NAME)) {
          this.game.scene.wake(PopupScene.NAME);
        }
        this.viewComponent.addPopup(args[1]);
        this.game.scene.bringToTop(PopupScene.NAME);
        break;
      case StandardPopup.HIDE_COMPLETE_NOTIFICATION:
        this.viewComponent.removePopup();
        if (!this.popupManager.hasQueue) {
          this.game.scene.sleep(PopupScene.NAME);
        }
        break;
      default:
        console.warn(`${notificationName} is unhandled!`);
        break;
    }
  }

  public onRemove(): void {
    super.onRemove();
  }

  public onSceneReady(): void {
    super.onSceneReady();
  }

  public onSceneWake(): void {
    super.onSceneWake();
    this.game.scene.bringToTop(PopupScene.NAME);
  }

  protected setView(): void {
    const popupScene: PopupScene = new PopupScene();
    this.game.scene.add(PopupScene.NAME, popupScene);
    this.setViewComponent(popupScene);
    this.game.scene.start(PopupScene.NAME);
    this.game.scene.sleep(PopupScene.NAME);
  }

  private registerGamePopups(): void {
    this.sendNotification(PopupScene.REGISTERED);
  }
}
