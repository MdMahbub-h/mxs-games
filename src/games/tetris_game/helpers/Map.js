import Phaser from "phaser";
import { MAP_MARGIN_X, MAP_MARGIN_Y, PIECE_SIZE, checkYLine, convertFromMapToWidth, convertFromWidthToMap, convertValuesForSetPiece } from "./utils";

class Map {
  constructor(scene) {
    this.yArrayLength = 20;
    this.xArrayLength = 10;
    this.tetrisMap = [];
    this.createMap();
    this.scene = scene;
  }

  createMap() {
    for (let i = 0; i < this.yArrayLength; i++) {
      this.tetrisMap[i] = [];

      for (let j = 0; j < this.xArrayLength; j++) {
        this.tetrisMap[i][j] = 0;
      }
    }
  }

  getMap() {
    return this.tetrisMap;
  }

  getMapPosition(d1, d2) {
    return this.tetrisMap[d1][d2];
  }

  getNewSetPiecePosition(pieceMap) {
    let xArr = Phaser.Math.Between(4, this.xArrayLength);
    let yArr = 0;
    let contadorPieceX = 0;
    let contadorPieceY = 0;

    for (let i = xArr - 4; i < xArr; i++) {
      //Drawing X

      for (let j = 0; j < 4; j++) {
        //Drawing Y

        let valueMap = convertValuesForSetPiece(pieceMap[contadorPieceY][contadorPieceX]);
        this.setMapPosition(j, i, valueMap);
        contadorPieceY++;
      }
      contadorPieceY = 0;
      contadorPieceX++;
    }

    let x = (xArr - 4) * PIECE_SIZE + MAP_MARGIN_X;
    let y = yArr * PIECE_SIZE + MAP_MARGIN_Y;

    return { x, y };
  }

  clearMap(completely) {
    for (let i = 0; i < this.yArrayLength; i++) {
      for (let j = 0; j < this.xArrayLength; j++) {
        if (!completely && this.tetrisMap[i][j] === 3) continue;

        this.tetrisMap[i][j] = 0;
      }
    }
  }

