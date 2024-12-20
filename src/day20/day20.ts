import * as fs from "fs";

// const filePath = "input-sample.txt"; //
const filePath = "input.txt"; // 1317 | 982474

const fileContent = fs.readFileSync(filePath, "utf8");
let startPoint = [0, 0];
let endPoint = [0, 0];

const matrix = fileContent.split("\n").map((line, lineIndex) => {
  if (line.indexOf("S") !== -1) {
    startPoint = [lineIndex, line.indexOf("S")];
  }
  if (line.indexOf("E") !== -1) {
    endPoint = [lineIndex, line.indexOf("E")];
  }
  return line.trim().split("");
});

// console.log(matrix);
console.log(startPoint);
console.log(endPoint);

const toStringIndex = (i: number, j: number) => i + "|" + j;

let routeSet: Set<string> = new Set();

let costMatrix: number[][] = Array.from({ length: matrix.length }, () =>
  Array(matrix[0].length).fill(-1),
);
// console.log(costMatrix);

function travel(curI: number, curJ: number, curCost: number) {
  while (matrix[curI][curJ] !== "E") {
    costMatrix[curI][curJ] = curCost;
    routeSet.add(toStringIndex(curI, curJ));
    if (matrix[curI - 1][curJ] !== "#" && costMatrix[curI - 1][curJ] == -1) {
      // Direction.Up
      curI--;
    } else if (
      matrix[curI + 1][curJ] !== "#" &&
      costMatrix[curI + 1][curJ] == -1
    ) {
      // Direction.Down
      curI++;
    } else if (
      matrix[curI][curJ - 1] !== "#" &&
      costMatrix[curI][curJ - 1] == -1
    ) {
      // Direction.Left
      curJ--;
    } else if (
      matrix[curI][curJ + 1] !== "#" &&
      costMatrix[curI][curJ + 1] == -1
    ) {
      // Direction.Right
      curJ++;
    }
    curCost++;
  }
  costMatrix[curI][curJ] = curCost;
  routeSet.add(toStringIndex(curI, curJ));
}

travel(startPoint[0], startPoint[1], 0);

// console.log(memCost);

const THRESHOLD = 100;
let cheatMap = new Map<string, number>();

routeSet.forEach((point) => {
  let curI = parseInt(point.split("|")[0]);
  let curJ = parseInt(point.split("|")[1]);

  if (curI - 2 >= 0 && costMatrix[curI - 2][curJ] > costMatrix[curI][curJ]) {
    // Direction.Up
    let reduce = costMatrix[curI - 2][curJ] - costMatrix[curI][curJ] - 2;
    reduce >= THRESHOLD &&
      cheatMap.set(point + toStringIndex(curI - 2, curJ), reduce);
  }
  if (
    curI + 2 < costMatrix.length &&
    costMatrix[curI + 2][curJ] > costMatrix[curI][curJ]
  ) {
    // Direction.Down
    let reduce = costMatrix[curI + 2][curJ] - costMatrix[curI][curJ] - 2;
    reduce >= THRESHOLD &&
      cheatMap.set(point + toStringIndex(curI + 2, curJ), reduce);
  }
  if (curJ - 2 >= 0 && costMatrix[curI][curJ - 2] > costMatrix[curI][curJ]) {
    // Direction.Left
    let reduce = costMatrix[curI][curJ - 2] - costMatrix[curI][curJ] - 2;
    reduce >= THRESHOLD &&
      cheatMap.set(point + toStringIndex(curI, curJ - 2), reduce);
  }
  if (
    curJ + 2 < costMatrix[curI].length &&
    costMatrix[curI][curJ + 2] > costMatrix[curI][curJ]
  ) {
    // Direction.Right
    let reduce = costMatrix[curI][curJ + 2] - costMatrix[curI][curJ] - 2;
    reduce >= THRESHOLD &&
      cheatMap.set(point + toStringIndex(curI, curJ + 2), reduce);
  }
});
// console.log(routeSet.size);
// console.log(cheatMap);
console.log(cheatMap.size);

// PART 2
const MAX_CHEAT = 20;

cheatMap = new Map<string, number>();

function checkAllPossibleCheat(curI: number, curJ: number) {
  let top = curI - MAX_CHEAT >= 0 ? curI - MAX_CHEAT : 0;
  let bottom =
    curI + MAX_CHEAT <= matrix.length - 1
      ? curI + MAX_CHEAT
      : matrix.length - 1;

  let left = curJ - MAX_CHEAT + 1 >= 0 ? curJ - MAX_CHEAT : 0;
  let right =
    curJ + MAX_CHEAT <= matrix[0].length - 1
      ? curJ + MAX_CHEAT
      : matrix.length - 1;

  for (let i = top; i <= bottom; i++) {
    let cheatVertical = Math.abs(i - curI);
    for (let j = left; j <= right; j++) {
      let cheatHorizontal = Math.abs(j - curJ);
      if (
        costMatrix[i][j] > costMatrix[curI][curJ] &&
        cheatVertical + cheatHorizontal <= MAX_CHEAT
      ) {
        let reduce =
          costMatrix[i][j] -
          costMatrix[curI][curJ] -
          (cheatVertical + cheatHorizontal);

        reduce >= THRESHOLD &&
          cheatMap.set(
            toStringIndex(curI, curJ) + "||" + toStringIndex(i, j),
            reduce,
          );
      }
    }
  }
}

routeSet.forEach((point) => {
  let curI = parseInt(point.split("|")[0]);
  let curJ = parseInt(point.split("|")[1]);
  checkAllPossibleCheat(curI, curJ);
});
// console.log(routeSet.size);
// console.log(cheatMap);
console.log(cheatMap.size);
