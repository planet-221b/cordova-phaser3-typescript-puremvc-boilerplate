declare class AndroidFullScreen {
  public static SYSTEM_UI_FLAG_FULLSCREEN: number;
  public static SYSTEM_UI_FLAG_HIDE_NAVIGATION: number;
  public static SYSTEM_UI_FLAG_IMMERSIVE: number;
  public static SYSTEM_UI_FLAG_IMMERSIVE_STICKY: number;
  public static SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN: number;
  public static SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION: number;
  public static SYSTEM_UI_FLAG_LAYOUT_STABLE: number;
  public static SYSTEM_UI_FLAG_LIGHT_STATUS_BAR: number;
  public static SYSTEM_UI_FLAG_LOW_PROFILE: number;
  public static SYSTEM_UI_FLAG_VISIBLE: number;

  public static isSupported(success?: Function, error?: Function): void;
  public static immersiveMode(success?: Function, error?: Function): void;
}

interface Window {
  AndroidFullScreen: AndroidFullScreen;
}
