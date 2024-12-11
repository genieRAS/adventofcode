import * as fs from "fs";

const filePath = "input-sample.txt"; // 36, 81
// const filePath = "input.txt"; //

const fileContent = fs.readFileSync(filePath, "utf8");

const lines = fileContent.split("\n");

let matrix: number[][] = [];

let trailLineSet: Set<string> = new Set(); // for unique head and tail
let trailLineCount: number = 0;

lines.forEach((line, x) => {
  matrix[x] = [];
  line.split("").forEach((c, y) => {
    matrix[x][y] = parseInt(c);
  });
});

function findTrailingScores(curX: number, curY: number, trailHead: string) {
  let curVal = matrix[curX][curY];
  if (matrix[curX][curY] === 9) {
    trailLineCount++;
    trailLineSet.add(trailHead + "|" + curX + "," + curY);
  } else {
    curX + 1 < matrix.length &&
      matrix[curX + 1][curY] == curVal + 1 &&
      findTrailingScores(curX + 1, curY, trailHead);

    curY + 1 < matrix[0].length &&
      matrix[curX][curY + 1] == curVal + 1 &&
      findTrailingScores(curX, curY + 1, trailHead);

    curX - 1 >= 0 &&
      matrix[curX - 1][curY] == curVal + 1 &&
      findTrailingScores(curX - 1, curY, trailHead);

    curY - 1 >= 0 &&
      matrix[curX][curY - 1] == curVal + 1 &&
      findTrailingScores(curX, curY - 1, trailHead);
  }
}

for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[0].length; j++) {
    if (matrix[i][j] === 0) {
      findTrailingScores(i, j, i + "," + j);
    }
  }
}

console.log(trailLineSet.size);

console.log(trailLineCount);
