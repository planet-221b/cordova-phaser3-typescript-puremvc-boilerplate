import { Mediator } from '@planet221b/pure-mvc';
import Game from '../../Game';
import { wait } from '../../utils/Utils';
import PopupManager from '../utils/PopupManager';
import StandardPopup, { SHOW_TWEEN_DURATION } from './StandardPopup';

export default abstract class StandardPopupMediator<
  T extends StandardPopup
> extends Mediator<T> {
  private popupManager: PopupManager<T>;

  constructor(name: string, viewComponent: T) {
    super(name, viewComponent);
    this.addViewComponentListeners();
    this.popupManager = PopupManager.instance;
  }

  public handleNotification(notificationName: string): void {
    switch (notificationName) {
      default:
        console.warn(`${notificationName} is unhandled!`);
        break;
    }
  }

  protected showView(x: number, y: number, ...args: any[]): void {
    if (this.popupManager.currentShownPopup === this.viewComponent) {
      return;
    }
    this.popupManager.show(this.viewComponent, x, y, ...args);
  }
  protected hideView(actionId?: number): void {
    this.popupManager.hide(this.viewComponent, actionId);
  }
  protected async addToQueue(
    x: number,
    y: number,
    ...args: any[]
  ): Promise<void> {
    await wait(SHOW_TWEEN_DURATION);
    this.popupManager.addToQueue(this.viewComponent, x, y, ...args);
  }
  protected removeFromQueue(...args: any[]): void {
    this.popupManager.removeFromQueue(this.viewComponent, ...args);
  }

  protected onAction(actionId?: number, ...args: any[]): void {
    this.hideView(actionId);
  }

  protected onViewShow(backgroundBlurEnabled: boolean = false): void {
    this.sendNotification(
      (this.viewComponent.constructor as any).SHOW_START_NOTIFICATION,
      this.viewComponent,
    );
    this.sendNotification(
      StandardPopup.SHOW_START_NOTIFICATION,
      backgroundBlurEnabled,
      this.viewComponent,
    );
  }
  protected onViewShowComplete(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any).SHOW_COMPLETE_NOTIFICATION,
    );
    this.sendNotification(StandardPopup.SHOW_COMPLETE_NOTIFICATION);
  }
  protected onViewHide(): void {
    this.sendNotification(
      (this.viewComponent.constructor as any).HIDE_START_NOTIFICATION,
    );
    this.sendNotification(StandardPopup.HIDE_START_NOTIFICATION);
  }
  protected onViewHideComplete(actionId?: number): void {
    actionId;
    this.popupManager.popupHideComplete();
    this.sendNotification(
      (this.viewComponent.constructor as any).HIDE_COMPLETE_NOTIFICATION,
    );
    this.sendNotification(StandardPopup.HIDE_COMPLETE_NOTIFICATION);
  }

  protected addViewComponentListeners(): void {
    this.viewComponent.on(
      StandardPopup.SHOW_START_EVENT,
      this.onViewShow,
      this,
    );
    this.viewComponent.on(
      StandardPopup.SHOW_COMPLETE_EVENT,
      this.onViewShowComplete,
      this,
    );
    this.viewComponent.on(
      StandardPopup.HIDE_START_EVENT,
      this.onViewHide,
      this,
    );
    this.viewComponent.on(
      StandardPopup.HIDE_COMPLETE_EVENT,
      this.onViewHideComplete,
      this,
    );
    this.viewComponent.on(StandardPopup.ACTION_EVENT, this.onAction, this);
  }

  get game(): Game {
    return (window as any).game as Game;
  }
}
