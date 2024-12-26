import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  player;
  ball;
  cursors;
  redBricks;
  violetBricks;
  yellowBricks;
  greenBricks;
  blueBricks;
  pinkBricks;
  openingText;
  gameOverText;
  playerWonText;
  scoreText;
  gtimeText;
  score = 0;
  gtime = 30;
  gameTimer;
  ballSpeed = 300;
  gameStarted = false;
  optionsScene;

  constructor() {
    super({
      key: "GameScene",
      physics: {
        default: "arcade",
      },
    });
  }

  create() {
    this.score = 0;
    this.gtime = 180;
    this.ballSpeed = 300;
    this.gameStarted = false;

    this.cursors = {
      ...this.input.keyboard.createCursorKeys(),
      ...this.input.keyboard.addKeys("W,S,A,D"),
    };

    this.optionsScene = this.scene.get("OptionsScene");

    const graphics = this.add.graphics();
    graphics.fillStyle(0x004166);
    graphics.fillRect(0, 0, this.scale.width, 45);
    const topBoundary = this.physics.add.staticBody(0, 0, this.scale.width, 45);

    this.scoreText = this.add.text(16, 10, "Score: " + this.score, { fontSize: 26, fontStyle: "bold" }).setOrigin(0, 0);

    this.gtimeText = this.add.text(this.scale.width - 60, 10, "Time: " + this.gtime, { fontSize: 26, fontStyle: "bold" }).setOrigin(1, 0);

    this.player = this.physics.add.sprite(
      this.scale.width / 2, // x position
      this.scale.height - 50, // y position
      "paddle" // key of image for the sprite
    );

    this.ball = this.physics.add.sprite(
      this.scale.width / 2, // x position
      this.scale.height - 80, // y position
      "ball" // key of image for the sprite
    );

    // Add red bricks
    this.redBricks = this.physics.add.group({
      key: "brick1",
      repeat: 9,
      immovable: true,
      setXY: {
        x: 48,
        y: 60,
        stepX: 68,
      },
    });

    // Add violet bricks
    this.violetBricks = this.physics.add.group({
      key: "brick2",
      repeat: 9,
      immovable: true,
      setXY: {
        x: 48,
        y: 90,
        stepX: 68,
      },
    });

    // Add yellow bricks
    this.yellowBricks = this.physics.add.group({
      key: "brick3",
      repeat: 9,
      immovable: true,
      setXY: {
        x: 48,
        y: 120,
        stepX: 68,
      },
    });

    // Add green bricks
    this.greenBricks = this.physics.add.group({
      key: "brick4",
      repeat: 9,
      immovable: true,
      setXY: {
        x: 48,
        y: 150,
        stepX: 68,
      },
    });

    // Add blue bricks
    this.blueBricks = this.physics.add.group({
      key: "brick5",
      repeat: 9,
      immovable: true,
      setXY: {
        x: 48,
        y: 180,
        stepX: 68,
      },
    });

    // Add pink bricks
    this.pinkBricks = this.physics.add.group({
      key: "brick6",
      repeat: 9,
      immovable: true,
      setXY: {
        x: 48,
        y: 210,
        stepX: 68,
      },
    });

    this.player.setCollideWorldBounds(true);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1, 1);
    this.physics.world.checkCollision.down = false;
    this.physics.add.collider(topBoundary, this.ball, null, null, this);
    this.physics.add.collider(this.ball, this.player, this.hitPlayer, null, this);
    this.physics.add.collider(this.ball, this.redBricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.violetBricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.yellowBricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.greenBricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.blueBricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.pinkBricks, this.hitBrick, null, this);

    this.player.setImmovable(true);

    this.openingText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, "Press SPACE to Start", {
      fontFamily: "Monaco, Courier, monospace",
      fontSize: "50px",
      fill: "#fff",
    });

    this.openingText.setOrigin(0.5);

    // Create game over text
    this.gameOverText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, "Game Over", {
      fontFamily: "Monaco, Courier, monospace",
      fontSize: "50px",
      fill: "#fff",
    });

    this.gameOverText.setOrigin(0.5);

    // Make it invisible until the player loses
    this.gameOverText.setVisible(false);

    // Create the game won text
    this.playerWonText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, "You won!", {
      fontFamily: "Monaco, Courier, monospace",
      fontSize: "50px",
      fill: "#fff",
    });

    this.playerWonText.setOrigin(0.5);

    // Make it invisible until the player wins
    this.playerWonText.setVisible(false);

    this.gameTimer = this.time.addEvent({
      loop: true,
      delay: 1000,
      paused: true,
      callback: () => {
        this.gtime -= 1;
        this.gtimeText.setText("Time: " + this.gtime);
      },
    });
  }

  update() {
    // Put this in so that the player stays still if no key is being pressed
    this.player.body.setVelocityX(0);

    if (this.cursors.left.isDown || this.cursors.A?.isDown) {
      this.player.body.setVelocityX(-500);
    } else if (this.cursors.right.isDown || this.cursors.D?.isDown) {
      this.player.body.setVelocityX(500);
    }

    if (!this.gameStarted) {
      this.ball.setX(this.player.x);
      if (this.cursors.space.isDown) {
        this.gameStarted = true;
        this.gameTimer.paused = false;
        this.ball.setVelocityY(-this.ballSpeed);
        this.openingText.setVisible(false);
      }
    }

    // Check if the ball left the scene i.e. game over
    if (this.isGameOver(this.physics.world)) {
      this.gameTimer.paused = true;
      // this.gameOverText.setVisible(true);
      this.ball.disableBody(true, true);
      this.optionsScene.gameLose.play();
      this.scene.start("LoseScene", { score: this.score });
    } else if (this.isWon()) {
      this.gameTimer.paused = true;
      // this.playerWonText.setVisible(true);
      this.ball.disableBody(true, true);
      this.optionsScene.gameWin.play();
      this.scene.start("WinScene", { score: this.score });
    }
  }

  isGameOver(world) {
    return this.ball.body.y > world.bounds.height || this.gtime <= 0;
  }

  isWon() {
    return (
      this.redBricks.countActive() +
        this.violetBricks.countActive() +
        this.yellowBricks.countActive() +
        this.greenBricks.countActive() +
        this.blueBricks.countActive() +
        this.pinkBricks.countActive() ===
      0
    );
  }

  hitBrick(ball, brick) {
    this.optionsScene.targetBubble.play();
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);
    brick.disableBody(true, true);
  }

  hitPlayer(ball, player) {
    // this.optionsScene.selectNavigation.play();
    this.ballSpeed += 4;
    if (ball.y < player.y) {
      let vx = ((ball.x - player.x) * this.ballSpeed) / player.width;
      if (vx === 0) vx = Math.random() * 30 - 15;
      let vy = -this.ballSpeed;
      let v2 = new Phaser.Math.Vector2(vx, vy);
      v2.normalize();
      ball.setVelocity(v2.x * this.ballSpeed, v2.y * this.ballSpeed);
    }
  }
}

export default GameScene;
