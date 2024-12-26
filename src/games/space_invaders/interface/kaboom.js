import { AssetType } from "./assets";
import Phaser from "phaser";

export class Kaboom extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, AssetType.Kaboom);
  }
}
