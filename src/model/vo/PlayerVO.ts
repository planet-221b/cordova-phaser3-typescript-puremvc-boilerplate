export enum setting {
  MUSIC,
  SOUND,
  LANGUAGE,
}

export default class PlayerVO {
  public id: number;
  public name: string;
  public settings: ISettings;

  constructor(name: string, id: number) {
    this.id = id;
    this.name = name;
    const lang: string = window.navigator.language;
    const langCode: string = lang.substr(0, lang.indexOf('-'));
    this.settings = {
      music: true,
      sound: true,
      lang: langCode,
    };
  }
}

export interface ISettings {
  music: boolean;
  sound: boolean;
  lang: string;
}
