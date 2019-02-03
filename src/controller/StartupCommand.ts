import { AsyncMacroCommand, SimpleCommand } from '@planet221b/pure-mvc';
import { FB_INSTANT_COLLECTION_NAME, OK_INSTANT_COLLECTION_NAME } from '../constants/Constants';
import GameFacade from '../GameFacade';
import PlayerVOProxy from '../model/PlayerVOProxy';
import FBInstantWrapper from '../utils/FBInstantWrapper';
import OKInstantWrapper from '../utils/OKInstantWrapper';
import RegisterAdsCommands from './RegisterAdsCommands';
import RegisterGameCommands from './RegisterGameCommands';
import RegisterPlayerCommands from './RegisterPlayerCommands';

export default class StartupCommand extends AsyncMacroCommand<SimpleCommand> {
  public async execute(notificationName: string): Promise<void> {
    // const url: string = window.location.href;
    // const okIndex: number = url.indexOf('ok');
    // const fbIndex: number = url.indexOf('facebook');
    // const fbInstantIndex: number = url.indexOf('fb');
    // const messangerIndex: number = url.indexOf('messanger');
    // if (okIndex !== -1) {
    //   PlayerVOProxy.platform = platform.OK;
    // } else if (
    //   fbIndex !== -1 ||
    //   messangerIndex !== -1 ||
    //   fbInstantIndex !== -1
    // ) {
    //   PlayerVOProxy.platform = platform.FB;
    // }
    // let data: IUserData;
    // switch (PlayerVOProxy.platform) {
    //   case platform.OK:
    //     data = await this.initOK();
    //     break;
    //   case platform.FB:
    //     data = await this.initFB();
    //     break;
    //   default:
    //     PlayerVOProxy.platform = platform.MOBILE;
    //     throw 'platform not instant';
    // }
    // this.startProxyInitialization(data);
    super.execute(notificationName);
  }

  public initializeMacroCommand(): void {
    this.addSubCommand(RegisterGameCommands);
    this.addSubCommand(RegisterPlayerCommands);
    this.addSubCommand(RegisterAdsCommands);
  }

  private async initOK(): Promise<any> {
    await OKInstantWrapper.initializeAsync();
    this.sendNotification(GameFacade.OK_INSTANT_INITIALIZE_SUCCESS);
    PlayerVOProxy.COLLECTION_NAME = OK_INSTANT_COLLECTION_NAME;
    const data: IUserData = {
      id: await OKInstantWrapper.playerGetID(),
      name: await OKInstantWrapper.playerGetName(),
    };
    return data;
  }
  private async initFB(): Promise<any> {
    await FBInstantWrapper.initializeAsync();
    FBInstantWrapper.setLoadingProgress(100);
    await FBInstantWrapper.startGameAsync();
    PlayerVOProxy.COLLECTION_NAME = FB_INSTANT_COLLECTION_NAME;
    this.sendNotification(GameFacade.FB_INSTANT_INITIALIZE_SUCCESS);
    const data: IUserData = {
      id: FBInstantWrapper.playerGetID(),
      name: FBInstantWrapper.playerGetName(),
    };
    return data;
  }

  private startProxyInitialization(data: IUserData): void {
    // this.facade.registerProxy(new PlayerVOProxy(data.name, data.id));
    // this.facade.registerProxy(new GameVOProxy());
  }
}

interface IUserData {
  id: number;
  name: string;
}
