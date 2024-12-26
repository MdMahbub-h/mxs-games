import Phaser from "phaser";

class Bomb extends Phaser.GameObjects.Sprite {
  timer = null;

  constructor(scene, x, y, delay) {
    super(scene, x, y, "bomb");
    scene.add.existing(this);

    this.setScale(0.5, 0.5);
    this.setInteractive();

    this.anims.play("bombappear");
    this.on("animationcomplete-bombappear", () => {
      this.anims.play("bombidle");
      this.startTimer(delay);
    });
  }

  startTimer(delay) {
    this.timer = this.scene.time.addEvent({
      delay: delay,
      callback: () => {
        this.disappear();
      },
      callbackScope: this,
    });
  }

  blust() {
    this.timer?.destroy();
    this.disableInteractive();
    this.anims.play("bombblust");
    this.on("animationcomplete-bombblust", () => {
      this.destroy();
    });
  }

  disappear() {
    this.timer?.destroy();
    this.disableInteractive();
    this.anims.play("bombdisappear");
    this.on("animationcomplete-bombdisappear", () => {
      this.destroy();
    });
  }
}

class Mole extends Phaser.GameObjects.Sprite {
  timer = null;

  constructor(scene, x, y, delay) {
    super(scene, x, y, "mole");
    scene.add.existing(this);

    this.setScale(0.5, 0.5);
    this.setInteractive();

    this.anims.play("appear");
    this.on("animationcomplete-appear", () => {
      this.anims.play("idle");
      this.startTimer(delay);
    });
  }

  startTimer(delay) {
    this.timer = this.scene.time.addEvent({
      delay: delay,
      callback: () => {
        this.disappear();
      },
      callbackScope: this,
    });
  }

  whack() {
    this.timer?.destroy();
    this.disableInteractive();
    this.anims.play("whack");
    this.on("animationcomplete-whack", () => {
      this.destroy();
    });
  }

  disappear() {
    this.timer?.destroy();
    this.disableInteractive();
    this.anims.play("disappear");
    this.on("animationcomplete-disappear", () => {
      this.destroy();
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.optionsScene = this.scene.get("OptionsScene");

    this.reset();

    this.initializeBG();

    this.addGameTimer(0);
    this.addGameTimer(this.speed / 2, [0, 0, 0, 1]);
  }

  reset() {
    this.scoreText = null;
    this.speedTime = 1000;
    this.score = 0;
    this.speed = 3000;
    this.moleDelay = 2000;
    this.bombDelay = 1500;
    this.isPaused = false;
    this.isGameOver = false;
    this.lifeN = 5;
    this.lifes = [];
    this.burrowLocations = [
      { key: "a", x: this.scale.width / 2, y: 140, item: null },

      { key: "b", x: this.scale.width / 2 - 130, y: 200, item: null },
      { key: "c", x: this.scale.width / 2 + 130, y: 200, item: null },

      { key: "d", x: this.scale.width / 2 - 260, y: 260, item: null },
      { key: "e", x: this.scale.width / 2, y: 260, item: null },
      { key: "f", x: this.scale.width / 2 + 260, y: 260, item: null },

      { key: "g", x: this.scale.width / 2 - 130, y: 320, item: null },
      { key: "h", x: this.scale.width / 2 + 130, y: 320, item: null },

      { key: "i", x: this.scale.width / 2, y: 380, item: null },
    ];
  }

  initializeBG() {
    this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);
    for (let i in this.burrowLocations) {
      this.add
        .image(
          this.burrowLocations[i].x,
          this.burrowLocations[i].y + 53,
          "hole"
        )
        .setScale(0.5);
    }

    this.add.rectangle(0, 0, 768 * 2, 50 * 2, 0xffffff, 0.6);

    for (let i = 1; i <= this.lifeN; i++) {
      let life = this.add
        .image(this.scale.width - 50 - 35 * i, 10, "icon")
        .setOrigin(0, 0)
        .setScale(0.15, 0.15);
      this.lifes.push(life);
    }

    this.scoreText = this.add
      .text(30, 10, `Score:${this.score}`)
      .setFontFamily('Georgia,"Goudy Bookletter 1911", Times, serif')
      .setFontSize("26px")
      .setColor("#ff5500");
  }

  addGameTimer(delay, chances = [0, 0, 1]) {
    const timer = this.time.addEvent({
      delay: delay,
      callback: () => {
        const chance = chances[Math.floor(Math.random() * chances.length)];
        if (chance === 0) {
          this.addNewMole();
        } else {
          this.addNewBomb();
        }

        timer.destroy();
        if (this.speed > 1400) {
          this.speed -= 30;
        }
        const rnd = Math.round(Math.random() * 20 - 10);
        console.log(rnd);
        this.addGameTimer(this.speed + rnd, chances);
      },
      callbackScope: this,
    });
  }

  getRandomBurrow() {
    const emptyBurrows = this.burrowLocations.filter((pos) => pos.item == null);
    const randomIndex = Math.floor(Math.random() * emptyBurrows.length);
    return emptyBurrows[randomIndex];
  }

  addNewMole() {
    const buttow = this.getRandomBurrow();
    if (!buttow) {
      this.gameOver();
      return;
    }

    const mole = new Mole(this, buttow.x, buttow.y - 5, this.moleDelay);

    buttow.item = mole;

    mole.on(
      "animationcomplete-disappear",
      () => {
        this.optionsScene.moleHide.play();
        this.lifes[this.lifes.length - 1]?.destroy();
        this.lifes.pop();
      },
      this
    );

    mole.once(
      "pointerup",
      () => {
        if (!this.isGameOver) {
          this.optionsScene.molePunch.play();
          mole.whack();
          this.updateScore(5);
        }
      },
      this
    );

    mole.once(
      "destroy",
      () => {
        buttow.item = null;
      },
      this
    );
  }

  addNewBomb() {
    const buttow = this.getRandomBurrow();
    if (!buttow) {
      this.gameOver();
      return;
    }
    const bomb = new Bomb(this, buttow.x, buttow.y + 18, this.bombDelay);

    buttow.item = bomb;

    bomb.once(
      "pointerup",
      () => {
        if (!this.isGameOver) {
          this.optionsScene.bombBlust.play();
          bomb.blust();
          this.isGameOver = true;
          this.time.delayedCall(600, this.gameOver, undefined, this);
        }
      },
      this
    );

    bomb.once(
      "destroy",
      () => {
        buttow.item = null;
      },
      this
    );
  }

  updateScore(score) {
    this.score += score;
    this.scoreText.setText(`Score:${this.score}`);
  }

  update() {
    if (!this.isGameOver && this.lifes.length === 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.isGameOver = true;
    if (this.score >= 180) {
      this.optionsScene.gameWin.play();
      this.scene.start("WinScene", { score: this.score });
    } else {
      this.optionsScene.gameLose.play();
      this.scene.start("LoseScene", { score: this.score });
    }
  }
}

export default GameScene;
