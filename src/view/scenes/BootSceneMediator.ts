import GameFacade from '../../GameFacade';
import BaseSceneMediator from './BaseSceneMediator';
import BootScene from './BootScene';

export default class BootSceneMediator extends BaseSceneMediator<BootScene> {
  public static NAME: string = 'BootSceneMediator';

  constructor() {
    super(BootSceneMediator.NAME, null);
  }

  public registerNotificationInterests(): void {
    this.subscribeToNotifications(GameFacade.STARTUP);
  }

  public handleNotification(notificationName: string): void {
    switch (notificationName) {
      case GameFacade.STARTUP:
        break;
      default:
        console.warn(`${notificationName} is unhandled!`);
        break;
    }
  }

  protected onSceneDestroy(): void {
    super.onSceneDestroy();
    this.facade.removeMediator(BootSceneMediator.NAME);
  }

  protected setView(): void {
    const bootScene: BootScene = new BootScene();
    this.scene.add(BootScene.NAME, bootScene);
    this.setViewComponent(bootScene);
    this.viewComponent.sys.events.on(
      BootScene.LOAD_COMPLETE_EVENT,
      this.onLoadComplete,
      this,
    );
    this.scene.start(BootScene.NAME);
    super.setView();
  }

  private async onLoadComplete(): Promise<void> {
    this.facade.sendNotification(BootScene.LOAD_COMPLETE_NOTIFICATION);
    this.scene.stop(BootScene.NAME);
  }
}
