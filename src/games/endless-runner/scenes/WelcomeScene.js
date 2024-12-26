import Phaser from "phaser";
import OptionsScene from "./OptionsScene";

class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("WelcomeScene");
  }
  preload() {
    this.load.bitmapFont(
      "upheaval",
      "assets/fonts/upheaval/font5.png",
      "assets/fonts/upheaval/font.fnt"
    );

    this.load.image("retry_btn", "assets/buttons/retry_btn.png");
    this.load.image("claim_btn", "assets/buttons/claim_btn.png");
    this.load.image("play_btn", "assets/buttons/play_btn.png");
    this.load.image("sound-on", "assets/buttons/sound-on.png");
    this.load.image("sound-off", "assets/buttons/sound-off.png");
    this.load.image("brand_logo", "assets/buttons/mxs_logo_stack_white.png");
    this.load.image("play_btn_click", "assets/buttons/play_btn_click.png");

    this.load.image("sky", "assets/endless_runner/sky.png");
    this.load.image("mountains", "assets/endless_runner/mountains.png");
    this.load.image("plateau", "assets/endless_runner/plateau.png");
    this.load.image("ground", "assets/endless_runner/ground.png");

    this.load.spritesheet("player", "assets/endless_runner/player.png", {
      frameWidth: 202,
      frameHeight: 300,
    });
    this.load.spritesheet("bird", "assets/endless_runner/birdSprite.png", {
      frameWidth: 860 / 3,
      frameHeight: 793 / 3,
    });

    this.load.spritesheet("explosion", "assets/endless_runner/explosion.png", {
      frameWidth: 64,
      frameHeight: 63,
    });
    this.load.image("coin", "assets/endless_runner/coin.png");
    this.load.image("spike", "assets/endless_runner/spike.png");
    this.load.image("missile", "assets/endless_runner/missile.png");
    this.load.image("missile2", "assets/endless_runner/missile2.png");

    this.load.audio("hoverBtnSound", "assets/endless_runner/rollover1.ogg");
    this.load.audio("clickBtnSound", "assets/endless_runner/switch3.ogg");

    this.load.audio("theme1", "assets/endless_runner/theme1.ogg");
    this.load.audio("theme2", "assets/endless_runner/theme2.ogg");
    this.load.audio("pickCoin", "assets/endless_runner/pickCoin.wav");
    this.load.audio("explosion", "assets/endless_runner/explode.wav");
    this.load.audio("killMissile", "assets/endless_runner/killMissile.ogg");
    this.load.audio("jumpSound", "assets/endless_runner/jumpSound.mp3");
    this.load.audio("spikeSound", "assets/endless_runner/spikeSound.mp3");

    this.load.audio("game-music", "assets/sounds/game-music.mp3");
    this.load.audio("click-sound", "assets/sounds/click-sound.mp3");
    this.load.audio("onoff-sound", "assets/sounds/onoff-sound.mp3");

    this.load.audio("game-win", [
      "assets/sounds/mp3/game-win.mp3",
      "assets/sounds/ogg/game-win.ogg",
    ]);
    this.load.audio("game-lose", [
      "assets/sounds/mp3/game-lose.mp3",
      "assets/sounds/ogg/game-lose.ogg",
    ]);

    this.load.audio("mole-punch", "assets/sounds/wam/punch.mp3");
    this.load.audio("mole-hide", "assets/sounds/wam/disappear.mp3");
    this.load.audio("bomb-blust", "assets/sounds/wam/explosion.mp3");
  }

  create() {
    this.add.image(this.scale.width / 2, 160, "brand_logo").setScale(0.1);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 40,
        "Welcome to MXS Endless Runner.\nPlay and get reward.",
        {
          fontSize: 26,
          align: "center",
          lineSpacing: 8,
        }
      )
      .setWordWrapWidth(600)
      .setOrigin(0.5);

    let width = this.scale.width;
    let height = this.scale.height;

    let pwidth = width - 200;
    let pheight = 5;

    let progressBox = this.add.graphics();
    let progressBar = this.add.graphics();

    progressBox.fillStyle(0x000000, 0.8);
    progressBox.fillRect(
      width / 2 - pwidth / 2,
      height - 110,
      pwidth + 4,
      pheight + 4
    );

    let time = 0;
    let timer = this.time.addEvent({
      delay: 20,
      callback: () => {
        progressBar.clear();
        progressBar.fillStyle(0x42eacb, 1);
        progressBar.fillRect(
          width / 2 - pwidth / 2 + 2,
          height - 108,
          pwidth * time,
          pheight
        );
        if (time >= 1) {
          progressBar.destroy();
          progressBox.destroy();
          this.time.removeEvent(timer);
          this.scene.start("StartScene");
          this.game.scene.add("OptionsScene", new OptionsScene(), true);
        } else {
          time += 0.01;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }
}

export default WelcomeScene;
