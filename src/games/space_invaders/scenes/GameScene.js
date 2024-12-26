import { AssetType } from "../interface/assets";
import { AssetManager } from "../interface/manager/asset-manager";
import { AlienManager } from "../interface/manager/alien-manager";
import { Ship } from "../interface/ship";
import {
  AnimationFactory,
  AnimationType,
} from "../interface/factory/animation-factory";
import { ScoreManager } from "../interface/manager/score-manager";
import { GameState } from "../interface/game-state";
import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene",
      physics: { arcade: { gravity: { y: 0 } } },
    });
    this.state = null;
    this.assetManager = null;
    this.animationFactory = null;
    this.scoreManager = null;
    this.bulletTime = 0;
    this.firingTimer = 0;
    this.starfield = null;
    this.player = null;
    this.alienManager = null;
    this.cursors = null;
    this.aKey = null;
    this.dKey = null;
    this.fireKey = null;
  }

  create() {
    this.state = GameState.Playing;
    this.starfield = this.add
      .tileSprite(0, 0, 800, 600, AssetType.Starfield)
      .setOrigin(0, 0);
    this.assetManager = new AssetManager(this);
    this.animationFactory = new AnimationFactory(this);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.fireKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.player = Ship.create(this);
    this.alienManager = new AlienManager(this);
    this.scoreManager = new ScoreManager(this);
    this.optionsScene = this.game.scene.getScene("OptionsScene");

    this.fireKey.on("down", () => {
      if (this.state === GameState.GameOver) {
        this.restart();
      }
    });
  }

  update() {
    this.starfield.tilePositionY -= 1;
    this.shipKeyboardHandler();
    if (this.time.now > this.firingTimer) {
      this.enemyFires();
    }

    this.physics.overlap(
      this.assetManager.bullets,
      this.alienManager.aliens,
      this.bulletHitAliens,
      null,
      this
    );
    this.physics.overlap(
      this.assetManager.enemyBullets,
      this.player,
      this.enemyBulletHitPlayer,
      null,
      this
    );
  }

  shipKeyboardHandler() {
    let playerBody = this.player.body;
    playerBody.setVelocity(0, 0);
    if (this.cursors.left.isDown || this.aKey.isDown) {
      playerBody.setVelocityX(-200);
    } else if (this.cursors.right.isDown || this.dKey.isDown) {
      playerBody.setVelocityX(200);
    }

    if (this.fireKey.isDown) {
      this.fireBullet();
    }
  }

  bulletHitAliens(bullet, alien) {
    let explosion = this.assetManager.explosions.get();
    bullet.kill();
    alien.kill(explosion);
    this.scoreManager.increaseScore();
    if (!this.alienManager.hasAliveAliens) {
      this.scoreManager.increaseScore(1000);
      this.state = GameState.Win;
      this.scene.start("WinScene", { score: this.scoreManager.score });
    }
  }

  enemyBulletHitPlayer(ship, enemyBullet) {
    let explosion = this.assetManager.explosions.get();
    enemyBullet.kill();
    let live = this.scoreManager.lives.getFirstAlive();
    if (live) {
      live.setActive(false).setVisible(false);
    }

    explosion.setPosition(this.player.x, this.player.y);
    explosion.play(AnimationType.Kaboom);
    this.optionsScene.playerExplotion.play();
    if (this.scoreManager.noMoreLives) {
      this.scoreManager.setGameOverText();
      this.assetManager.gameOver();
      this.state = GameState.GameOver;
      this.player.disableBody(true, true);
    }
  }

  enemyFires() {
    if (!this.player.active) {
      return;
    }
    let enemyBullet = this.assetManager.enemyBullets.get();
    let randomEnemy = this.alienManager.getRandomAliveEnemy();
    if (enemyBullet && randomEnemy) {
      enemyBullet.setPosition(randomEnemy.x, randomEnemy.y);
      this.physics.moveToObject(enemyBullet, this.player, 120);
      this.firingTimer = this.time.now + 300;
    }
  }

  fireBullet() {
    if (!this.player.active) {
      return;
    }

    if (this.time.now > this.bulletTime) {
      let bullet = this.assetManager.bullets.get();
      if (bullet) {
        bullet.shoot(this.player.x, this.player.y - 18);
        this.bulletTime = this.time.now + 200;
      }
    }
  }

  restart() {
    this.state = GameState.Playing;
    this.player.enableBody(true, this.player.x, this.player.y, true, true);
    this.scoreManager.reset();
    this.scoreManager.hideText();
    this.alienManager.reset();
    this.assetManager.reset();
  }
}

export default GameScene;
