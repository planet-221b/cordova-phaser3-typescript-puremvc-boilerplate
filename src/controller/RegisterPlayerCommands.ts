import { SimpleCommand, SyncMacroCommand } from '@planet221b/pure-mvc';
import PlayerVOProxy from '../model/PlayerVOProxy';
import SavePlayerDataCommand from './player/SavePlayerDataCommand';

export default class RegisterPlayerCommands extends SyncMacroCommand<
  SimpleCommand
> {
  public execute(): void {
    this.facade.registerCommand(
      PlayerVOProxy.INITIALIZE_SUCCESS,
      SavePlayerDataCommand,
    );
  }
}
