import Phaser from "phaser";

const OffsetTop = 50;

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene",
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            y: 450,
          },
          debug: false,
        },
      },
    });

    this.speedDown = 300;
    this.player = null;
    this.cursor = null;
    this.playerSpeed = this.speedDown + 100;

    this.target = null;
    this.textScore = null;
    this.timeText = null;
    this.timeEvent = null;
    this.remainingTime = null;
    this.emitter = null;

    this.point = 0;
    this.timer = 0;
    this.break = false;
    this.lifeN = 3;
    this.lifes = [];
    this.isGameOver = false;
  }

  create() {
    this.resetAllData();
    this.optionsScene = this.scene.get("OptionsScene");
    this.add.image(0, 50, "bg").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

    // this.add.rectangle(0, 49, this.scale.width * 2, 2, 0xcccccc, 0.8);
    this.add.rectangle(0, 0, this.scale.width * 2, 100, 0x111185, 0.8);
    this.player = this.physics.add.image(0, this.scale.height - 80, "basket").setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(3);
    this.player
      .setSize(this.player.width - this.player.width / 5, this.player.height / 10)
      .setOffset(this.player.width / 9, this.player.height - this.player.height / 2)
      .setDisplaySize(this.scale.width / 7, this.scale.height / 10);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.target = this.physics.add
      .image(35, 10 + OffsetTop, "egg")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width / 22, this.scale.height / 16);
    this.target.setMaxVelocity(0, this.speedDown);

    for (let i = 0; i < 6; i++) {
      this.add
        .image(5 + i * (this.scale.width / 6), 50, "owl")
        .setOrigin(0, 0)
        .setScale(0.1, 0.1);
    }
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    this.textScore = this.add.text(20, 10, "Score: 0", {
      font: "25px Arial",
      // fill: "#e0e000",
      fill: "#dddddd",
    });

    for (let i = 1; i <= this.lifeN; i++) {
      let life = this.add
        .image(this.scale.width - 50 - 30 * i, 10, "egg")
        .setOrigin(0, 0)
        .setScale(0.65, 0.65);
      this.lifes.push(life);
    }

    this.emitter = this.add.particles(0, -8, "money", {
      speed: 100,
      gravityY: this.speedDown - 150,
      scale: 0.06,
      duration: 100,
      emitting: false,
    });
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
  }

  update(time, delta) {
    this.timer += delta;
    if (!this.break) {
      if (this.target.y >= this.scale.height - 20) {
        let brokenEgg = this.add
          .image(this.target.x + 15, this.scale.height - 20, "brokenEgg")
          .setScale(0.61, 0.61)
          .setDepth(4);

        this.optionsScene.eggBreak.play();
        this.target.setY(10 + OffsetTop);

        this.lifes[this.lifes.length - 1].destroy();
        this.lifes.pop();

        if (this.lifes.length === 0) {
          this.target.y = -1500;
          this.gameOver();
        }

        this.break = true;

        this.time.delayedCall(
          2000,
          () => {
            brokenEgg.destroy();
          },
          [],
          this
        );
        this.target.setX(this.getRandomX());
        this.target.setVelocityY = 0;
        // console.log(this.target.x, this.target.y);
      }
    }

    while (this.timer > 3000) {
      this.timer = 0;
      this.speedDown = this.speedDown + 10;
      this.playerSpeed = this.speedDown + 100;
      this.target.setMaxVelocity(0, this.speedDown);
    }

    if (this.break && this.target.y < 200) {
      this.break = false;
    }

    const { left, right } = this.cursor;
    if (!this.isGameOver) {
      if (left.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
      } else if (right.isDown) {
        this.player.setVelocityX(+this.playerSpeed);
      } else {
        this.player.setVelocityX(0);
      }
    }
  }

  getRandomX() {
    let x = Math.floor(Math.random() * 6);
    let y = (x * this.scale.width) / 6 + 35;
    return y;
  }

  targetHit() {
    this.point++;
    this.optionsScene.eggCatch.play();
    this.target.setY(10 + OffsetTop);
    this.emitter.setDepth(5);
    this.emitter.start();
    this.target.setX(this.getRandomX());
    this.target.setVelocityY = 0;
    this.textScore.setText(`Score: ${this.point}`);
  }

  gameOver() {
    this.isGameOver = true;
    this.time.delayedCall(
      1000,
      () => {
        if (this.point === 30) {
          this.optionsScene.gameWin.play();
          this.scene.start("WinScene", { score: this.point });
        } else {
          this.optionsScene.gameLose.play();
          this.scene.start("LoseScene", { score: this.point });
        }
      },
      [],
      this
    );
  }

  resetAllData() {
    this.speedDown = 300;
    this.playerSpeed = this.speedDown + 100;
    this.point = 0;
    this.timer = 0;
    this.break = false;
    this.lifeN = 3;
    this.lifes = [];
    this.isGameOver = false;
  }
}

export default GameScene;
