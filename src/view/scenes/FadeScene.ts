import { Audios } from '../../assets';
import { gameConfig } from '../../constants/GameConfig';
import { loadAudios } from '../utils/assetLoader';

export default class FadeScene extends Phaser.Scene {
  public static NAME: string = 'FadeScene';
  public static PLAY_SFX_EVENT: string = 'playSFX';
  private sfxManager: Phaser.Sound.WebAudioSoundManager;
  private graphics: Phaser.GameObjects.Graphics;

  constructor() {
    super(FadeScene.NAME);
  }

  public preload(): void {
    loadAudios(this, Audios);
  }

  public create(): void {
    this.graphics = this.add.graphics({});
    this.sfxManager = new Phaser.Sound.WebAudioSoundManager(this.game);
    this.sfxManager.volume = 0.6;
  }

  public async screenFadeOut(
    color: number,
    duration: number,
    delay?: number,
  ): Promise<void> {
    return new Promise<void>(
      (resolve: (value?: void | PromiseLike<void>) => void) => {
        this.graphics.clear();
        this.scene.bringToTop(FadeScene.NAME);
        this.graphics.fillStyle(color);
        this.graphics.alpha = 0;
        this.graphics.fillRect(
          0,
          0,
          gameConfig.canvasWidth as number,
          gameConfig.canvasHeight as number,
        );
        this.tweens.killTweensOf(this.graphics);
        this.tweens.add({
          targets: this.graphics,
          alpha: 1,
          duration,
          delay,
          onComplete: () => {
            resolve();
          },
        });
      },
    );
  }

  public async screenFadein(duration: number, delay?: number): Promise<void> {
    return new Promise<void>(
      (resolve: (value?: void | PromiseLike<void>) => void) => {
        if (this.graphics.alpha !== 1) {
          resolve();
          return;
        }
        this.scene.bringToTop(FadeScene.NAME);
        this.tweens.killTweensOf(this.graphics);
        this.tweens.add({
          targets: this.graphics,
          alpha: 0,
          duration,
          delay,
          onComplete: () => {
            this.graphics.clear();
            resolve();
          },
        });
      },
    );
  }

  // public setBackgroundMusicState(enabled: boolean): void {
  //   enabled ? this.playMusic() : this.stopMusic();
  // }

  // public playMusic(): void {
  //   if (this.music.isPlaying) {
  //     return;
  //   }
  //   this.music.play();
  // }

  // public stopMusic(): void {
  //   this.music.stop();
  // }

  public playSFX(sfxName: string): void {
    this.sfxManager.play(sfxName);
  }
}
