import { AssetType } from "../assets";

export class ScoreManager {
  scoreText;
  line1Text;
  line2Text;
  lives;

  get noMoreLives() {
    return this.lives.countActive(true) === 0;
  }

  highScore = 0;
  score = 0;

  constructor(_scene) {
    this._scene = _scene;
    this._init();
    this.print();
  }

  _init() {
    const { width: SIZE_X, height: SIZE_Y } = this._scene.game.canvas;
    const textConfig = {
      fontFamily: `'Arial', sans-serif`,
      fill: "#ffffff",
    };
    const normalTextConfig = {
      ...textConfig,
      fontSize: "16px",
    };

    const bigTextConfig = {
      ...textConfig,
      fontSize: "36px",
    };

    this._scene.add.text(36, 16, `SCORE`, normalTextConfig);
    this.scoreText = this._scene.add.text(45, 32, "", normalTextConfig);
    this.line1Text = this._scene.add.text(SIZE_X / 2, 320, "", bigTextConfig).setOrigin(0.5);

    this.line2Text = this._scene.add.text(SIZE_X / 2, 400, "", bigTextConfig).setOrigin(0.5);

    this._setLivesText(SIZE_X, normalTextConfig);
  }

  _setLivesText(SIZE_X, textConfig) {
    this._scene.add.text(SIZE_X - 120, 16, `LIVES`, textConfig);
    this.lives = this._scene.physics.add.group({
      maxSize: 3,
      runChildUpdate: true,
    });
    this.reset();
  }

  reset() {
    this.score = 0;
    let SIZE_X = this._scene.game.canvas.width;
    this.lives.clear(true, true);
    for (let i = 0; i < 3; i++) {
      let ship = this.lives.create(SIZE_X - 120 + 20 * i, 60, AssetType.Ship);
      ship.setOrigin(0.5, 0.5);
      ship.setAngle(90);
      ship.setAlpha(0.6);
      ship.setScale(0.6);
    }
  }

  setGameOverText() {
    this._setBigText("GAME OVER", "PRESS SPACE FOR RESTART GAME");
  }

  hideText() {
    this._setBigText("", "");
  }

  _setBigText(line1, line2) {
    this.line1Text.setText(line1);
    this.line2Text.setText(line2);
  }

  setHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.score = 0;
    this.print();
  }

  print() {
    this.scoreText.setText(`${this.padding(this.score)}`);
  }

  increaseScore(step = 10) {
    this.score += step;
    this.print();
  }

  padding(num) {
    return `${num}`.padStart(4, "0");
  }
}
