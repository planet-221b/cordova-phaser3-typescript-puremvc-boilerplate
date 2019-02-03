import { SimpleCommand, SyncMacroCommand } from '@planet221b/pure-mvc';

export default class RegisterGameCommands extends SyncMacroCommand<
  SimpleCommand
> {
  public execute(): void {}
}
