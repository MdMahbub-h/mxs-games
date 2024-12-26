import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene",
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            y: 0,
          },
          debug: false,
        },
      },
    });

    this.point = 0;
    this.timer = 0;
    this.ratio = 500 / 800;
    this.fall = false;
    this.emitter = null;
    this.velocityX = 50;
    this.textScore = null;
    this.timeText = null;
    this.timeEvent = null;
    this.remainingTime = 0;
    this.isGameOver = false;
    this.isGameStarted = false;
    this.lastPipe = null;
    this.helpText = null;
  }

  create() {
    this.resetAllData();

    this.optionsScene = this.scene.get("OptionsScene");

    this.add.image(0, 50, "bg").setDisplaySize(this.scale.width, this.scale.height).setOrigin(0, 0);

    this.bird = this.physics.add.sprite(150, 245, "fly1").setScale(0.15);

    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.on("down", this.jump, this);

    this.add.rectangle(0, 0, this.scale.width * 2, 100, 0xaaaafa).setDepth(2);

    this.textScore = this.add
      .text(this.scale.width / 2 - 50, 10, "Score: 0", {
        font: "25px bold",
        fill: "#ff0000",
      })
      .setDepth(3);

    // Pipes and coins
    this.pipes = this.physics.add.group();
    this.coins = this.physics.add.group();

    const x = this.scale.width;
    const y = this.getRandomY();

    this.spawnPipes(x - 300, y);
    this.spawnCoin(x - 300, y);

    this.spawnPipes(x, y);
    this.spawnCoin(x, y);

    // Colliders
    this.physics.add.overlap(this.bird, this.pipes, this.gameOver, null, this);
    this.physics.add.overlap(this.bird, this.coins, this.collectCoin, null, this);

    this.helpText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Press SPACE key to start the game!", {
        fontSize: "32px",
        fill: "#fff",
        align: "center",
        fontWeight: "bold",
        stroke: "#f00",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 0.5);
  }

  update(time, delta) {
    this.timer += delta;

    if (this.lastPipe && this.lastPipe.x < this.scale.width - 300) {
      const x = this.scale.width;
      const y = this.getRandomY();
      this.spawnPipes(x, y);
      this.spawnCoin(x, y);
    }

    this.textScore.setText(`Score: ${this.point}`);

    // Check if bird goes out of bounds
    if (this.bird.y > this.scale.height + 30 || this.bird.y < 0) {
      this.gameOver();
    }
  }

  jump() {
    if (this.isGameOver) return;
    if (!this.isGameStarted) {
      this.isGameStarted = true;
      this.helpText.setVisible(false);
      this.bird.setGravityY(600);
      this.coins.setVelocityX(-this.velocityX);
      this.pipes.setVelocityX(-this.velocityX);
    }

    this.bird.setVelocityY(-250);
    this.bird.setTexture("fly2");

    // Reset bird texture after delay
    this.time.delayedCall(
      200,
      () => {
        this.bird.setTexture("fly1");
      },
      [],
      this
    );
  }

  getRandomY() {
    return Phaser.Math.Between(450, 700);
  }

  spawnPipes(x, y) {
    const sy = Phaser.Math.Between(500, 600);

    const pipeTop = this.pipes.create(x, y - sy, "yellow2").setScale(this.ratio * 0.3);
    const pipeBottom = this.pipes.create(x, y, "yellow1").setScale(this.ratio * 0.3);

    if (this.isGameStarted) {
      this.pipes.setVelocityX(-this.velocityX);
    }

    this.lastPipe = pipeBottom;
  }

  spawnCoin(x, y) {
    const sy = Phaser.Math.Between(250, 300);
    this.coins.create(x + 150, y - sy, "coin").setScale(0.35);

    if (this.isGameStarted) {
      this.coins.setVelocityX(-this.velocityX);
    }
  }

  collectCoin(bird, coin) {
    this.optionsScene.coinCollect.play();
    coin.disableBody(true, true); // Remove coin
    this.point += 10; // Increase score
    this.velocityX += 5;
    this.coins.setVelocityX(-this.velocityX);
    this.pipes.setVelocityX(-this.velocityX);
    this.textScore.setText(`Score: ${this.point}`); // Update score text
  }

  gameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;

    this.bird.setGravity(0, 0);
    this.bird.setVelocity(0, 0);
    this.pipes.setVelocity(0, 0);
    this.coins.setVelocity(0, 0);

    this.optionsScene.gameLose.play();

    this.fall = true;

    this.time.delayedCall(
      1000,
      () => {
        if (this.point === 100) {
          this.scene.start("WinScene", { score: this.point });
          this.point = 0;
        } else {
          this.scene.start("LoseScene", { score: this.point });
        }
        this.fall = false;
      },
      [],
      this
    );
  }

  resetAllData() {
    this.point = 0;
    this.timer = 0;
    this.ratio = 500 / 800;
    this.emitter = null;
    this.velocityX = 50;
    this.timeEvent = null;
    this.remainingTime = 0;
    this.isGameStarted = false;
    this.isGameOver = false;
  }
}

export default GameScene;
