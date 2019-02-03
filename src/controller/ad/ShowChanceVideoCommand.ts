import AdCommand from './AdCommand';

export default class ShowChanceVideoCommand extends AdCommand {
  public static NAME: string = 'ShowChanceVideoCommand';
  public static SUCCESS: string = `${ShowChanceVideoCommand.NAME}Success`;
  public static FAILED: string = `${ShowChanceVideoCommand.NAME}Failed`;
  public execute(notificationName: string, type: string, amount: number): void {
    notificationName;
    this.sendNotification(ShowChanceVideoCommand.SUCCESS, type, amount);
  }
}
