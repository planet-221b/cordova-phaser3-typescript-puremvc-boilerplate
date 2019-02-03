import { Proxy } from '@planet221b/pure-mvc';
import GameVO from './vo/GameVO';

export default class GameVOProxy extends Proxy<GameVO> {
  public static NAME: string = 'GameVOProxy';
  constructor() {
    super(GameVOProxy.NAME, new GameVO());
  }

  get vo(): GameVO {
    return this.getData();
  }

  set vo(value: GameVO) {
    this.setData(value);
  }
}
