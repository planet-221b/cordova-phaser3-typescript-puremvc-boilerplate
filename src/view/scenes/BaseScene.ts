import { I18nPlugin, Ii18nAdapter } from '@koreez/phaser3-i18n';
import { INinePatchCreator, INinePatchFactory } from '@koreez/phaser3-ninepatch';
import { gameConfig } from '../../constants/GameConfig';
import FadeScene from './FadeScene';

export default class BaseScene extends Phaser.Scene {
  public add: INinePatchFactory;
  public make: INinePatchCreator;
  public sys: Phaser.Scenes.Systems & IPluginSystems;
  public i18n: Ii18nAdapter;

  constructor(name: string) {
    super(name);
    (this.constructor as any)['START'] = `${name}StartNotification`;
    (this.constructor as any)['READY'] = `${name}ReadyNotification`;
    (this.constructor as any)['PREUPDATE'] = `${name}PreupdateNotification`;
    (this.constructor as any)['UPDATE'] = `${name}UpdateNotification`;
    (this.constructor as any)['POSTUPDATE'] = `${name}PostupdateNotification`;
    (this.constructor as any)['RESIZE'] = `${name}ResizeNotification`;
    (this.constructor as any)['PAUSE'] = `${name}PauseNotification`;
    (this.constructor as any)['RESUME'] = `${name}ResumeNotification`;
    (this.constructor as any)['SLEEP'] = `${name}SleepNotification`;
    (this.constructor as any)['WAKE'] = `${name}WakeNotification`;
    (this.constructor as any)[
      'TRANSITION_INIT'
    ] = `${name}TransitionInitNotification`;
    (this.constructor as any)[
      'TRANSITION_COMPLETE'
    ] = `${name}TransitionCompleteNotification`;
    (this.constructor as any)[
      'TRANSITION_OUT'
    ] = `${name}TransitionOutNotification`;
    (this.constructor as any)['SHUTDOWN'] = `${name}ShutdownNotification`;
    (this.constructor as any)['DESTROY'] = `${name}DestroyNotification`;
  }

  public playSFX(name: string): void {
    this.fadeScene.events.emit(FadeScene.PLAY_SFX_EVENT, name);
  }

  public init(): void {
    this.input.topOnly = true;
  }

  public updateLanguage(lang: string): void {
    this.i18n.changeLanguage(lang);
  }

  get fadeScene(): FadeScene {
    return this.scene.get(FadeScene.NAME) as FadeScene;
  }

  get width(): number {
    return gameConfig.canvasWidth as number;
  }

  get height(): number {
    return gameConfig.canvasHeight as number;
  }
}
export interface IPluginSystems {
  i18n: I18nPlugin;
  install: (name: string) => {};
}
