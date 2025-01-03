class Match3 {
  // constructor, simply turns obj information into class properties
  constructor(obj) {
    this.rows = obj.rows;
    this.columns = obj.columns;
    this.items = obj.items;
    this.score = 0;
  }

  // generates the game field
  generateField() {
    this.gameArray = [];
    this.selectedItem = false;
    for (let i = 0; i < this.rows; i++) {
      this.gameArray[i] = [];
      for (let j = 0; j < this.columns; j++) {
        do {
          let randomValue = Math.floor(Math.random() * this.items);
          this.gameArray[i][j] = {
            value: randomValue,
            isEmpty: false,
            row: i,
            column: j,
          };
        } while (this.isPartOfMatch(i, j));
      }
    }
  }

  // returns true if there is a match in the board
  matchInBoard() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.isPartOfMatch(i, j)) {
          return true;
        }
      }
    }
    return false;
  }

  // returns true if the item at (row, column) is part of a match
  isPartOfMatch(row, column) {
    return this.isPartOfHorizontalMatch(row, column) || this.isPartOfVerticalMatch(row, column);
  }

  // returns true if the item at (row, column) is part of an horizontal match
  isPartOfHorizontalMatch(row, column) {
    return (
      (this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column - 2)) ||
      (this.valueAt(row, column) === this.valueAt(row, column + 1) && this.valueAt(row, column) === this.valueAt(row, column + 2)) ||
      (this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column + 1))
    );
  }

  // returns true if the item at (row, column) is part of an horizontal match
  isPartOfVerticalMatch(row, column) {
    return (
      (this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row - 2, column)) ||
      (this.valueAt(row, column) === this.valueAt(row + 1, column) && this.valueAt(row, column) === this.valueAt(row + 2, column)) ||
      (this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row + 1, column))
    );
  }

  // returns the value of the item at (row, column), or false if it's not a valid pick
  valueAt(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    return this.gameArray[row][column].value;
  }

  // returns true if the item at (row, column) is a valid pick
  validPick(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] !== undefined && this.gameArray[row][column] !== undefined;
  }

  // returns the number of board rows
  getRows() {
    return this.rows;
  }

  // returns the number of board columns
  getColumns() {
    return this.columns;
  }

  // sets a custom data on the item at (row, column)
  setCustomData(row, column, customData) {
    this.gameArray[row][column].customData = customData;
  }

  // returns the custom data of the item at (row, column)
  customDataOf(row, column) {
    return this.gameArray[row][column].customData;
  }

  // returns the selected item
  getSelectedItem() {
    return this.selectedItem;
  }

  // set the selected item as a {row, column} object
  setSelectedItem(row, column) {
    this.selectedItem = {
      row: row,
      column: column,
    };
  }

  // deleselects any item
  deleselectItem() {
    this.selectedItem = false;
  }

  // checks if the item at (row, column) is the same as the item at (row2, column2)
  areTheSame(row, column, row2, column2) {
    return row == row2 && column == column2;
  }

  // returns true if two items at (row, column) and (row2, column2) are next to each other horizontally or vertically
  areNext(row, column, row2, column2) {
    return Math.abs(row - row2) + Math.abs(column - column2) == 1;
  }

  // swap the items at (row, column) and (row2, column2) and returns an object with movement information
  swapItems(row, column, row2, column2) {
    let tempObject = Object.assign(this.gameArray[row][column]);
    this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
    this.gameArray[row2][column2] = Object.assign(tempObject);
    return [
      {
        row: row,
        column: column,
        deltaRow: row - row2,
        deltaColumn: column - column2,
      },
      {
        row: row2,
        column: column2,
        deltaRow: row2 - row,
        deltaColumn: column2 - column,
      },
    ];
  }

  // return the items part of a match in the board as an array of {row, column} object
  getMatchList() {
    let matches = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.isPartOfMatch(i, j)) {
          matches.push({
            row: i,
            column: j,
          });
        }
      }
    }
    return matches;
  }

  // removes all items forming a match
  removeMatches() {
    let matches = this.getMatchList();
    matches.forEach(
      function (item) {
        this.setEmpty(item.row, item.column);
        this.score += 10;
      }.bind(this)
    );
  }

  // set the item at (row, column) as empty
  setEmpty(row, column) {
    this.gameArray[row][column].isEmpty = true;
  }

  // returns true if the item at (row, column) is empty
  isEmpty(row, column) {
    return this.gameArray[row][column].isEmpty;
  }

  // returns the amount of empty spaces below the item at (row, column)
  emptySpacesBelow(row, column) {
    let result = 0;
    if (row != this.getRows()) {
      for (let i = row + 1; i < this.getRows(); i++) {
        if (this.isEmpty(i, column)) {
          result++;
        }
      }
    }
    return result;
  }

  // arranges the board after a match, making items fall down. Returns an object with movement information
  arrangeBoardAfterMatch() {
    let result = [];
    for (let i = this.getRows() - 2; i >= 0; i--) {
      for (let j = 0; j < this.getColumns(); j++) {
        let emptySpaces = this.emptySpacesBelow(i, j);
        if (!this.isEmpty(i, j) && emptySpaces > 0) {
          this.swapItems(i, j, i + emptySpaces, j);
          result.push({
            row: i + emptySpaces,
            column: j,
            deltaRow: emptySpaces,
            deltaColumn: 0,
          });
        }
      }
    }
    return result;
  }

  // replenished the board and returns an object with movement information
  replenishBoard() {
    let result = [];
    for (let i = 0; i < this.getColumns(); i++) {
      if (this.isEmpty(0, i)) {
        let emptySpaces = this.emptySpacesBelow(0, i) + 1;
        for (let j = 0; j < emptySpaces; j++) {
          let randomValue = Math.floor(Math.random() * this.items);
          result.push({
            row: j,
            column: i,
            deltaRow: emptySpaces,
            deltaColumn: 0,
          });
          this.gameArray[j][i].value = randomValue;
          this.gameArray[j][i].isEmpty = false;
        }
      }
    }
    return result;
  }
}

export default Match3;
