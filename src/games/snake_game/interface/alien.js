import { AssetType } from "./assets";
import { AnimationType } from "./factory/animation-factory";
import Phaser from "phaser";

export class Alien extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, AssetType.Alien);
  }

  kill(explosion) {
    if (explosion) {
      explosion.setX(this.x);
      explosion.setY(this.y);
      explosion.play(AnimationType.Kaboom);
      this.scene.optionsScene.enemyExplotion.play();
    }
    this.destroy();
  }
}
