import { EnemyBullet } from "../enemy-bullet";
import { Bullet } from "../bullet";
import { Kaboom } from "../kaboom";
import { Scene } from "phaser";

export class AssetManager {
  bullets;
  enemyBullets;
  explosions;

  constructor(_scene) {
    this._scene = _scene;
    this.bullets = this._createBullets();
    this.enemyBullets = this._createEnemyBullets();
    this.explosions = this._createExplosions();
  }

  gameOver() {
    this.enemyBullets.clear(true, true);
    this.bullets.clear(true, true);
  }

  reset() {
    this._createEnemyBullets();
    this._createBullets();
  }

  _createEnemyBullets() {
    let enemyBullets = this._scene.physics.add.group({
      max: 0,
      classType: EnemyBullet,
      runChildUpdate: true,
    });
    enemyBullets.setOrigin(0.5, 1);
    return enemyBullets;
  }

  _createBullets() {
    let bullets = this._scene.physics.add.group({
      max: 0,
      classType: Bullet,
      runChildUpdate: true,
    });
    bullets.setOrigin(0.5, 1);
    return bullets;
  }

  _createExplosions() {
    let explosions = this._scene.physics.add.group({
      max: 0,
      classType: Kaboom,
      runChildUpdate: true,
      setScale: 0.5,
    });

    return explosions;
  }
}
