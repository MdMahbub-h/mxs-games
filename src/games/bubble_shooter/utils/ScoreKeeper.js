const bubblePoints = 10;

class ScoreKeeper {
  constructor() {
    this.score = 0;
    this.time = 180;
    this.currentScore = 0;
    this.colorMap = new Map();
    this.mergeMap = [];
  }
  add(colorCode, i, j) {
    let current = this.colorMap.get(colorCode);
    if (current) {
      current.push({ i, j });
      this.colorMap.set(colorCode, current);
    } else {
      this.colorMap.set(colorCode, [{ i, j }]);
    }
  }

  calculate(currentColorCode) {
    this.colorMap.forEach((arr, key) => {
      let pointsArr;
      if (key === currentColorCode) {
        this.currentScore += arr.length * bubblePoints;
        arr.forEach((el) => {
          el.score = bubblePoints;
          this.mergeMap.push(el);
        });
      } else {
        this.currentScore += bubblePoints * Math.pow(2, arr.length) * arr.length;
        arr.forEach((el) => {
          el.score = bubblePoints * Math.pow(2, arr.length);
          this.mergeMap.push(el);
        });
      }
    });
  }

  refreshMaps() {
    this.colorMap.clear();
    this.mergeMap = [];
    this.currentScore = 0;
  }
}

export default ScoreKeeper;
