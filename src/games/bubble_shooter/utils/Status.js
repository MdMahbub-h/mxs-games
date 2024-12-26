import Phaser from "phaser";
import { CANVAS_WIDTH, CANVAS_HEIGHT, CENTER_X } from "./Constants";

class Status extends Phaser.GameObjects.Group {
  constructor(scene, overlayConfig, headerConfig, statsConfig) {
    super(scene);
    this.overlay = null;
    this.header = null;
    this.stats = [];
    this.createStatus(overlayConfig, headerConfig, statsConfig);
  }

  createStatus(overlayConfig, headerConfig, statsConfig) {
    if (overlayConfig) this.overlay = this.createOverlay(overlayConfig);
    if (headerConfig) this.header = this.createHeader(headerConfig);
    if (statsConfig) this.stats = this.createStats(statsConfig);
  }

  createOverlay(overlay) {
    if (this.overlay) this.remove(this.overlay);
    let { fill } = overlay;
    let graphic = this.scene.add.graphics();
    graphic.beginPath(fill);
    graphic.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    graphic.setAlpha(0.3);
    return;
  }

  createHeader(header) {
    if (this.header) this.remove(this.header);
    let { x, y, font, message, fontSize } = header;
    let text = this.scene.add.bitmapText(x, y, font, message, fontSize);
    text.setAlpha(1);
    text.setOrigin(0.5, 0.5);
    return text;
  }

  createStats(stats) {
    if (this.stats.length) {
      this.stats.forEach((stat) => {
        this.remove(stat);
      });
    }

    let { x, y, font, message, fontSize, distance } = stats;
    let { time, score } = message;
    let propText = `SCORE ${score}`;
    let props = this.scene.add.bitmapText(CENTER_X, y, font, propText, fontSize);

    props.setOrigin(0.5, 0.5);
    // values.anchor.set(0, 0.5);
    return this.addMultiple([props]);
  }
}

export default Status;
