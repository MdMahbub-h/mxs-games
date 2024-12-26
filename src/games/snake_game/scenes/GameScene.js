/* eslint-disable default-case */
import Phaser from "phaser";

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

class Food extends Phaser.GameObjects.Image {
  total = 0;

  constructor(scene, x, y, cellSize, offsetTop) {
    super(scene, x * cellSize, y * cellSize + offsetTop, "food");
    this.setOrigin(0);
    scene.children.add(this);
  }

  eat() {
    this.total++;
  }
}

class Snake {
  constructor(scene, x, y, cellSize, offsetTop) {
    this.offsetTop = offsetTop;
    this.cellSize = cellSize;
    this.alive = true;
    this.speed = 200;
    this.moveTime = 0;
    this.heading = RIGHT;
    this.direction = RIGHT;

    this.headPosition = new Phaser.Geom.Point(x, y);
    this.body = scene.add.group();
    this.head = this.body.create(
      x * cellSize,
      y * cellSize + offsetTop,
      "head"
    );
    this.head.setOrigin(0);
    this.tail = new Phaser.Geom.Point(x, y);
    this.grow();
  }

  update(time) {
    if (time >= this.moveTime) {
      return this.move(time);
    }
  }

  faceLeft() {
    if (this.direction === UP || this.direction === DOWN) {
      this.heading = LEFT;
    }
  }

  faceRight() {
    if (this.direction === UP || this.direction === DOWN) {
      this.heading = RIGHT;
    }
  }

  faceUp() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = UP;
    }
  }

  faceDown() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = DOWN;
    }
  }

  move(time) {
    switch (this.heading) {
      case LEFT:
        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 20);
        break;

      case RIGHT:
        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 20);
        break;

      case UP:
        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 14);
        break;

      case DOWN:
        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 14);
        break;
    }

    this.direction = this.heading;

    Phaser.Actions.ShiftPosition(
      this.body.getChildren(),
      this.headPosition.x * this.cellSize,
      this.headPosition.y * this.cellSize + this.offsetTop,
      1,
      this.tail
    );

    const hitBody = Phaser.Actions.GetFirst(
      this.body.getChildren(),
      { x: this.head.x, y: this.head.y },
      1
    );

    if (hitBody) {
      this.alive = false;
      return false;
    } else {
      this.moveTime = time + this.speed;
      return true;
    }
  }

  grow() {
    let newPart = this.body.create(this.tail.x, this.tail.y, "body");
    newPart.setOrigin(0);
  }

  collideWithFood(food) {
    if (this.head.x === food.x && this.head.y === food.y) {
      this.grow();
      food.eat();

      if (this.speed > 50 && food.total % 5 === 0) {
        this.speed -= 5;
      }

      return true;
    } else {
      return false;
    }
  }

  updateGrid(grid) {
    this.body.children.each(function (segment) {
      let bx = segment.x / this.cellSize;
      let by = (segment.y - this.offsetTop) / this.cellSize;
      grid[by][bx] = false;
    }, this);

    return grid;
  }
}

class GameScene extends Phaser.Scene {
  offsetTop = 48;
  cellSize = 38;

  constructor() {
    super({
      key: "GameScene",
      physics: { arcade: { gravity: { y: 0 } } },
    });
    this.snake = null;
    this.food = null;
    this.cursors = null;
    this.score = 0;
    this.scoreText = null;
  }

  create() {
    this.optionsScene = this.scene.get("OptionsScene");
    this.scoreText = this.add.text(30, 10, "Score: 0", {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#ffffff",
    });

    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff);
    graphics.beginPath();
    graphics.moveTo(0, this.offsetTop);
    graphics.lineTo(this.scale.width, this.offsetTop);
    graphics.closePath();
    graphics.strokePath();

    this.food = new Food(this, 3, 4, this.cellSize, this.offsetTop);
    this.snake = new Snake(this, 8, 3, this.cellSize, this.offsetTop);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    if (!this.snake.alive) {
      this.scene.start("LoseScene", { score: this.score });
      this.score = 0;
    } else {
      if (this.score >= 500) {
        this.scene.start("WinScene", { score: this.score });
      }
    }

    if (this.cursors.left.isDown) {
      this.snake.faceLeft();
    } else if (this.cursors.right.isDown) {
      this.snake.faceRight();
    } else if (this.cursors.up.isDown) {
      this.snake.faceUp();
    } else if (this.cursors.down.isDown) {
      this.snake.faceDown();
    }

    if (this.snake.update(time)) {
      if (this.snake.collideWithFood(this.food)) {
        this.score += 10;
        this.optionsScene.eatSound.play();
        this.scoreText.setText("Score: " + this.score);
        this.repositionFood();
      }
    }
  }

  repositionFood() {
    const testGrid = [];
    for (let y = 0; y < 14; y++) {
      testGrid[y] = [];

      for (let x = 0; x < 20; x++) {
        testGrid[y][x] = true;
      }
    }
    this.snake.updateGrid(testGrid);

    const validLocations = [];

    for (let y = 0; y < 14; y++) {
      for (let x = 0; x < 20; x++) {
        if (testGrid[y][x] === true) {
          validLocations.push({ x: x, y: y });
        }
      }
    }

    if (validLocations.length > 0) {
      const pos = Phaser.Math.RND.pick(validLocations);
      this.food.setPosition(
        pos.x * this.cellSize,
        pos.y * this.cellSize + this.offsetTop
      );
      return true;
    } else {
      return false;
    }
  }
}

export default GameScene;
