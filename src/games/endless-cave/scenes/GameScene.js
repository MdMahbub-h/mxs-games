import Phaser from "phaser";

const scale = {
  width: 768,
  height: 560,
};

class GameScene extends Phaser.Scene {
  keyA;
  keyD;
  cursors;
  menuBtn;
  player;
  crystals;
  waterLayer;
  platforms = [];
  scoreText;
  energyText;
  cellsGap = 100;
  isJumping = true;
  isGameOver = false;
  platformMove = false;
  isGameStarted = false;
  dificultyLevel = "normal";
  playerName = "boy";
  gameSpeed = 1;
  score = 0;
  energy = 100;
  scoreLimit = 10;
  limitEnergy = 20;
  potionChance = 2;

  constructor() {
    super("GameScene");
  }

  create() {
    this.optionsScene = this.scene.get("OptionsScene");
    this.gameSpeed = 1;

    if (Math.random() < 0.5) {
      this.playerName = "girl";
    } else {
      this.playerName = "boy";
    }

    // case "medium":
    //     this.gameSpeed = 1;
    //     this.potionChance = 3;
    //     break;
    //  case "hard":
    //     this.gameSpeed = 1.5;
    //     this.potionChance = 4;
    //     break;
    //  case "expert":
    //     this.gameSpeed = 2;
    //     this.potionChance = 5;

    this.leftWall = this.add
      .tileSprite(
        16,
        this.scale.height / 2,
        this.scale.height * 2,
        32,
        "tiles",
        "3.png"
      )
      .setAngle(90)
      .setScale(0.5, 1)
      .setDepth(110);
    this.rightWall = this.add
      .tileSprite(
        this.scale.width - 16,
        this.scale.height / 2,
        this.scale.height * 2,
        32,
        "tiles",
        "3.png"
      )
      .setAngle(-90)
      .setScale(0.5, 1)
      .setDepth(110);

    this.bgWall = this.add.tileSprite(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      "tiles",
      "5.png"
    );

    // this.add.image(0, 0, "background").setOrigin(0, 0).setScale(0.45, 0.65);
    this.player = this.physics.add
      .sprite(this.scale.width / 2, this.scale.height / 2, this.playerName)
      .setDepth(99)
      .setScale(0.45);
    this.physics.add
      .existing(this.player)
      .body.setSize(80, 64, false)
      .setOffset(0, 64);

    this.physics.world.setBounds(
      28,
      0,
      this.scale.width - 56,
      this.scale.height
    );
    this.player.setCollideWorldBounds(true);

    const frames = [
      { name: "hit", from: 0, to: 0, direction: "forward", repeat: 0 },
      { name: "idle", from: 1, to: 2, direction: "forward", repeat: -1 },
      { name: "jump-dn", from: 3, to: 3, direction: "forward", repeat: 0 },
      { name: "jump-up", from: 4, to: 4, direction: "forward", repeat: 0 },
      { name: "run", from: 5, to: 10, direction: "forward", repeat: -1 },
    ];

    frames.forEach((frame) => {
      if (this.anims.exists(this.playerName + "-" + frame.name)) return;
      this.anims.create({
        key: this.playerName + "-" + frame.name,
        frames: this.anims.generateFrameNumbers(this.playerName, {
          start: frame.from,
          end: frame.to,
        }),
        repeat: frame.repeat,
        frameRate: 10,
      });
    });
    this.player.anims.play(this.playerName + "-" + "idle", true);

    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.startGame();

    this.crystals = this.physics.add.group();

    this.addWaterLayer();

    this.initPlatforms();

    this.scoreText = this.add
      .text(60, 15, `SCORE: ${this.score}`, {
        fontSize: 20,
        fontFamily: "Courier New",
        fontStyle: "bold",
        color: "#32a9e5",
      })
      .setDepth(1000)
      .setStroke("#f29c35", 3);
    this.energyText = this.add
      .text(this.scale.width - 195, 15, `ENERGY: ${this.energy}`, {
        fontSize: 20,
        fontFamily: "Courier New",
        fontStyle: "bold",
        color: "#32a9e5",
      })
      .setDepth(1000)
      .setStroke("#f29c35", 3);
  }

  startGame() {
    this.score = 0;
    this.energy = 100;
    this.platformMove = false;
    this.isGameOver = false;
    this.isGameStarted = true;
  }

