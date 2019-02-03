import PlayerCommand from './PlayerCommand';

export default class SavePlayerDataCommand extends PlayerCommand {
  public execute(): void {
    this.proxy.save();
  }
}
