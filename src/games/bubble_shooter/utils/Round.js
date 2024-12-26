import Phaser from "phaser";
import { EntityMap } from "./EntityMap";
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE, ANCHOR_OFFSET, LAUNCHER_HEIGHT, ROUND_MODE_1, ROUND_MODE_2, COLUMNS, TOTAL_LINES, BUBBLE_LINES } from "./Constants";

class Round {
  constructor() {
    let round = this.getArray();
    this.matrix = round.map((row) => row.slice());
    this.selection = new Set();
    this.topRow = 0;

    if (this.matrix.length && this.matrix[0].length) {
      this.rows = this.matrix.length;
      this.cols = this.matrix[0].length;

      if (this.cols === ROUND_MODE_1) {
        this.startX = TILE_SIZE;
        this.endX = CANVAS_WIDTH - TILE_SIZE;
        this.startY = TILE_SIZE;
        this.endY = CANVAS_HEIGHT - LAUNCHER_HEIGHT;
      }

      if (this.cols === ROUND_MODE_2) {
        this.startX = 5 * TILE_SIZE + ANCHOR_OFFSET;
        this.endX = CANVAS_WIDTH - 5 * TILE_SIZE - ANCHOR_OFFSET;
        this.startY = TILE_SIZE;
        this.endY = CANVAS_HEIGHT - LAUNCHER_HEIGHT;
      }
    }
  }

  getArray() {
    let rows = [];
    for (let i = 0; i < BUBBLE_LINES; i++) {
      let cols = [];
      for (let j = 0; j < COLUMNS - 3; j++) {
        let col = Phaser.Math.Between(0, 9);
        cols.push(col);
      }
      let rnd = Phaser.Math.Between(0, 9);
      let col = i % 2 === 0 ? rnd : null;
      cols.push(col);
      rows.push(cols);
    }
    for (let i = 0; i < TOTAL_LINES - BUBBLE_LINES; i++) {
      let cols = [];
      for (let j = 0; j < COLUMNS - 3; j++) {
        let col = 0;
        cols.push(col);
      }
      let col = i % 2 === 0 ? 0 : null;
      cols.push(col);
      rows.push(cols);
    }

    let cols = [];
    for (let j = 0; j < COLUMNS - 2; j++) {
      let col = -1;
      cols.push(col);
    }
    rows.push(cols);
    return rows;
  }

  getCoordinates(i, j) {
    if (i < 0 || j < 0) return;
    let xOffset = this.matrix[i][this.cols - 1] === null ? ANCHOR_OFFSET : 0;
    let x = this.startX + ANCHOR_OFFSET + j * TILE_SIZE + xOffset;
    let y = this.startY + ANCHOR_OFFSET + i * TILE_SIZE;
    return { x, y };
  }

  getIndices(x, y) {
    if (x < 0 || y < 0) return;
    let i = Math.round((y - this.startY - ANCHOR_OFFSET) / TILE_SIZE);
    let xOffset = this.matrix[i][this.cols - 1] === null ? ANCHOR_OFFSET : 0;
    let j = Math.round((x - this.startX - ANCHOR_OFFSET - xOffset) / TILE_SIZE);
    return { i, j };
  }

  shiftTopBoundary() {
    // add blocks on top
    let topRow = [];
    for (let i = 0; i < this.cols; i++) {
      topRow.push(EntityMap.zero);
    }

    // remove last row
    this.matrix.unshift(topRow);

    // push out of bounds on bottom
    let outOfBounds = this.matrix.pop();
    let validMatrix = this.matrix[this.rows - 1].every((el) => el === EntityMap.zero || el === EntityMap.empty || el === EntityMap.gold);

    if (validMatrix) {
      this.matrix.pop();
      this.matrix.push(outOfBounds);
      this.topRow++;
    }

    return validMatrix;
  }

  getBubbleHash(i, j) {
    return `${i}_${j}`;
  }

  fromBubbleHash(hash) {
    let bubble = {};
    let [i, j] = hash.split("_");
    i = parseInt(i);
    j = parseInt(j);
    bubble.indices = { i, j };
    bubble.colorCode = this.matrix[i][j];
    return bubble;
  }

  isBubble(i, j) {
    if (i >= 0 && i < this.rows && j >= 0 && j < this.cols) {
      return this.matrix[i][j] >= EntityMap.BUBBLE_START && this.matrix[i][j] <= EntityMap.BUBBLE_END;
    } else {
      return false;
    }
  }

  isSmallRow(i) {
    return this.matrix[i][this.cols - 1] === null;
  }

  addSelection(colorCode) {
    this.selection.add(colorCode);
  }

  clearSelection() {
    if (this.selection.size > 2) {
      this.selection.clear();
    }
  }

  getRandomBubbleColor() {
    let colors = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!colors.includes(this.matrix[i][j])) colors.push(this.matrix[i][j]);
      }
    }
    let avaiableColors = colors.filter((n) => n > 0);
    let rnd = Phaser.Math.Between(0, avaiableColors.length - 1);
    return avaiableColors[rnd];
  }

  checkExistBubbleColor(colorCode) {
    let colors = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!colors.includes(this.matrix[i][j])) colors.push(this.matrix[i][j]);
      }
    }
    let avaiableColors = colors.filter((n) => n > 0);
    let color = colorCode;
    if (!avaiableColors.includes(colorCode)) {
      let rnd = Phaser.Math.Between(0, avaiableColors.length - 1);
      color = avaiableColors[rnd];
    }
    return color;
  }
}

export default Round;