  addWaterLayer() {
    this.waterLayer = this.physics.add.staticGroup();
    let cellWidth = 32;
    let count = Math.ceil(this.scale.width / cellWidth);
    let y = this.scale.height;
    for (let i = 0; i < count; i++) {
      this.waterLayer
        .create(i * cellWidth, y - 10, "tiles", "17.png")
        .setScale(0.5)
        .setOrigin(0, 1)
        .refreshBody();
    }
    this.water1 = this.add
      .tileSprite(
        this.scale.width / 2 - 16,
        y - 26,
        this.scale.width * 2,
        48,
        "tiles",
        "17.png"
      )
      .setScale(0.5)
      .setDepth(101);
    this.water2 = this.add
      .tileSprite(
        this.scale.width / 2,
        y - 12,
        this.scale.width * 2,
        48,
        "tiles",
        "17.png"
      )
      .setScale(0.5)
      .setDepth(101);
    this.waterLayer.setDepth(100);
    this.physics.add.overlap(this.player, this.waterLayer, () => {
      this.player.anims.play(this.playerName + "-" + "hit", true);

      setTimeout(() => {
        this.gameOver();
      }, 200);
    });

    this.physics.add.overlap(
      this.waterLayer,
      this.crystals,
      (water, crystal) => {
        crystal.disableBody(true, true);
      },
      null,
      this
    );
  }

  initPlatforms() {
    // this.crystals.children.each((child) => {
    //   child.destroy();
    //   return true;
    // });
    // this.platforms.forEach((platform) => {
    //   platform.children.each((child) => {
    //     child.destroy();
    //     return true;
    //   });
    // });
    this.platforms = [];
    let cellsCount = (this.scale.height - 60) / this.cellsGap;
    for (let i = cellsCount; i > 0; i--) {
      if (i === cellsCount) {
        this.addPlatform(
          this.scale.width / 2 - 32 * 2,
          this.scale.height - 60,
          4
        );
      } else {
        this.addNewPlatform(i * this.cellsGap);
      }
    }
  }

  addNewPlatform(y = 0) {
    let divWidth = this.scale.width / 3;
    let cellWidth = 32;
    let startX = 0;
    let endX = 0;

    this.platforms.forEach((platform, index) => {
      let firstX = 0;
      platform.children.each((entry, index) => {
        if (index === 0) {
          firstX = entry.x;
        }
        return true;
      });
      if (index === this.platforms.length - 1) {
        let childsCount = platform.children.size;
        startX = firstX;
        endX = firstX + childsCount * cellWidth;
      }
    });

    let dir = 0;
    let x = 0;
    let t = Math.floor(Math.random() * (6 - 2) + 2);

    if (endX > divWidth * 2) {
      dir = 0;
    } else if (startX < divWidth) {
      dir = 1;
    } else {
      dir = Math.floor(Math.random() * 2);
    }

    switch (dir) {
      case 0:
        x = Math.floor(
          Math.random() * (startX - (startX - cellWidth * 3)) +
            (startX - cellWidth * 3)
        );
        x -= t * cellWidth;
        break;
      case 1:
        x = Math.floor(Math.random() * (endX + cellWidth * 3 - endX) + endX);
        break;
    }

    this.addPlatform(x, y, t);
    if (this.gameSpeed < 1.8) {
      this.gameSpeed += 0.02;
    }
  }

  addPlatform(x, y, t) {
    let platform = this.physics.add.staticGroup();
    for (let i = 0; i < t; i++) {
      if (i === 0) {
        platform
          .create(x + i * 32, y, "tiles", "14.png")
          .setScale(0.5, 0.5)
          .setOrigin(0, 0)
          .refreshBody();
      } else if (i === t - 1) {
        platform
          .create(x + i * 32, y, "tiles", "16.png")
          .setScale(0.5, 0.5)
          .setOrigin(0, 0)
          .refreshBody();
      } else {
        platform
          .create(x + i * 32, y, "tiles", "15.png")
          .setScale(0.5, 0.5)
          .setOrigin(0, 0)
          .refreshBody();
      }
    }
    let chance = Math.floor(Math.random() * this.potionChance);
    let crystal;
    if (chance === 0) {
      let cx = Math.floor(Math.random() * (x + (t - 2) * 32 - x) + x);
      crystal = this.physics.add
        .image(cx, y - 10, "mana-potion")
        .setOrigin(0, 1)
        .refreshBody()
        .setScale(0.5);

      this.crystals.add(crystal);
      this.physics.add.collider(
        crystal,
        platform,
        () => {
          crystal.y += this.gameSpeed;
        },
        null,
        this
      );
    }

    this.physics.add.collider(
      this.player,
      platform,
      () => {
        this.player.y += this.gameSpeed;
      },
      (player, platform) => {
        return player.body.bottom <= platform.body.top + 10;
      },
      this
    );
    this.physics.add.collider(this.player, platform);

    this.physics.add.overlap(
      this.player,
      this.crystals,
      this.collectCrystal,
      null,
      this
    );
    this.platforms.push(platform);
  }

