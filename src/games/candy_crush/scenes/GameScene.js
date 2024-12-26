import Phaser from "phaser";
import Match3 from "../helpers/Match3";

const gameOptions = {
  gemSize: 60,
  swapSpeed: 200,
  fallSpeed: 100,
  destroySpeed: 200,
  boardOffset: {
    x: 20,
    y: 60,
  },
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.userData = this.game.registry.get("user_data");
    this.gameData = this.game.registry.get("game_data");

    this.score = 0;
    this.timeLeft = this.gameData.gameTime;
    this.timeText = null;
    this.scoreText = null;
    this.isGameOver = false;

    this.optionsScene = this.game.scene.getScene("OptionsScene");
    this.match3 = new Match3({
      rows: 8,
      columns: 8,
      items: 6,
    });
    this.match3.generateField();
    this.canPick = true;
    this.dragging = false;
    this.timeLeft = this.gameData.gameTime;
    this.isGameOver = false;
    this.drawField();
    this.input.on("pointerdown", this.gemSelect, this);

    this.add.rectangle(0, 0, this.scale.width, 50, 0x111185, 0.8).setOrigin(0, 0);

    //create score text
    this.scoreText = this.add
      .text(20, 10, "Score: " + this.match3.score, {
        font: "25px Arial",
        fill: "#fff",
      })
      .setOrigin(0, 0);

    // Create time text
    this.timeText = this.add
      .text(this.scale.width - 60, 10, "Time: " + this.timeLeft, {
        font: "25px Arial",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(1, 0);

    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTime,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    this.scoreText.setText(`Score: ${this.match3.score}`);
    if (this.match3.score >= this.gameData.winScore && !this.isGameOver) {
      this.gameWin();
    }
  }

  updateTime() {
    this.timeLeft--;

    this.timeText.setText(`Time: ${this.timeLeft}`);
    if (this.timeLeft <= 0) {
      this.time.removeEvent(this.timer);
      this.gameLose();
    }
  }

  gameLose() {
    this.isGameOver = true;
    this.scene.stop();
    this.scene.start("LoseScene");
  }

  gameWin() {
    this.isGameOver = true;
    this.scene.stop();
    this.scene.start("WinScene");
  }

  drawField() {
    this.poolArray = [];
    for (let i = 0; i < this.match3.getRows(); i++) {
      for (let j = 0; j < this.match3.getColumns(); j++) {
        let gemX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
        let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2;
        let gem = this.add.sprite(gemX, gemY, "gems", this.match3.valueAt(i, j));
        this.match3.setCustomData(i, j, gem);
      }
    }
  }

  gemSelect(pointer) {
    if (this.canPick && !this.isGameOver) {
      this.dragging = true;
      let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
      let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
      if (this.match3.validPick(row, col)) {
        let selectedGem = this.match3.getSelectedItem();
        if (!selectedGem) {
          this.match3.customDataOf(row, col).setScale(1.2);
          this.match3.customDataOf(row, col).setDepth(1);
          this.match3.setSelectedItem(row, col);
        } else {
          if (this.match3.areTheSame(row, col, selectedGem.row, selectedGem.column)) {
            this.match3.customDataOf(row, col).setScale(1);
            this.match3.deleselectItem();
          } else {
            if (this.match3.areNext(row, col, selectedGem.row, selectedGem.column)) {
              this.match3.customDataOf(selectedGem.row, selectedGem.column).setScale(1);
              this.match3.deleselectItem();
              this.swapGems(row, col, selectedGem.row, selectedGem.column, true);
            } else {
              this.match3.customDataOf(selectedGem.row, selectedGem.column).setScale(1);
              this.match3.customDataOf(row, col).setScale(1.2);
              this.match3.setSelectedItem(row, col);
            }
          }
        }
      }
    }
  }

  swapGems(row, col, row2, col2, swapBack) {
    let movements = this.match3.swapItems(row, col, row2, col2);
    this.swappingGems = 2;
    this.canPick = false;
    movements.forEach(
      function (movement) {
        this.tweens.add({
          targets: this.match3.customDataOf(movement.row, movement.column),
          x: this.match3.customDataOf(movement.row, movement.column).x + gameOptions.gemSize * movement.deltaColumn,
          y: this.match3.customDataOf(movement.row, movement.column).y + gameOptions.gemSize * movement.deltaRow,
          duration: gameOptions.swapSpeed,
          callbackScope: this,
          onComplete: function () {
            this.swappingGems--;
            if (this.swappingGems == 0) {
              if (!this.match3.matchInBoard()) {
                if (swapBack) {
                  this.swapGems(row, col, row2, col2, false);
                } else {
                  this.canPick = true;
                }
              } else {
                this.handleMatches();
              }
            }
          },
        });
      }.bind(this)
    );
  }

  handleMatches() {
    let gemsToRemove = this.match3.getMatchList();
    let destroyed = 0;
    gemsToRemove.forEach(
      function (gem) {
        this.poolArray.push(this.match3.customDataOf(gem.row, gem.column));
        destroyed++;
        this.tweens.add({
          targets: this.match3.customDataOf(gem.row, gem.column),
          alpha: 0,
          duration: gameOptions.destroySpeed,
          callbackScope: this,
          onComplete: function (event, sprite) {
            destroyed--;
            if (destroyed == 0) {
              this.makeGemsFall();
            }
          },
        });
      }.bind(this)
    );
  }

  makeGemsFall() {
    let moved = 0;
    this.match3.removeMatches();
    let fallingMovements = this.match3.arrangeBoardAfterMatch();
    fallingMovements.forEach(
      function (movement) {
        moved++;
        this.tweens.add({
          targets: this.match3.customDataOf(movement.row, movement.column),
          y: this.match3.customDataOf(movement.row, movement.column).y + movement.deltaRow * gameOptions.gemSize,
          duration: gameOptions.fallSpeed * Math.abs(movement.deltaRow),
          callbackScope: this,
          onComplete: function () {
            moved--;
            if (moved == 0) {
              this.endOfMove();
            }
          },
        });
      }.bind(this)
    );
    let replenishMovements = this.match3.replenishBoard();
    replenishMovements.forEach(
      function (movement) {
        moved++;
        let sprite = this.poolArray.pop();
        sprite.alpha = 1;
        sprite.y = gameOptions.boardOffset.y + gameOptions.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions.gemSize / 2;
        sprite.x = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2;
        sprite.setFrame(this.match3.valueAt(movement.row, movement.column));
        this.match3.setCustomData(movement.row, movement.column, sprite);
        this.tweens.add({
          targets: sprite,
          y: gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2,
          duration: gameOptions.fallSpeed * movement.deltaRow,
          callbackScope: this,
          onComplete: function () {
            moved--;
            if (moved === 0) {
              this.endOfMove();
            }
          },
        });
      }.bind(this)
    );
  }

  endOfMove() {
    if (this.match3.matchInBoard()) {
      this.time.addEvent({
        delay: 250,
        callback: this.handleMatches(),
      });
    } else {
      this.canPick = true;
      this.selectedGem = null;
    }
  }
}

export default GameScene;
