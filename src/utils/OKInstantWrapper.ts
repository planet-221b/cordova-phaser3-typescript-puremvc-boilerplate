declare let OKSDK: any;
const OkConfig: {
  app_id: number;
  app_key: string;
  app_secret_key: string;
} = {
  app_id: 0,
  app_key: 'short_string',
  app_secret_key: 'long_string',
};
export default class OKInstantWrapper {
  public static async initializeAsync(): Promise<void> {
    await OKSDK.init(OkConfig);
  }

  public static async playerGetName(): Promise<any> {
    await OKSDK.REST.call(
      'users.getCurrentUser',
      { fields: 'NAME' },
      (status: string, data: any) => {
        status;
        return data.name;
      },
    );
  }

  public static async playerGetID(): Promise<any> {
    await OKSDK.REST.call(
      'users.getCurrentUser',
      { fields: 'UID' },
      (status: string, data: any) => {
        status;
        return data.uid;
      },
    );
  }
}