  ////// SPECIAL TURN PIECES LIMIT
  isTurnLimit(ps, side, possiblePiece) {
    let { xArr, yArr } = convertFromWidthToMap(ps.x, ps.y);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (possiblePiece[i][j] === 1) {
          let value = this.getMapPosition(i + yArr, j + xArr);

          //limit touching other pieces
          if (value === 3) return true;
          //Special Pieces rotation
          if (j + xArr > 9) return this.drawSetPieceTurningOnSideLimit(ps, "rightLimit", possiblePiece);
          else if (j + xArr < 0) return this.drawSetPieceTurningOnSideLimit(ps, "leftLimit", possiblePiece);
        }
      }
    }

    return false;
  }

  drawSetPieceTurningOnSideLimit(ps, sideLimit, possiblePiece) {
    this.clearMap();
    let { yArr } = convertFromWidthToMap(ps.x, ps.y);
    let i2 = 0;
    let j2 = 0;
    for (i2 = 0; i2 < 4; i2++) {
      for (j2 = 0; j2 < 4; j2++) {
        if (possiblePiece[i2][j2] === 1) {
          if (sideLimit === "rightLimit") this.setMapPosition(yArr + i2, this.xArrayLength - j2, 2);
          else this.setMapPosition(yArr + i2, j2, 2);
        }
      }
    }

    if (sideLimit === "rightLimit") {
      let contador = checkYLine(possiblePiece, 4, 0) ? 1 : 0;
      return convertFromMapToWidth(this.xArrayLength - (j2 - contador), yArr);
    } else return convertFromMapToWidth(0, yArr);
  }

  ////// GENERAL SIDE LIMIT
  isSideLimit(ps, side) {
    //Wall Collide
    for (let i = 0; i < this.yArrayLength; i++) {
      for (let j = 0; j < this.xArrayLength; j++) {
        if (this.tetrisMap[i][side === "right" ? this.xArrayLength - 1 : 0] === 2) return true;
      }
    }
    //Piece collide
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.getMapPosition(ps.yArr + i, ps.xArr + j + (side === "right" ? 1 : -1)) === 2 && this.getMapPosition(ps.yArr + i, ps.xArr + j + (side === "right" ? 2 : -2)) == 3) {
          return true;
        }
      }
    }

    return false;
  }

  ////// GENERAL DOWN LIMIT

  isDownLimit(ps) {
    // Contact piece with piece
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.getLastYpiece(ps, j, i) === 2) {
          if (this.isTouchingFloor(ps) || this.isTouchingDownPiece(ps, j, i)) return true;
        }
      }
    }

    return false;
  }

  getLastYpiece(ps, y, x) {
    return this.getMapPosition(ps.yArr + y, ps.xArr + x);
  }

  isTouchingDownPiece(ps, y, x) {
    return this.getMapPosition(ps.yArr + y + 1, ps.xArr + x) === 3;
  }

  isTouchingFloor(ps) {
    return ps.yArr + 4 === this.yArrayLength;
  }

  ////// MOVE AND TURN

  movementPieceSet(ps, x, y, pieceMap) {
    this.clearMap();

    let contadorX = 0;
    let contadorY = 0;

    for (let i = ps.xArr; i < ps.xArr + 4; i++) {
      for (let j = ps.yArr; j < ps.yArr + 4; j++) {
        let valueMap = convertValuesForSetPiece(pieceMap[contadorY][contadorX]);
        if (valueMap === 2) this.setMapPosition(j, i, valueMap);

        contadorY++;
      }
      contadorY = 0;
      contadorX++;
    }

    this.mapDrawer(ps);
  }

  tearDownPiece() {
    for (let i = 0; i < this.yArrayLength; i++) {
      for (let j = 0; j < this.xArrayLength; j++) {
        if (this.tetrisMap[i][j] === 2) this.tetrisMap[i][j] = 3;
      }
    }
  }

  ///////// SETTER /////////
  setMapPosition(d1, d2, value) {
    this.tetrisMap[d1][d2] = value;
  }

  ///////// MAP DRAWER /////////
  mapDrawer(ps) {
    if (this.scene.gameOver) return;
    this.scene.imageGroup.clear(true);
    for (let i = 0; i < this.xArrayLength; i++) {
      for (let j = 0; j < this.yArrayLength; j++) {
        if (this.tetrisMap[j][i] === 2) {
          let { x, y } = convertFromMapToWidth(i, j);
          let square = this.scene.add.image(x, y, ps.pieceColorHash).setOrigin(0, 0);
          this.scene.imageGroup.add(square);
        }
        if (this.tetrisMap[j][i] === 3) {
          let { x, y } = convertFromMapToWidth(i, j);
          //let square = this.scene.add.rectangle( x, y, PIECE_SIZE, PIECE_SIZE, 0x000000 ).setOrigin(0,0)
          let square = this.scene.add.image(x, y, "grayTile").setOrigin(0, 0);
          this.scene.imageGroup.add(square);
        }
      }
    }
  }

  ///////// MOVEMENT /////////
  downCicle() {
    let olderState = null;
    let newState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < this.yArrayLength; i++) {
      olderState = this.tetrisMap[i];

      for (let j = 0; j < this.xArrayLength; j++) {
        if (this.tetrisMap[i][j] === 3) newState[j] = 3;
        if (olderState[j] === 3) olderState[j] = 0;
      }

      this.tetrisMap[i] = newState;
      newState = olderState;
    }
  }

  ///////// COMBO /////////
  comboVerify() {
    if (this.scene.gameOver) return;
    for (var i = 0; i < this.yArrayLength; i++) {
      for (var j = 0; j < this.xArrayLength; j++) {
        if (this.tetrisMap[i][j] !== 3) break;
        if (j === this.xArrayLength - 1) {
          this.breakComboLine(i);
          this.scene.incrSpeed();
        }
      }
    }

    return false;
  }

  breakComboLine(y) {
    for (var i = this.yArrayLength - 1; i >= 0; i--) {
      for (var j = 0; j < this.xArrayLength; j++) {
        if (i <= y && this.tetrisMap[i][j] === 3) {
          var posY = i - 1;
          this.tetrisMap[i][j] = this.tetrisMap[posY][j];
        }
      }
    }
  }
}

export default Map;
