import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene",
    });
    this.score = 100;
    this.myTurn = true;
    this.moveable = false;
    this.moveTarget = null;
    this.moveScopes = [];
    this.isGameOver = false;
    this.values = [
      "r",
      "n",
      "b",
      "q",
      "k",
      "b",
      "n",
      "r",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "t",
      "m",
      "v",
      "w",
      "l",
      "v",
      "m",
      "t",
    ];
    this.cl = null;
    this.ck = false;
    this.cr1 = false;
    this.cr2 = false;
    this.moveTarget = "";
    this.text = [];

    this.gameTimer = null;
    this.gtimeText = null;
    this.gtime = 120;
  }
  create() {
    this.optionsScene = this.game.scene.getScene("OptionsScene");
    this.sqs = [];
    this.fonts = {
      r: { Symbol: "♖", color: "black" },
      n: { Symbol: "♘", color: "black" },
      b: { Symbol: "♗", color: "black" },
      q: { Symbol: "♕", color: "black" },
      k: { Symbol: "♔", color: "black" },
      p: { Symbol: "♙", color: "black" },
      t: { Symbol: "♖", color: "white" },
      m: { Symbol: "♘", color: "white" },
      v: { Symbol: "♗", color: "white" },
      w: { Symbol: "♕", color: "white" },
      l: { Symbol: "♔", color: "white" },
      o: { Symbol: "♙", color: "white" },
      // Add additional symbols for pieces if needed
    };

    // Create the chessboard squares
    for (let i = 0; i < 64; i++) {
      let x = (i % 8) * 67;
      let y = Math.floor(i / 8) * 67;
      let sq = this.add
        .rectangle(x + 80, y + 42, 67, 67, 0xffffff)
        .setOrigin(0);
      sq.setInteractive();
      sq.on("pointerdown", () => this.handleSquareClick(i));
      this.sqs.push(sq);
    }

    this.updateBoard();

    this.gtimeText = this.add
      .text(
        this.scale.width / 2 + 160,
        10,
        "Remaining Time: " +
          Math.floor(this.gtime / 60) +
          "min " +
          (this.gtime % 60) +
          "s",
        {
          fontSize: 20,
          fontStyle: "bold",
        }
      )
      .setOrigin(1, 0);
    this.gameTimer = this.time.addEvent({
      loop: true,
      delay: 1000,
      paused: true,
      callback: () => {
        this.gtime -= 1;
        this.gtimeText.setText(
          "Remaining Time: " +
            Math.floor(this.gtime / 60) +
            "min " +
            (this.gtime % 60) +
            "s"
        );
      },
    });
    this.gameTimer.paused = false;
  }
  update() {
    if (this.gtime === 0) {
      this.gameOver();
    }
  }
  emptyBoard() {
    for (let x = 0; x < 64; x++) {
      if (this.sqs[x].text) {
        this.sqs[x].text.setText("");
      }
    }
  }

  updateBoard() {
    for (let x = 0; x < 64; x++) {
      this.sqs[x].fillColor =
        (x + Math.floor(x / 8)) % 2 === 0 ? 0x55afaf : 0x33dd33;
      this.sqs[x].setStrokeStyle(1.1, 0xffffff);
      if (this.values[x] !== 0) {
        this.sqs[x].text = this.add
          .text(
            this.sqs[x].x + 35,
            this.sqs[x].y + 35,
            this.fonts[this.values[x]].Symbol,
            {
              fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
              fontSize: "60px",
              color: this.fonts[this.values[x]].color,
              fontWeight: "bold",
            }
          )
          .setOrigin(0.5);
      }
    }
  }

  handleSquareClick(index) {
    if (this.myTurn) {
      this.check(index);
    }
  }

  check(index) {
    if (this.myTurn) {
      var n = index;
      var scopes = this.checkBlack(n, this.values) || [];

      // var x = n;

      if (!this.moveable) {
        if (scopes.length > 0) {
          this.moveable = true;
          this.moveTarget = n;
          this.moveScopes = scopes.join(",").split(",");
        } else {
        }
      } else {
        if (this.moveScopes.indexOf(String(n)) >= 0) {
          var checkArr = [];
          var saveKing = false;
          for (var z = 0; z < 64; z++) {
            checkArr[z] = this.values[z];
          }

          checkArr[n] = checkArr[this.moveTarget];
          checkArr[this.moveTarget] = 0;

          for (var y = 0; y < 64; y++) {
            if ("prnbkq".indexOf(checkArr[y]) >= 0) {
              var checkScp = this.checkWhite(y, checkArr) || [];
              for (var zz = 0; zz < checkScp.length; zz++) {
                if (checkArr[checkScp[zz]] === "l") {
                  if (!saveKing) {
                    // console.log("save your king");
                    let kingcheck = this.add
                      .text(210, 540 / 2, "Save Your King!!!", {
                        fontFamily:
                          'Georgia, "Goudy Bookletter 1911", Times, serif',
                        fontSize: "30px",
                        color: "red",
                        fontWeight: "bold",
                      })
                      .setDepth(2);

                    setTimeout(() => {
                      kingcheck.destroy();
                    }, 1500);
                    saveKing = true;
                  }
                }
              }
            }
          }

          if (!saveKing) {
            this.values[n] = this.values[this.moveTarget];
            this.values[this.moveTarget] = 0;
            if (this.cl) {
              if (n === 62 && this.moveTarget === 60) {
                this.values[63] = 0;
                this.values[61] = "t";
              } else if (n === 58 && this.moveTarget === 60) {
                this.values[59] = "t";
                this.values[56] = 0;
              }
            }
            if (this.moveTarget === 60) {
              this.ck = true;
            } else if (this.moveTarget === 63) {
              this.cr2 = true;
            } else if (this.moveTarget === 56) {
              this.cr1 = true;
            }
            if (this.values[n] === "o" && n < 8) {
              this.values[n] = "w";
            }
            this.moveable = false;
            this.scopes = [];
            this.myTurn = false;
            setTimeout(() => {
              this.chooseTurn();
            }, 1500);
          }
        } else {
          this.moveScopes = [];
          this.moveable = false;
        }
      }

      this.emptyBoard();
      this.updateBoard();

      for (var x = 0; x < scopes.length; x++) {
        this.sqs[scopes[x]].fillColor = 0xff00ff;
      }
    }

    const charactersToCheck = ["m", "v", "o", "w"];
    const found = this.values.some((value) =>
      charactersToCheck.includes(value)
    );
    if (!found) {
      this.gameOver(false);
    }
  }

  chooseTurn() {
    var approved = [];
    var actions = [];
    var effects = [];

    for (var n = 0; n < 64; n++) {
      if ("prnbqk".indexOf(this.values[n]) >= 0) {
        var scopes = this.checkWhite(n, this.values) || [];
        for (var x = 0; x < scopes.length; x++) {
          var tmp = []; //values.join(',').split(',');
          for (var xx = 0; xx < 64; xx++) {
            tmp[xx] = this.values[xx];
          }
          var effect = 0;
          var action = Math.random() * 3;
          //Action value
          var actionValue = tmp[scopes[x]];
          if (actionValue === "l") {
            action = 100 + Math.random() * 3;
          } else if (actionValue === "w") {
            action = 50 + Math.random() * 3;
          } else if (actionValue === "v") {
            action = 30 + Math.random() * 3;
          } else if (actionValue === "m") {
            action = 30 + Math.random() * 3;
          } else if (actionValue === "t") {
            action = 30 + Math.random() * 3;
          } else if (actionValue === "o") {
            action = 15 + Math.random() * 3;
          }
          //Effect value
          tmp[scopes[x]] = tmp[n];
          tmp[n] = 0;
          for (var y = 0; y < 64; y++) {
            if ("otmvlw".indexOf(this.values[y]) >= 0) {
              var tmpScp = this.checkBlack(y, tmp) || [];
              for (var z = 0; z < tmpScp.length; z++) {
                var effectValue = tmp[tmpScp[z]];
                if (effectValue === "k") {
                  if (effect < 100) {
                    effect = 100;
                  }
                } else if (effectValue === "q") {
                  if (effect < 50) {
                    effect = 50;
                  }
                } else if (effectValue === "b") {
                  if (effect < 30) {
                    effect = 30;
                  }
                } else if (effectValue === "n") {
                  if (effect < 30) {
                    effect = 30;
                  }
                } else if (effectValue === "r") {
                  if (effect < 30) {
                    effect = 30;
                  }
                } else if (effectValue === "p") {
                  if (effect < 15) {
                    effect = 15;
                  }
                }
              }
            }
          }

          actions.push(action);
          effects.push(effect);
          approved.push(n + "-" + scopes[x]);
        }
      }
    }

    //alert(actions);

    var bestEffect = Math.min.apply(null, effects);
    //alert(bestEffect);
    if (bestEffect >= 100) {
      this.gameOver(true);
      setTimeout(function () {
        this.values = [
          "r",
          "n",
          "b",
          "q",
          "k",
          "b",
          "n",
          "r",
          "p",
          "p",
          "p",
          "p",
          "p",
          "p",
          "p",
          "p",
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "o",
          "o",
          "o",
          "o",
          "o",
          "o",
          "o",
          "o",
          "t",
          "m",
          "v",
          "w",
          "l",
          "v",
          "m",
          "t",
        ];
      }, 1000);
    }

    var tmpA = [];
    var tmpB = [];
    var tmpC = [];
    var bestMove = "";

    for (var nn = 0; nn < effects.length; nn++) {
      if (effects[nn] === bestEffect) {
        tmpA.push(actions[nn]);
        tmpB.push(approved[nn]);
        tmpC.push(effects[nn]);
      }
    }
    bestMove = tmpB[tmpA.indexOf(Math.max.apply(null, tmpA))];

    if (bestMove) {
      this.values[Number(bestMove.split("-")[1])] =
        this.values[Number(bestMove.split("-")[0])];
      this.values[Number(bestMove.split("-")[0])] = 0;
      if (
        this.values[Number(bestMove.split("-")[1])] === "p" &&
        Number(bestMove.split("-")[1]) >= 56
      ) {
        this.values[Number(bestMove.split("-")[1])] = "q";
      }

      this.emptyBoard();
      this.updateBoard();

      this.myTurn = true;
    } else {
    }
  }

  checkBlack(n, values) {
    var target = values[n];
    var scopes = [];
    var x = n;
    if (target === "o") {
      x -= 8;
      if ("prnbkq".indexOf(values[x - 1]) >= 0 && x % 8 !== 0) {
        scopes.push(x - 1);
      }
      if ("prnbkq".indexOf(values[x + 1]) >= 0 && x % 8 !== 7) {
        scopes.push(x + 1);
      }
      if (x >= 0 && values[x] === 0) {
        scopes.push(x);
        if (x >= 40) {
          if (x - 8 >= 0 && values[x - 8] === 0) {
            scopes.push(x - 8);
          }
        }
      }
    } else if (target === "t") {
      x = n;
      x -= 8;
      while (x >= 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 8;
      }
      x = n;
      x += 8;
      while (x < 64) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 8;
      }
      x = n;
      x++;
      while (x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x++;
      }
      x = n;
      x--;
      while (x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x--;
      }
    } else if (target === "m") {
      x = n;
      if (x % 8 > 1 && x % 8 < 6) {
        x -= 17;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x -= 15;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;
        x -= 10;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x -= 6;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 6;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 10;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 15;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 17;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      } else {
        x = n;
        if (x % 8 <= 1) {
          x = n;
          x -= 15;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x -= 6;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 10;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 17;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
        }
        x = n;
        if (x % 8 === 1) {
          x -= 17;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 15;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
        }
        if (x % 8 >= 6) {
          x = n;
          x -= 17;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x -= 10;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 6;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 15;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
        }
        x = n;
        if (x % 8 === 6) {
          x = n;
          x -= 15;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 17;
          if (
            ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
        }
      }
    } else if (target === "v") {
      x = n;
      x -= 9;
      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 9;
      }
      x = n;
      x += 7;
      while (x < 64 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 7;
      }
      x = n;
      x += 9;
      while (x % 8 !== 0 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 9;
      }
      x = n;
      x -= 7;
      while (x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 7;
      }
    } else if (target === "w") {
      x = n;
      x -= 8;
      while (x >= 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 8;
      }
      x = n;
      x += 8;
      while (x < 64) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 8;
      }
      x = n;
      x++;
      while (x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x++;
      }
      x = n;
      x--;
      while (x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x--;
      }
      x = n;
      x -= 9;
      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 9;
      }
      x = n;
      x += 7;
      while (x < 64 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 7;
      }
      x = n;
      x += 9;
      while (x % 8 !== 0 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 9;
      }
      x = n;
      x -= 7;
      while (x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 7;
      }
    } else if (target === "l") {
      x = n;
      x += 8;
      if (
        ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
        x < 64 &&
        x >= 0
      ) {
        scopes.push(x);
      }
      x = n;
      x -= 8;
      if (
        ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
        x < 64 &&
        x >= 0
      ) {
        scopes.push(x);
      }
      x = n;
      if (x % 8 > 0) {
        x = n;
        x -= 1;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x -= 9;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;
        x += 7;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      }
      x = n;
      if (x % 8 < 7) {
        x = n;
        x += 1;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 9;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x -= 7;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      }
      x = n;
      if (!this.ck) {
        this.cl = false;
        if (!this.cr2) {
          //    cl = false;
          if (
            values[n + 1] === 0 &&
            values[n + 2] === 0 &&
            values[n + 3] === "t"
          ) {
            scopes.push(x + 2);
            this.cl = true;
          }
        }
        if (!this.cr1) {
          //    cl = false;
          if (
            values[n - 1] === 0 &&
            values[n - 2] === 0 &&
            values[n - 3] === 0 &&
            values[n - 4] === "t"
          ) {
            scopes.push(x - 2);
            this.cl = true;
          }
        }
      }
    }
    if (scopes.length) return scopes;
  }

  checkWhite(n, values) {
    var target = values[n];
    var scopes = [];
    var x = n;
    if (target === "p") {
      x += 8;
      if ("otmvlw".indexOf(values[x - 1]) >= 0 && x % 8 !== 0) {
        scopes.push(x - 1);
      }
      if ("otmvlw".indexOf(values[x + 1]) >= 0 && x % 8 !== 7) {
        scopes.push(x + 1);
      }
      if (x < 64 && values[x] === 0) {
        scopes.push(x);
        if (x <= 23) {
          if (x + 8 >= 0 && values[x + 8] === 0) {
            scopes.push(x + 8);
          }
        }
      }
    } else if (target === "r") {
      x = n;
      x -= 8;
      while (x >= 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 8;
      }
      x = n;
      x += 8;
      while (x < 64) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 8;
      }
      x = n;
      x++;
      while (x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x++;
      }
      x = n;
      x--;
      while (x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x--;
      }
    } else if (target === "n") {
      x = n;
      if (x % 8 > 1 && x % 8 < 6) {
        x -= 17;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x -= 15;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;
        x -= 10;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x -= 6;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 6;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 10;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 15;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 17;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      } else {
        x = n;
        if (x % 8 <= 1) {
          x = n;
          x -= 15;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x -= 6;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 10;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 17;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
        }
        x = n;
        if (x % 8 === 1) {
          x -= 17;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 15;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
        }
        if (x % 8 >= 6) {
          x = n;
          x -= 17;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x -= 10;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 6;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 15;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
        }
        x = n;
        if (x % 8 === 6) {
          x = n;
          x -= 15;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
          x = n;
          x += 17;
          if (
            ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
            x < 64 &&
            x >= 0
          ) {
            scopes.push(x);
          }
        }
      }
    } else if (target === "b") {
      x = n;
      x -= 9;
      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 9;
      }
      x = n;
      x += 7;
      while (x < 64 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 7;
      }
      x = n;
      x += 9;
      while (x % 8 !== 0 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 9;
      }
      x = n;
      x -= 7;
      while (x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 7;
      }
    } else if (target === "q") {
      x = n;
      x -= 8;
      while (x >= 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 8;
      }
      x = n;
      x += 8;
      while (x < 64) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 8;
      }
      x = n;
      x++;
      while (x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x++;
      }
      x = n;
      x--;
      while (x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x--;
      }
      x = n;
      x -= 9;
      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 9;
      }
      x = n;
      x += 7;
      while (x < 64 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 7;
      }
      x = n;
      x += 9;
      while (x % 8 !== 0 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 9;
      }
      x = n;
      x -= 7;
      while (x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 7;
      }
    } else if (target === "k") {
      x = n;
      x += 8;
      if (
        ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
        x < 64 &&
        x >= 0
      ) {
        scopes.push(x);
      }
      x = n;
      x -= 8;
      if (
        ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
        x < 64 &&
        x >= 0
      ) {
        scopes.push(x);
      }
      x = n;
      if (x % 8 > 0) {
        x = n;
        x -= 1;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x -= 9;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;
        x += 7;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      }
      x = n;
      if (x % 8 < 7) {
        x = n;
        x += 1;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x += 9;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;
        x -= 7;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      }
    }
    if (scopes.length) return scopes;
  }

  reset() {
    this.myTurn = true; // Player's turn
    this.moveable = false; // Whether a move is possible
    this.moveTarget = null; // Target square for the move
    this.moveScopes = []; // Scopes of possible moves
    this.isGameOver = false; // Game over flag
    this.values = [
      "r",
      "n",
      "b",
      "q",
      "k",
      "b",
      "n",
      "r",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      "p",
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "t",
      "m",
      "v",
      "w",
      "l",
      "v",
      "m",
      "t",
    ]; // Chessboard setup with initial pieces
    this.cl = null;
    this.ck = false;
    this.cr1 = false;
    this.cr2 = false;
    this.moveTarget = "";
    this.text = [];
    this.gtime = 60;
    this.emptyBoard();
    this.updateBoard();
  }
  gameOver(win) {
    if (win === true) {
      this.optionsScene.gameWin.play();
      this.scene.start("WinScene", { score: this.score });
    } else {
      this.optionsScene.gameLose.play();
      this.scene.start("LoseScene", { score: this.score });
    }
    this.reset();
  }
}
export default GameScene;
