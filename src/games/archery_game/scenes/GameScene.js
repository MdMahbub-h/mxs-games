import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  speed = 10;
  targetSpeed = 2;
  score = 0;
  arrowCount = 5;
  direction = 1;
  hit = false;
  pressed = false;
  released = false;
  canShoot = false;

  bow;
  arrow;
  target;
  targetleg;
  emitter;
  graphics;
  textCount;
  textScore;
  optionsScene;

  xVel;
  yVel;

  constructor() {
    super("GameScene");
  }

  create() {
    this.optionsScene = this.scene.get("OptionsScene");
    this.speed = 10;
    this.targetSpeed = 2;
    this.direction = 1;
    this.score = 0;
    this.canShoot = true;
    this.hit = false;
    this.pressed = false;
    this.released = false;
    this.arrowCount = 5;

    this.add.image(0, 0, "bg").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);
    this.add.rectangle(0, 0, this.scale.width, 50, 0x111185, 0.8).setOrigin(0, 0).setDepth(2);
    // this.basket = this.add.sprite(550, 600, "basket").setScale(0.3, 3);

    this.target = this.physics.add.sprite(this.scale.width / 2, 100, "target").setOrigin(0.5, 0);
    this.targetleg = this.physics.add.sprite(this.target.x, this.target.y, "targetleg").setOrigin(0.5, 0);

    this.bow = this.add
      .sprite(this.scale.width / 2, this.scale.height - 120, "bow")
      .setDepth(1)
      .setOrigin(0.5, 0);

    this.arrow = this.physics.add.sprite(this.bow.x, this.bow.y, "arrow").setOrigin(0.5, 0).setDepth(1);
    this.arrow.angle = this.bow.angle;
    this.physics.add.overlap(this.target, this.arrow, this.targetHit, null, this);

    const graphics = this.add.graphics();
    // graphics.fillStyle(0xff0000, 0.5);
    graphics.fillEllipse(this.bow.x, this.bow.y, this.scale.width * 2, this.scale.height * 1.4);
    const mask = graphics.createGeometryMask();
    this.arrow.setMask(mask);
    graphics.removeFromDisplayList();

    this.graphics = this.add.graphics().setDepth(1);
    this.graphics.lineStyle(5, 0xff0000, 0.5);

    this.emitter = this.add.particles(0, -8, "money", {
      speed: 100,
      gravityY: 250,
      scale: 0.06,
      duration: 50,
      emitting: false,
    });

    this.textScore = this.add
      .text(20, 10, "Score: 0", {
        font: "25px Arial",
        fill: "#dddddd",
      })
      .setDepth(3);

    this.add
      .image(this.scale.width - 120, 25, "arrow")
      .setScale(0.45, 0.25)
      .setDepth(3);

    this.textCount = this.add
      .text(this.scale.width - 100, 10, "0s", {
        font: "25px Arial",
        fill: "#dddddd",
      })
      .setDepth(3);

    this.prepareNewShot();
  }

  update() {
    this.textCount.setText(`${this.arrowCount}`);

    if (this.canShoot) {
      if (this.input.activePointer.leftButtonDown()) {
        this.pressed = true;
      }
    }

    if (this.pressed) {
      if (this.input.activePointer.leftButtonReleased()) {
        this.pressed = false;
        this.released = true;
        this.canShoot = false;
        this.shootArrow();
      }
    }

    if (!this.hit) {
      this.moveTarget();
    }

    if (!this.released) {
      this.angle = Math.atan2(this.input.mousePointer.x - this.bow.x, -(this.input.mousePointer.y - (this.bow.y - this.bow.height / 2))) * (180 / Math.PI) - 180;
      this.bow.angle = this.arrow.angle = this.angle;

      if (!this.pressed) {
        this.arrow.setOrigin(0.5, 0.5).setPosition(this.bow.x, this.bow.y);
        // let xrad1 = Math.cos(Phaser.Math.DegToRad(this.angle)) * -(this.bow.width / 2) + this.bow.x;
        // let yrad1 = Math.sin(Phaser.Math.DegToRad(this.angle)) * -(this.bow.width / 2) + this.bow.y;
        // let xrad2 = Math.cos(Phaser.Math.DegToRad(this.angle)) * (this.bow.width / 2) + this.bow.x;
        // let yrad2 = Math.sin(Phaser.Math.DegToRad(this.angle)) * (this.bow.width / 2) + this.bow.y;
        // let xrad3 = Math.cos(Phaser.Math.DegToRad(this.angle)) * -(this.arrow.width / 2) + this.arrow.x;
        // let yrad3 = Math.sin(Phaser.Math.DegToRad(this.angle)) * -(this.arrow.width / 2) + this.arrow.y;

        // this.graphics.clear();
        // this.graphics.lineStyle(5, 0xff0000, 0.5);
        // this.graphics.lineBetween(xrad1, yrad1, xrad3, yrad3);
        // this.graphics.lineBetween(xrad3, yrad3, xrad2, yrad2);
      } else {
        this.arrow.setOrigin(0.5, 0.1).setPosition(this.bow.x, this.bow.y);
        // let xrad1 = Math.cos(Phaser.Math.DegToRad(this.angle)) * -(this.bow.width / 2) + this.bow.x;
        // let yrad1 = Math.sin(Phaser.Math.DegToRad(this.angle)) * -(this.bow.width / 2) + this.bow.y;
        // let xrad2 = Math.cos(Phaser.Math.DegToRad(this.angle)) * (this.bow.width / 2) + this.bow.x;
        // let yrad2 = Math.sin(Phaser.Math.DegToRad(this.angle)) * (this.bow.width / 2) + this.bow.y;
        // let xrad3 = Math.cos(Phaser.Math.DegToRad(this.angle)) * -(this.arrow.height / 2) + this.arrow.x;
        // let yrad3 = Math.sin(Phaser.Math.DegToRad(this.angle)) * -(this.arrow.height / 2) + this.arrow.y;

        // this.graphics.clear();
        // this.graphics.lineStyle(5, 0xff0000, 0.5);
        // this.graphics.lineBetween(xrad1, yrad1, xrad3, yrad3);
        // this.graphics.lineBetween(xrad3, yrad3, xrad2, yrad2);
      }
    } else {
      this.moveArrow();
    }
  }

  targetHit() {
    if (!this.hit && this.arrow.y <= this.target.y + this.target.height / 2) {
      const distance = Phaser.Math.Distance.Between(this.target.x, this.target.y + this.target.height / 2, this.arrow.x, this.arrow.y);
      if (distance < 15) {
        this.hit = true;
        this.score += 5;
        this.emitter.duration = 150;
        this.emitter.setTexture("money2");
        this.emitter.start();
        this.emitter.setPosition(this.arrow.x, this.arrow.y);
        this.resetArrow();
        this.time.delayedCall(1000, this.resetTarget, [], this);
        this.optionsScene.targetArrow.play();
      } else if (distance < 32) {
        this.hit = true;
        this.score += 3;
        this.emitter.duration = 100;
        this.emitter.setTexture("money3");
        this.emitter.setPosition(this.arrow.x, this.arrow.y);
        this.emitter.start();
        this.resetArrow();
        this.time.delayedCall(1000, this.resetTarget, [], this);
        this.optionsScene.targetArrow.play();
      } else if (distance < 50) {
        this.hit = true;
        this.score += 1;
        this.emitter.duration = 50;
        this.emitter.setTexture("money");
        this.emitter.setPosition(this.arrow.x, this.arrow.y);
        this.emitter.start();
        this.resetArrow();
        this.time.delayedCall(1000, this.resetTarget, [], this);
        this.optionsScene.targetArrow.play();
      }
      this.textScore.setText("Score: " + this.score);
    }
  }

  prepareNewShot() {
    this.resetArrow();
    this.resetTarget();
  }

  resetArrow() {
    this.released = false;
    this.xVel = 0;
    this.yVel = 0;
    this.arrow.setScale(1);
    this.arrow.setVisible(true);
    this.arrow.setPosition(this.bow.x, this.bow.y - this.arrow.height / 2);
  }

  shootArrow() {
    this.optionsScene.launchArrow.play();
    this.xVel = Math.sin((this.angle * Math.PI) / 180) * this.speed;
    this.yVel = -Math.cos(-(this.angle * Math.PI) / 180) * this.speed;
  }

  moveArrow() {
    const minDist = 50;
    const maxDist = 300;
    const dist = Phaser.Math.Distance.Between(this.bow.x, this.bow.y + 100, this.arrow.x, this.arrow.y);
    const scale = this.mapDistanceToScale(dist, minDist, maxDist);

    this.arrow.setScale(scale);
    this.arrow.setPosition(this.arrow.x + this.xVel, this.arrow.y + this.yVel);

    if (this.arrow.y < 0 || this.arrow.x < 0 || this.arrow.x > this.scale.width) {
      this.arrowCount -= 1;
      if (this.arrowCount <= 0) {
        this.gameOver();
      } else {
        this.resetArrow();
        this.canShoot = true;
      }
    }
  }

  resetTarget() {
    const minDist = 60;
    const maxDist = 300;
    const y = Phaser.Math.Between(minDist, maxDist);
    const dist = maxDist - y;
    const scale = this.mapDistanceToScale(dist, minDist, maxDist);
    this.target.setY(y).setScale(scale);
    this.targetleg.setY(y).setScale(scale);
    this.targetSpeed += 0.1;
    this.hit = false;
    this.canShoot = true;
  }

  moveTarget() {
    if (this.target.x + this.target.width / 2 > this.scale.width) {
      this.direction = -1;
    } else if (this.target.x - this.target.width / 2 < 0) {
      this.direction = 1;
    }

    this.target.x += this.direction * this.targetSpeed;
    this.targetleg.x = this.target.x;
  }

  mapDistanceToScale = (distance, minDist, maxDist) => {
    const minValue = 0.5;
    const maxValue = 1;
    if (distance < minDist) distance = minDist;
    if (distance > maxDist) distance = maxDist;
    const mappedValue = maxValue - ((distance - minDist) / (maxDist - minDist)) * (maxValue - minValue);
    return mappedValue;
  };

  gameOver() {
    if (this.score >= 50) {
      this.optionsScene.gameWin.play();
      this.scene.start("WinScene", { score: this.score });
    } else {
      this.optionsScene.gameLose.play();
      this.scene.start("LoseScene", { score: this.score });
    }
  }
}

export default GameScene;
