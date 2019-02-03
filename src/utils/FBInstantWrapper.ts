declare let FBInstant: any;
export default class FBInstantWrapper {
  public static _startGameAsyncHasResolved: boolean = false;

  public static async playerGetDataAsync(keys: any): Promise<void> {
    const data: any = await FBInstant.player.getDataAsync(keys);
    return data;
  }

  public static async initializeAsync(): Promise<void> {
    await FBInstant.initializeAsync();
  }

  public static setLoadingProgress(progress: number): void {
    FBInstant.setLoadingProgress(progress);
  }

  public static getSupportedAPIs(): any {
    return FBInstant.getSupportedAPIs();
  }

  public static getSDKVersion(): any {
    return FBInstant.getSDKVersion();
  }

  public static playerGetID(): any {
    return FBInstant.player.getID();
  }

  public static async getSignedPlayerInfoAsync(
    requestPayload: any,
  ): Promise<void> {
    const result: Promise<
      any
    > = await FBInstant.player.getSignedPlayerInfoAsync(requestPayload);
    return result;
  }

  public static async startGameAsync(): Promise<void> {
    await FBInstant.startGameAsync();
    this._startGameAsyncHasResolved = true;
  }

  /* here goes methods to call after startGameAsync has resolved */
  public static async playerSetDataAsync(data: any): Promise<void> {
    this.checkForStartGameAsyncHasResolved(`FBInstant.player.setDataAsync`);
    await FBInstant.player.setDataAsync(data);
  }

  public static async shareAsync(shareData: any): Promise<void> {
    this.checkForStartGameAsyncHasResolved(`FBInstant.shareAsync`);
    await FBInstant.shareAsync(shareData);
  }

  public static async updateAsync(payload: any): Promise<void> {
    this.checkForStartGameAsyncHasResolved(`FBInstant.updateAsync`);
    await FBInstant.updateAsync(payload);
  }

  public static getLocale(): any {
    this.checkForStartGameAsyncHasResolved(`FBInstant.getLocale`);
    return FBInstant.getLocale();
  }

  public static playerGetName(): any {
    this.checkForStartGameAsyncHasResolved(`FBInstant.player.getName`);
    return FBInstant.player.getName();
  }

  public static playerGetPhoto(): any {
    this.checkForStartGameAsyncHasResolved(`FBInstant.player.getPhoto`);
    return FBInstant.player.getPhoto();
  }

  public static async playerGetConnectedPlayersAsync(): Promise<void> {
    this.checkForStartGameAsyncHasResolved(
      `FBInstant.player.getConnectedPlayersAsync`,
    );
    const players: any = await FBInstant.player.getConnectedPlayersAsync();
    return players;
  }

  public static contextGetID(): any {
    this.checkForStartGameAsyncHasResolved(`FBInstant.context.getID`);
    return FBInstant.context.getID();
  }

  public static async contextChooseAsync(options: any): Promise<void> {
    this.checkForStartGameAsyncHasResolved(`FBInstant.context.chooseAsync`);
    await FBInstant.context.chooseAsync(options);
  }

  public static async contextSwitchAsync(id: any): Promise<void> {
    this.checkForStartGameAsyncHasResolved(`FBInstant.context.switchAsync`);
    await FBInstant.context.switchAsync(id);
  }

  public static async contextCreateAsync(playerID: any): Promise<void> {
    this.checkForStartGameAsyncHasResolved(`FBInstant.context.createAsync`);
    await FBInstant.context.createAsync(playerID);
  }

  public static checkForStartGameAsyncHasResolved(methodName: string): void {
    if (!this._startGameAsyncHasResolved) {
      throw new Error(
        `Call to ${methodName} forbidden before FBInstant.startGameAsync() has resolved`,
      );
    }
  }

  public static async setScoreToLeaderboardAsync(
    leaderBoardName: string,
    value: any,
    data: any,
  ): Promise<void> {
    const id: any = FBInstant.context.getID();
    const leaderBoard: any = await FBInstant.getLeaderboardAsync(
      `${leaderBoardName}${id}`,
    );
    console.warn(leaderBoard.getName());
    return leaderBoard.setScoreAsync(value, JSON.stringify(data));
  }
  public static async getLeaderboardAsync(
    leaderBoardName: string,
  ): Promise<void> {
    const id: any = FBInstant.context.getID();
    const leaderBoard: any = await FBInstant.getLeaderboardAsync(
      `${leaderBoardName}${id}`,
    );
    const entries: any = await leaderBoard.getEntriesAsync(10, 0);
    for (const entry of entries) {
      console.warn(
        entry.getRank() +
          '. ' +
          entry.getPlayer().getName() +
          ': ' +
          entry.getScore(),
      );
    }
  }
}
