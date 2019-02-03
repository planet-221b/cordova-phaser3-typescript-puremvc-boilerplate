import StandardPopup from '../popups/StandardPopup';

export default class PopupManager<T extends StandardPopup> {
  public currentShownPopup: StandardPopup;
  private static _instance: PopupManager<StandardPopup>;
  private queue: any[] = [];

  public static get instance(): PopupManager<StandardPopup> {
    return this._instance || (this._instance = new this());
  }

  public addToQueue(popup: T, x: number, y: number, ...args: any[]): void {
    this.queue.push({
      _popup: popup,
      _x: x,
      _y: y,
      _args: args,
    });
  }

  public removeFromQueue(popup: T, ...args: any[]): void {
    const target: any = this.queue.filter((queueData: any) => {
      return (
        queueData._popup === popup && (args ? queueData._args === args : true)
      );
    })[0];
    this.queue.splice(this.queue.indexOf(target), 1);
  }

  public show(popup: T, x: number, y: number, ...args: any[]): void {
    this.queue.push({
      _popup: popup,
      _x: x,
      _y: y,
      _args: args,
    });
    if (this.queue.length === 1) {
      this.internalShow();
    }
  }

  public hide(popup: T, actionId?: number): void {
    popup.hide(actionId);
  }

  public popupHideComplete(): void {
    this.queue.shift();
    this.currentShownPopup = null;
    if (this.hasQueue) {
      this.internalShow();
    }
  }

  private internalShow(): void {
    const { _popup, _x, _y, _args } = this.queue[0];
    this.currentShownPopup = _popup;
    _popup.show(_x, _y, ..._args);
  }

  get hasQueue(): boolean {
    return !!this.queue.length;
  }
}
