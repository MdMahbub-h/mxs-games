import {
  CANVAS_HEIGHT,
  CENTER_X,
  CENTER_Y,
  ROWS,
  COLUMNS,
  TILE_SIZE,
  ANCHOR_OFFSET,
  LAUNCHER_HEIGHT,
  CURRENT_BUBBLE_X,
  CURRENT_BUBBLE_Y,
  NEXT_BUBBLE_X,
  NEXT_BUBBLE_Y,
  BUBBLE_PHYSICS_SIZE,
  TOP_BOUNDARY_LAUNCH_LIMIT,
  ROUND_MODE_2,
  MIN_HEIGHT,
  NAV_FONT_SIZE,
  MID_FONT_SIZE,
  HEADER_FONT_SIZE,
} from "../utils/Constants";
import Phaser from "phaser";
import Round from "../utils/Round";
import Status from "../utils/Status";
import ScoreKeeper from "../utils/ScoreKeeper";
import { EntityMap } from "../utils/EntityMap";
import { setSize } from "../utils/Helpers";

const adjustSize = setSize(MIN_HEIGHT, CANVAS_HEIGHT);

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene",
      physics: {
        default: "arcade",
      },
    });
  }

  preload() {
    this.round = new Round(1, TILE_SIZE, ANCHOR_OFFSET);
    this.scoreKeeper = new ScoreKeeper();
    this.optionsScene = this.scene.get("OptionsScene");
    this.nowPlaying = false;
    this.bubbleLaunched = false;
    this.topBoundaryLaunchLimit = TOP_BOUNDARY_LAUNCH_LIMIT;
  }

  // initialize round
  create() {
    this.createTiles();
    this.createBlocks();
    this.createBoundaries();
    this.createLauncher();
    this.createStage();
    this.createScoreboard();

    this.currentBubble = this.createRandomBubble(CURRENT_BUBBLE_X, CURRENT_BUBBLE_Y);
    this.nextBubble = this.createRandomBubble(NEXT_BUBBLE_X, NEXT_BUBBLE_Y);

    // game logic
    this.status = new Status(
      this,
      { fill: 0x00000 },
      {
        x: CENTER_X,
        y: CENTER_Y,
        font: "upheaval",
        message: "READY",
        fontSize: NAV_FONT_SIZE,
      }
    );
    this.preGame(() => this.startGame());
  }

  // game loop
  update() {
    if (this.nowPlaying) {
      this.updateCursorInput();
      this.updateCollision();
    }
  }

  createTiles() {
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLUMNS; i++) {
        let tile = this.add.image(i * TILE_SIZE, j * TILE_SIZE + TILE_SIZE / 2, "tile-2");
        tile.setDisplaySize(TILE_SIZE * 1.71, TILE_SIZE * 1.71);
      }
    }
  }

  createBlocks() {
    this.blocks = this.physics.add.staticGroup();

    for (let i = 0; i < COLUMNS; i++) {
      this.blocks.create(i * TILE_SIZE + ANCHOR_OFFSET, ANCHOR_OFFSET / 2, "block-1");
      this.blocks.create(i * TILE_SIZE + ANCHOR_OFFSET, this.scale.height - ANCHOR_OFFSET / 2, "block-1");
    }

    let colLength = Math.floor((COLUMNS - this.round.cols) / 2);
    for (let i = 1; i < ROWS; i++) {
      for (let j = 0; j < colLength; j++) {
        let left = this.blocks.create(j * TILE_SIZE + ANCHOR_OFFSET / 2, i * TILE_SIZE + ANCHOR_OFFSET / 2, "block-1").setSize();
        let right = this.blocks.create(this.scale.width - ANCHOR_OFFSET / 2 - j * TILE_SIZE, i * TILE_SIZE + ANCHOR_OFFSET / 2, "block-1");

        left.body.checkCollision.up = false;
        left.body.checkCollision.down = false;
        left.body.checkCollision.left = false;
        right.body.checkCollision.up = false;
        right.body.checkCollision.down = false;
        right.body.checkCollision.right = false;
      }
    }

    this.blocks.children.each((child) => {
      child.setSize(TILE_SIZE * 1.71, TILE_SIZE * 1.71);
      child.setDisplaySize(TILE_SIZE * 1.71, TILE_SIZE * 1.71);
    });

    // half blocks
    if (this.round.cols === ROUND_MODE_2) {
      this.createHalfBlocks(colLength);
    }
  }

  createHalfBlocks() {
    for (let i = 2; i < (ROWS - 1) * 2; i++) {
      // left
      let left = this.blocks.create(this.round.startX - ANCHOR_OFFSET / 2, i * (TILE_SIZE / 2) + ANCHOR_OFFSET / 2, "block-1");
      left.setDisplaySize(TILE_SIZE / 2, TILE_SIZE / 2);
      left.body.checkCollision.up = false;
      left.body.checkCollision.down = false;
      left.body.checkCollision.left = false;

      // right
      let right = this.blocks.create(this.round.endX + ANCHOR_OFFSET / 2, i * (TILE_SIZE / 2) + ANCHOR_OFFSET / 2, "block-1");
      right.setDisplaySize(TILE_SIZE / 2, TILE_SIZE / 2);
      right.body.checkCollision.up = false;
      right.body.checkCollision.down = false;
      right.body.checkCollision.right = false;
    }
  }

  createBoundaries() {
    let p1 = { x: this.round.startX, y: this.round.startY };
    let p2 = { x: this.round.endX, y: this.round.startY };
    let graphics1 = this.make.graphics();
    graphics1.lineStyle(1, 0x00ff00, 1);
    graphics1.beginPath();
    graphics1.moveTo(p1.x, p1.y);
    graphics1.lineTo(p2.x, p2.y);
    graphics1.closePath();
    graphics1.strokePath();
    graphics1.generateTexture("boundary", p2.x - p1.x + TILE_SIZE, 100);
    graphics1.destroy();

    this.topBoundary = this.physics.add.sprite(p1.x - TILE_SIZE, p1.y - TILE_SIZE, "boundary");
    this.topBoundary.setVelocity(0);
    this.topBoundary.setImmovable(true);
    this.topBoundary.setOrigin(0, 0);
    this.topBoundary.setSize(p2.x - p1.x + TILE_SIZE, 10);

    let p3 = { x: this.round.startX, y: this.round.endY - TILE_SIZE };
    let p4 = { x: this.round.endX, y: this.round.endY - TILE_SIZE };

    let graphics2 = this.add.graphics();
    graphics2.lineStyle(1, 0x00ff00, 1);
    graphics2.beginPath();
    graphics2.moveTo(p3.x, p3.y);
    graphics2.lineTo(p4.x, p4.y);
    graphics2.closePath();
    graphics2.strokePath();
  }

  createScoreboard() {
    this.totalScoreText = this.add.bitmapText(TILE_SIZE, ANCHOR_OFFSET - adjustSize(3), "upheaval", "SCORE " + this.scoreKeeper.score, MID_FONT_SIZE);
    this.totalScoreText.setOrigin(0, 0.5);
  }

  createLauncher() {
    // launcher pieces
    this.arrow = this.add.sprite(CENTER_X, this.scale.height - LAUNCHER_HEIGHT + ANCHOR_OFFSET, "arrow-1");
    this.arrow.setOrigin(0.5, 0.95);
    this.arrow.setDisplaySize(adjustSize(14), adjustSize(60));

    // next text
    this.nextText = this.add.bitmapText(CENTER_X + adjustSize(75), this.scale.height - LAUNCHER_HEIGHT + TILE_SIZE + adjustSize(10), "upheaval", "NEXT", 24);
    this.nextText.setOrigin(0.5, 0.5);
  }

  createStage() {
    this.bubbles = this.physics.add.staticGroup();
    this.round.clearSelection();

    for (let i = 0; i < this.round.matrix.length; i++) {
      for (let j = 0; j < this.round.matrix[i].length; j++) {
        let colorCode = this.round.matrix[i][j];
        if (colorCode === EntityMap.zero || colorCode === EntityMap.empty || colorCode === EntityMap.outOfBounds) continue;
        let { x, y } = this.round.getCoordinates(i, j);
        this.createBubble(x, y, colorCode, this.bubbles);
        this.round.addSelection(colorCode);
      }
    }
  }

  createBubble(x, y, colorCode, group) {
    let color = EntityMap.colors[colorCode];
    let frame = EntityMap.frames[color];
    let bubble = null;
    if (group) {
      bubble = this.bubbles.create(x, y, "bubbles", frame);
    } else {
      bubble = this.physics.add.sprite(x, y, "bubbles", frame);
    }
    bubble.setScale(0.9, 0.9);
    bubble.setOrigin(0.5, 0.5);
    bubble.setBounce(1);
    bubble.setSize(BUBBLE_PHYSICS_SIZE, BUBBLE_PHYSICS_SIZE);
    bubble.setData("colorCode", colorCode);

    return bubble;
  }

  createRandomBubble(x, y, group) {
    let randomColorCode = this.round.getRandomBubbleColor();
    return this.createBubble(x, y, randomColorCode, group);
  }

  preGame(callback) {
    // this.time.addEvent({
    //   delay: 1000,
    //   callback: () => {
    //     this.status.header.setText("SET");
    //     this.time.addEvent({
    //       delay: 1000,
    //       callback: () => {
    //         this.status.header.setText("GO");
    //         this.time.addEvent({
    //           delay: 1000,
    //           callback: () => {
    this.nowPlaying = true;
    this.status.header.setVisible(false);
    callback();
    //           },
    //         });
    //       },
    //     });
    //   },
    // });
  }

  // remove overlay, starts timer, setups stats, enable input
  startGame() {
    this.nowPlaying = true;

    this.gameTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.scoreKeeper.time--;
      },
    });
  }

  // stopGame(result) {
  //   let win = result === "WIN";
  //   this.nowPlaying = false;
  //   this.gameTimer.destroy();

  //   if (win) {
  //     this.win(this.scoreKeeper.score, this.scoreKeeper.time);
  //   } else {
  //     this.lose(this.scoreKeeper.score, this.scoreKeeper.time);
  //   }
  // }

  // win(score, time) {
  //   this.status = new Status(
  //     this,
  //     { fill: 0x00000 },
  //     {
  //       x: CENTER_X,
  //       y: CENTER_Y - adjustSize(100),
  //       font: "upheaval",
  //       message: "YOU WIN",
  //       fontSize: HEADER_FONT_SIZE,
  //     },
  //     {
  //       x: CENTER_X - adjustSize(92),
  //       y: CENTER_Y + adjustSize(5),
  //       font: "upheaval",
  //       fontSize: NAV_FONT_SIZE,
  //       distance: adjustSize(110),
  //       message: { score, time },
  //     }
  //   );
  //   this.optionsScene.gameWin.play();
  // }

  // lose(score, time) {
  //   this.status = new Status(
  //     this,
  //     { fill: 0x00000 },
  //     {
  //       x: CENTER_X,
  //       y: CENTER_Y - adjustSize(100),
  //       font: "upheaval",
  //       message: "YOU LOSE",
  //       fontSize: HEADER_FONT_SIZE,
  //     },
  //     {
  //       x: CENTER_X - adjustSize(92),
  //       y: CENTER_Y + adjustSize(5),
  //       font: "upheaval",
  //       fontSize: NAV_FONT_SIZE,
  //       distance: adjustSize(110),
  //       message: { score, time },
  //     }
  //   );

  //   this.optionsScene.gameLose.play();
  // }

  launchBubble() {
    if (this.nowPlaying && !this.bubbleLaunched) {
      this.physics.velocityFromAngle(this.arrow.angle - 90, adjustSize(400), this.currentBubble.body.velocity);

      this.optionsScene.launchBubble.play();
      this.bubbleLaunched = true;
    }
  }

  // handles angle of arrow
  updateCursorInput() {
    let angle = Math.atan2(this.input.mousePointer.y - CURRENT_BUBBLE_Y, this.input.mousePointer.x - CENTER_X);
    angle = (angle * 180) / Math.PI + 90;
    if (angle < -78 || angle > 180) {
      angle = -78;
    } else if (angle > 78) {
      angle = 78;
    }
    this.arrow.setAngle(angle);
    if (this.input.activePointer.leftButtonDown()) {
      this.launchBubble();
    }
  }

  // handles three types of collision against launched bubble
  updateCollision() {
    if (this.currentBubble) {
      this.physics.add.collider(this.currentBubble, this.blocks, () => {}, null, this);

      this.physics.add.collider(
        this.currentBubble,
        this.topBoundary,
        (currentBubble, topBoundary) => {
          this.snapToGrid(currentBubble, null);
          this.updateTopBoundary();
          this.bubbleLaunched = false;
        },
        null,
        this
      );

      this.physics.add.collider(
        this.currentBubble,
        this.bubbles,
        (currentBubble, collidingBubble) => {
          this.snapToGrid(currentBubble, collidingBubble);
          this.updateTopBoundary();
          this.bubbleLaunched = false;
        },
        null,
        this
      );
    }
  }

  snapToGrid(currentBubble, collidingBubble) {
    let curx = this.currentBubble.x;
    let cury = this.currentBubble.y;
    let { i, j } = this.round.getIndices(curx, cury);

    if (this.round.matrix[i][j] === EntityMap.outOfBounds) {
      this.checkLose();
    } else {
      if (this.round.matrix[i][j] === EntityMap.empty) {
        j -= 1;

        if (this.round.matrix[i][j] !== EntityMap.zero) {
          i += 1;
          j += 1;
        }
      }

      if (this.round.matrix[i][j] === EntityMap.zero) {
        let { x, y } = this.round.getCoordinates(i, j);

        let currentColor = this.currentBubble.getData("colorCode");
        let newBubble = this.createBubble(x, y, currentColor, this.bubbles);
        this.round.matrix[i][j] = currentColor;
        newBubble.setGravity(0, 0);
        newBubble.setImmovable(true);

        this.currentBubble.setVelocity(0);
        this.currentBubble.destroy();

        if (this.removeMatchingBubbles(i, j, currentBubble, collidingBubble)) {
          this.bubbles.children.each((child) => {
            child.destroy();
          });
          this.bubbles.destroy();
          this.createStage();
          this.updateScore(currentColor);
          this.checkWin();
        }

        let colorCode = this.nextBubble.getData("colorCode");
        colorCode = this.round.checkExistBubbleColor(colorCode);
        let color = EntityMap.colors[colorCode];
        let frame = EntityMap.frames[color];
        this.nextBubble.setFrame(frame).setData("colorCode", colorCode);
        this.currentBubble = this.nextBubble;
        this.currentBubble.x = CURRENT_BUBBLE_X;
        this.currentBubble.y = CURRENT_BUBBLE_Y;
        this.nextBubble = this.createRandomBubble(NEXT_BUBBLE_X, NEXT_BUBBLE_Y);
      }
    }
  }

  removeMatchingBubbles(i, j, currentBubble, collidingBubble) {
    return this.handleDefaultCollision(i, j);
  }

  handleDefaultCollision(i, j) {
    // start from the currentBubble indices
    let targetColor = this.round.matrix[i][j];
    let target = this.round.getBubbleHash(i, j);
    let matches = new Set();
    let queue = [target];

    while (queue.length) {
      let current = queue.shift();
      matches.add(current);
      let { indices } = this.round.fromBubbleHash(current);
      let neighbors = this.getNeighbors(indices.i, indices.j);

      neighbors.forEach((hash) => {
        let { colorCode } = this.round.fromBubbleHash(hash);
        if (colorCode === targetColor && !matches.has(hash)) {
          queue.push(hash);
        }
      });
    }

    if (matches.size > 2) {
      matches.forEach((hash) => {
        let { indices, colorCode } = this.round.fromBubbleHash(hash);
        let { i, j } = indices;
        this.scoreKeeper.add(colorCode, i, j);
        this.round.matrix[i][j] = EntityMap.zero;
      });

      this.removeFloatingBubbles();
      return true;
    } else {
      return false;
    }
  }

  removeFloatingBubbles() {
    let topRow = this.round.matrix[this.round.topRow];
    let memo = new Set();
    let hasFloats = false;

    topRow.forEach((el, j) => {
      if (this.round.isBubble(this.round.topRow, j)) {
        this.floodFill(this.round.topRow, j, memo);
      }
    });

    for (let i = 0; i < this.round.matrix.length; i++) {
      for (let j = 0; j < this.round.matrix[i].length; j++) {
        let hash = this.round.getBubbleHash(i, j);
        if (this.round.isBubble(i, j) && !memo.has(hash)) {
          this.scoreKeeper.add(this.round.matrix[i][j], i, j);
          this.round.matrix[i][j] = EntityMap.zero;
          hasFloats = true;
        }
      }
    }

    if (hasFloats) {
      this.optionsScene.nonTargetBubble.play();
    } else {
      this.optionsScene.targetBubble.play();
    }
  }

  floodFill(i, j, memo) {
    memo.add(this.round.getBubbleHash(i, j));

    let neighbors = this.getNeighbors(i, j).filter((hash) => !memo.has(hash));

    if (neighbors.length) {
      neighbors.forEach((hash) => {
        let { indices } = this.round.fromBubbleHash(hash);
        this.floodFill(indices.i, indices.j, memo);
      });
    }
  }

  getNeighbors(i, j) {
    // bubble {i, j, points, type, visited}
    let neighbors = [];

    // left
    if (this.round.isBubble(i, j - 1)) {
      neighbors.push(this.round.getBubbleHash(i, j - 1));
    }

    // right
    if (this.round.isBubble(i, j + 1)) {
      neighbors.push(this.round.getBubbleHash(i, j + 1));
    }

    if (this.round.isSmallRow(i)) {
      // top left
      if (this.round.isBubble(i - 1, j)) {
        neighbors.push(this.round.getBubbleHash(i - 1, j));
      }
      // top right
      if (this.round.isBubble(i - 1, j + 1)) {
        neighbors.push(this.round.getBubbleHash(i - 1, j + 1));
      }
      // bottom left
      if (this.round.isBubble(i + 1, j)) {
        neighbors.push(this.round.getBubbleHash(i + 1, j));
      }
      // bottom right
      if (this.round.isBubble(i + 1, j + 1)) {
        neighbors.push(this.round.getBubbleHash(i + 1, j + 1));
      }
    } else {
      // top left
      if (this.round.isBubble(i - 1, j - 1)) {
        neighbors.push(this.round.getBubbleHash(i - 1, j - 1));
      }
      // top right
      if (this.round.isBubble(i - 1, j)) {
        neighbors.push(this.round.getBubbleHash(i - 1, j));
      }
      // bottom left
      if (this.round.isBubble(i + 1, j - 1)) {
        neighbors.push(this.round.getBubbleHash(i + 1, j - 1));
      }
      // bottom right
      if (this.round.isBubble(i + 1, j)) {
        neighbors.push(this.round.getBubbleHash(i + 1, j));
      }
    }
    return neighbors;
  }

  updateTopBoundary() {
    if (this.nowPlaying) {
      if (this.topBoundaryLaunchLimit <= 0) {
        let isValid = this.round.shiftTopBoundary();
        if (this.bubbles.children) {
          this.bubbles.children.each((child) => {
            child.destroy();
          });
        }
        this.bubbles.destroy();
        this.createStage();
        this.topBoundary.y += TILE_SIZE;
        this.topBoundaryLaunchLimit = TOP_BOUNDARY_LAUNCH_LIMIT;

        if (!isValid) this.checkLose();
      } else {
        this.topBoundaryLaunchLimit--;
      }
    }
  }

  updateScore(currentColor) {
    this.scoreKeeper.calculate(currentColor);

    // animate scores
    this.scoreKeeper.mergeMap.forEach((bubble, idx) => {
      let { i, j, score } = bubble;
      let { x, y } = this.round.getCoordinates(i, j);

      let scoreText = this.add.bitmapText(x, y, "upheaval", score, MID_FONT_SIZE);
      scoreText.setOrigin(0.5, 0.5).setDepth(1);

      this.tweens.add({
        targets: scoreText,
        alpha: 0,
        y: y - 20,
        repeat: 0,
        duration: 600,
        ease: Phaser.Math.Easing.Linear,
        onComplete: () => {
          scoreText.destroy();
        },
      });
    });

    this.scoreKeeper.score += this.scoreKeeper.currentScore;

    this.tweens.addCounter({
      from: this.scoreKeeper.score,
      to: this.scoreKeeper.score + this.scoreKeeper.currentScore,
      duration: 600,
      ease: "linear",
      onUpdate: (tween) => {
        const value = Math.round(tween.getValue());
        this.scoreKeeper.score = value;
        this.totalScoreText.setText("SCORE " + this.scoreKeeper.score);
      },
    });

    this.scoreKeeper.refreshMaps();
  }

  checkLose() {
    this.currentBubble.setImmovable(true);
    // this.stopGame("LOSE");
    this.bubbles.children.each((child) => {
      child.destroy();
    });
    this.bubbles.destroy();
    this.optionsScene.gameLose.play();
    this.scene.start("LoseScene", { score: this.scoreKeeper.score });
  }

  checkWin() {
    if (!this.bubbles.children.size) {
      // this.stopGame("WIN");
      this.bubbles.children.each((child) => {
        child.destroy();
      });
      this.bubbles.destroy();
      this.optionsScene.gameWin.play();
      this.scene.start("WinScene", { score: this.scoreKeeper.score });
    }
  }
}

export default GameScene;
