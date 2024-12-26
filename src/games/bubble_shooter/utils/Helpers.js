export function getRandomInteger(selection) {
  let len = selection.size;
  let idx = Math.floor(Math.random() * len);
  let arr = [...selection];
  return arr[idx];
}

export function setCanvasHeight(min, max, viewportHeight, rows) {
  if (viewportHeight <= min) {
    return min;
  } else if (viewportHeight >= max) {
    return max;
  } else {
    return Math.floor((viewportHeight - 20) / rows) * rows;
  }
}

// adjust size of game object relative to canvas height
export function setSize(minHeight, canvasHeight) {
  return function (defaultValue) {
    return Math.floor((defaultValue / minHeight) * canvasHeight);
  };
}
