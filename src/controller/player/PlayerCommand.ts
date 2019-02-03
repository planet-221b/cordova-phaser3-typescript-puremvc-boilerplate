import { SimpleCommand } from '@planet221b/pure-mvc';
import PlayerVOProxy from '../../model/PlayerVOProxy';

export default class PlayerCommand extends SimpleCommand {
  public execute(notificationName?: string, ...args: any[]): void {
    notificationName;
    args;
  }
  get proxy(): PlayerVOProxy {
    return this.facade.retrieveProxy(PlayerVOProxy.NAME);
  }
}
