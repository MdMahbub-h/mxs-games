import { Alien } from "../alien";
import { AnimationType } from "../factory/animation-factory";
import Phaser from "phaser";

export class AlienManager {
  aliens;
  get hasAliveAliens() {
    return !!this.aliens.children.size;
  }

  constructor(_scene) {
    this._scene = _scene;
    this.aliens = this._scene.physics.add.group({
      maxSize: 40,
      classType: Alien,
      runChildUpdate: true,
    });
    this.aliens.setOrigin(0, 0);
    this._sortAliens();
    this._animate();
  }

  getRandomAliveEnemy() {
    let random = Phaser.Math.RND.integerInRange(1, this.aliens.children.size);
    let aliens = this.aliens.children.getArray();
    return aliens[random];
  }

  reset() {
    this._sortAliens();
    this._animate();
  }

  _sortAliens() {
    let ORIGIN_X = 100;
    let ORIGIN_Y = 100;
    this.aliens.clear(true, true);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 10; x++) {
        let alien = this.aliens.create(ORIGIN_X + x * 48, ORIGIN_Y + y * 50);
        alien.setOrigin(0.5, 0.5);
        alien.play(AnimationType.Fly);
        alien.setImmovable(false);
      }
    }
  }

  _animate() {
    this.aliens.children.iterate((c) => {
      this._scene.tweens.add({
        targets: c,
        ease: "Linear",
        duration: 2000,
        x: "+=200",
        paused: false,
        delay: 0,
        yoyo: true,
        repeat: -1,
      });
    });
  }
}
