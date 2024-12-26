import { AssetType, SoundType } from "./assets";
import Phaser from "phaser";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, AssetType.Bullet);
  }

  shoot(x, y) {
    this.scene.optionsScene.launchBullet.play();
    this.setPosition(x, y);
    this.setVelocityY(-400);
  }

  kill() {
    this.destroy();
  }
}
