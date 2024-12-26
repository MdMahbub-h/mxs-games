import { AssetType } from "./assets";
import Phaser from "phaser";

export class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, AssetType.EnemyBullet);
  }

  kill() {
    this.destroy();
  }
}
