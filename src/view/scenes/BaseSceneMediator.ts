import { Mediator } from '@planet221b/pure-mvc';
import Game from '../../Game';
import PlayerVOProxy from '../../model/PlayerVOProxy';
import BaseScene from './BaseScene';

export default abstract class BaseSceneMediator<
  T extends BaseScene
> extends Mediator<T> {
  constructor(name: string, viewComponent: T) {
    super(name, viewComponent);

    if (this.viewComponent) {
      this.registerEvents();
    }
  }

  public registerNotificationInterests(): void {
    //
  }

  public setViewComponent(viewComponent: T): void {
    super.setViewComponent(viewComponent);
    this.setViewComponentListeners();
    this.registerEvents();
  }

  public onRegister(): void {
    this.setView();
    super.onRegister();
  }

  protected setView(): void {
    //
  }

  protected setViewComponentListeners(): void {
    //
  }

  protected registerEvents(): void {
    this.viewComponent.sys.events.on('start', this.onSceneStart, this);
    this.viewComponent.sys.events.on('ready', this.onSceneReady, this);
    this.viewComponent.sys.events.on('resize', this.onSceneResize, this);
    this.viewComponent.sys.events.on('pause', this.onScenePause, this);
    this.viewComponent.sys.events.on('resume', this.onSceneResume, this);
    this.viewComponent.sys.events.on('sleep', this.onSceneSleep, this);
    this.viewComponent.sys.events.on('wake', this.onSceneWake, this);
    this.viewComponent.sys.events.on(
      'transitioninit',
      this.onSceneTransitionInit,
      this,
    );
    this.viewComponent.sys.events.on(
      'transitioncomplete',
      this.onSceneTransitionComplete,
      this,
    );
    this.viewComponent.sys.events.on(
      'transitionout',
      this.onSceneTransitionOut,
      this,
    );
    this.viewComponent.sys.events.on('shutdown', this.onSceneShutdown, this);
    this.viewComponent.sys.events.on('destroy', this.onSceneDestroy, this);
  }

  protected registerPreupdateEvent(): void {
    this.viewComponent.sys.events.on('preupdate', this.onScenePreupdate, this);
  }

  protected registerUpdateEvent(): void {
    this.viewComponent.sys.events.on('update', this.onSceneUpdate, this);
  }

  protected registerPostupdateEvent(): void {
    this.viewComponent.sys.events.on(
      'postupdate',
      this.onScenePostupdate,
      this,
    );
  }

  protected updateLanguage(): void {
    const playerVOProxy: PlayerVOProxy = this.facade.retrieveProxy(
      PlayerVOProxy.NAME,
    );
    if (playerVOProxy) {
      this.viewComponent.updateLanguage(playerVOProxy.vo.settings.lang);
    }
  }

  protected onSceneStart(): void {
    this.sendNotification((this.viewComponent.constructor as any)['START']);
  }

  protected onSceneReady(): void {
    this.sendNotification((this.viewComponent.constructor as any)['READY']);
  }

  protected onScenePreupdate(): void {
    this.sendNotification((this.viewComponent.constructor as any)['PREUPDATE']);
  }

  protected onSceneUpdate(): void {
    this.sendNotification((this.viewComponent.constructor as any)['UPDATE']);
  }

  protected onScenePostupdate(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['POSTUPDATE'],
    );
  }

  protected onSceneResize(): void {
    this.sendNotification((this.viewComponent.constructor as any)['RESIZE']);
  }

  protected onScenePause(): void {
    this.sendNotification((this.viewComponent.constructor as any)['PAUSE']);
  }

  protected onSceneResume(): void {
    this.sendNotification((this.viewComponent.constructor as any)['RESUME']);
  }

  protected onSceneSleep(): void {
    this.sendNotification((this.viewComponent.constructor as any)['SLEEP']);
  }

  protected onSceneWake(): void {
    this.sendNotification((this.viewComponent.constructor as any)['WAKE']);
  }

  protected onSceneTransitionInit(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['TRANSITION_INIT'],
    );
  }

  protected onSceneTransitionComplete(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['TRANSITION_COMPLETE'],
    );
  }

  protected onSceneTransitionOut(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any)['TRANSITION_OUT'],
    );
  }

  protected onSceneShutdown(): void {
    this.sendNotification((this.viewComponent.constructor as any)['SHUTDOWN']);
  }

  protected onSceneDestroy(): void {
    this.sendNotification((this.viewComponent.constructor as any)['DESTROY']);
  }

  get game(): Game {
    return (window as any).game as Game;
  }

  get scene(): Phaser.Scenes.SceneManager {
    return this.game.scene;
  }
}
