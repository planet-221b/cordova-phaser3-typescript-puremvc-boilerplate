import { Facade } from '@planet221b/pure-mvc';
import firebase from 'firebase/app';
import 'firebase/firestore';
import GameFacade from './GameFacade';

export default class Game extends Phaser.Game {
  public static NAME: string = 'GAME NAME';

  constructor(config: GameConfig) {
    super(config);
    window.onresize = this.resize.bind(this);
    GameFacade.game = this;
    Facade.getInstance = GameFacade.getInstance;
    Facade.getInstance(Game.NAME);
    this.resize();
    // this.initFirebase();
  }
  public resize(): void {
    const { width, height } = this.config as any;

    const scale: { x: number; y: number } = {
      x: (window.innerWidth || width) / width,
      y: (window.innerHeight || height) / height,
    };
    if (!window.cordova) {
      const browserScale: number = Math.min(
        window.innerHeight / height,
        window.innerWidth / width,
      );
      scale.x = scale.y = browserScale;
    }
    this.canvas.style.position = 'absolute';
    this.canvas.style.width = width * scale.x + 'px';
    this.canvas.style.height = height * scale.y + 'px';
    this.canvas.style.left = (window.innerWidth - width * scale.x) * 0.5 + 'px';
    this.canvas.style.top =
      (window.innerHeight - height * scale.y) * 0.5 + 'px';
  }
  private async initFirebase(): Promise<void> {
    await firebase.initializeApp({
      apiKey: '',
      authDomain: '',
      projectId: '',
    });
  }
}