  collectCrystal(player, crystal) {
    crystal.disableBody(true, true);
    this.energy += 10;
    this.energyText.setText(`ENERGY: ${this.energy}`);
  }

  update() {
    if (this.platformMove && !this.isGameOver) {
      this.leftWall.tilePositionX -= this.gameSpeed * 2;
      this.rightWall.tilePositionX += this.gameSpeed * 2;
      this.bgWall.tilePositionY -= this.gameSpeed;
      this.water1.tilePositionX += this.gameSpeed / 2;
      this.water2.tilePositionX += this.gameSpeed / 5;
    }

    if (this.energy <= 0) {
      this.player.anims.play(this.playerName + "-" + "hit", true);
      this.isGameOver = true;
      setTimeout(() => {
        this.gameOver();
      }, 500);
    }

    if (!this.isGameStarted || this.isGameOver) {
      this.player.setVelocityX(0);
      return;
    }

    if (this.scoreLimit > 0) {
      this.scoreLimit -= 1;
    } else if (this.platformMove) {
      this.scoreLimit = 10;
      this.score += 0.5 * this.gameSpeed;
      this.scoreText.setText(`SCORE: ${Math.floor(this.score)}`);
    }

    if (this.limitEnergy > 0) {
      this.limitEnergy -= 1;
    } else if (this.platformMove) {
      this.limitEnergy = 20;
      this.energy -= 1;
      this.energyText.setText(`ENERGY: ${Math.floor(this.energy)}`);
    }

    if (this.isJumping && this.player.body.touching.down) {
      this.isJumping = false;
    }
    if (this.cursors.left.isDown || this.keyA.isDown) {
      this.player.setFlipX(true);
      this.player.setVelocityX(-150);
      this.player.anims.play(this.playerName + "-" + "run", true);
    } else if (this.cursors.right.isDown || this.keyD.isDown) {
      this.player.setFlipX(false);
      this.player.setVelocityX(150);
      this.player.anims.play(this.playerName + "-" + "run", true);
    } else {
      const velocityY = Math.ceil(this.player.body.velocity.y);
      if (this.isJumping && velocityY > 0) {
        this.player.anims.play(this.playerName + "-" + "jump-dn", true);
      } else if (velocityY < 0) {
        this.player.anims.play(this.playerName + "-" + "jump-up", true);
      } else {
        this.player.anims.play(this.playerName + "-" + "idle", true);
        this.player.setVelocityX(0);
      }
    }

    if (this.cursors.space.isDown && !this.isJumping && !this.isGameOver) {
      let sp = this.platformMove ? this.gameSpeed * 30 : 0;
      this.player.setVelocityY(-(350 - sp));
      this.isJumping = true;
      this.platformMove = true;
    }

    if (this.platformMove) {
      let lastY = 0;
      this.platforms.forEach((platform, index) => {
        let destroy = false;
        platform.children.each((entry, index) => {
          entry.setY(entry.y + this.gameSpeed).refreshBody();
          if (index === 0) {
            lastY = entry.y;
            if (entry.y > this.scale.height) {
              destroy = true;
              entry.destroy();
            }
          }
          return true;
        });

        if (destroy) {
          this.platforms.splice(index, 1);
        }
      });

      if (lastY > this.cellsGap) {
        this.addNewPlatform();
      }
    } else {
      if (this.player.y < this.scale.height / 2.5) {
      }
    }
  }

  gameOver() {
    this.isGameOver = true;
    if (this.score >= 400) {
      this.optionsScene.gameWin.play();
      this.scene.start("WinScene", { score: this.score });
    } else {
      this.optionsScene.gameLose.play();
      this.scene.start("LoseScene", { score: this.score });
    }
  }
}

export default GameScene;
