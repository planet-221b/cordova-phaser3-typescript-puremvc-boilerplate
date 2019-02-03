import { Proxy } from '@planet221b/pure-mvc';
import { platform } from '../constants/Constants';
import { getFSDataAsync, setFSDataAsync } from '../utils/Utils';
import PlayerVO from './vo/PlayerVO';

export default class PlayerVOProxy extends Proxy<PlayerVO> {
  public static platform: platform;
  public static NAME: string = 'PlayerVOProxy';
  public static COLLECTION_NAME: string;
  public static INITIALIZE_SUCCESS: string = `${
    PlayerVOProxy.NAME
  }InitializeSuccess`;
  public static INITIALIZE_FAIL: string = `${PlayerVOProxy.NAME}InitializeFail`;
  public static START_NEW_LEVEL: string = `${PlayerVOProxy.NAME}StartNewLevel`;
  public static SAVE_SUCCESS: string = `${PlayerVOProxy.NAME}SaveSuccess`;
  public static SAVE_FAIL: string = `${PlayerVOProxy.NAME}SaveFail`;
  public static SYNC_SUCCESS: string = `${PlayerVOProxy.NAME}SyncSuccess`;
  public static LEVEL_DATA_UPDATED: string = `${
    PlayerVOProxy.NAME
  }LevelDataUpdated`;
  public static SETTINGS_CHANGED: string = `${
    PlayerVOProxy.NAME
  }SettingsChagned`;
  public static UPDATE_SOUND_STATES: string = `${
    PlayerVOProxy.NAME
  }UpdateSoundStates`;

  constructor(name: string, id: number) {
    super(PlayerVOProxy.NAME, new PlayerVO(name, id));
    this.init();
  }
  public async save(): Promise<void> {
    try {
      await setFSDataAsync(`${PlayerVOProxy.COLLECTION_NAME}/${this.vo.id}`, {
        name: this.vo.name,
        settings: this.vo.settings,
      });
      this.sendNotification(PlayerVOProxy.SAVE_SUCCESS);
    } catch (error) {
      this.sendNotification(PlayerVOProxy.SAVE_FAIL);
    }
  }

  private async init(): Promise<void> {
    try {
      const json: any = await this.authenticate();
      if (json) {
        this.sync(json);
      }
      this.sendNotification(PlayerVOProxy.INITIALIZE_SUCCESS);
      this.sendNotification(PlayerVOProxy.UPDATE_SOUND_STATES);
    } catch (error) {
      console.log(error);
      this.sendNotification(PlayerVOProxy.INITIALIZE_FAIL);
    }
  }

  private sync(data: any): void {
    for (const propertyName in data) {
      if (
        this.vo.hasOwnProperty(`_${propertyName}`) ||
        this.vo.hasOwnProperty(propertyName)
      ) {
        (this.vo as any)[propertyName] = data[propertyName];
      }
    }
    this.sendNotification(PlayerVOProxy.SYNC_SUCCESS);
  }

  private async authenticate(): Promise<any> {
    try {
      const doc: any = await getFSDataAsync(
        `${PlayerVOProxy.COLLECTION_NAME}/${this.vo.id}`,
      );
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error(error);
    }
  }

  get vo(): PlayerVO {
    return this.getData();
  }

  set vo(value: PlayerVO) {
    this.setData(value);
  }
}
