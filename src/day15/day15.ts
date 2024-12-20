import * as fs from "fs";
import { matrixToPngCanvas, renderGifWithImages } from "../helper/gifRender";
import { Canvas } from "canvas";

// const filePath = "input-sample-simpler.txt"; // 2028
const filePath = "input-sample.txt"; // 10092, 9021
// const filePath = "input.txt"; // 1430536, 1428081

const fileContent = fs.readFileSync(filePath, "utf8");

const input = fileContent.split("\n\n");

let robotPosition = [0, 0];

let matrix = input[0].split("\n").map((line, index) => {
  let yIndex = line.indexOf("@");
  if (yIndex !== -1) {
    robotPosition = [index, yIndex];
  }
  return line.split("");
});
const moves = input[1].split("\n").join("").split("");

// console.log(robotPosition);
// console.log(matrix);
// console.log(moves);

function getNextBox(i: number, j: number, direction: string): [number, number] {
  switch (direction) {
    case "<":
      return [i, j - 1];
    case ">":
      return [i, j + 1];
    case "^":
      return [i - 1, j];
    case "v":
      return [i + 1, j];
  }
  throw new Error("Wrong direction");
}

function testMove(i: number, j: number, direction: string) {
  if (matrix[i][j] === "#") {
    return false;
  } else if (matrix[i][j] === ".") {
    return true;
  } else if (matrix[i][j] === "O") {
    let [newI, newJ] = getNextBox(i, j, direction);
    if (testMove(newI, newJ, direction)) {
      matrix[newI][newJ] = "O";
      return true;
    } else {
      return false;
    }
  }
}

for (let i = 0; i < moves.length; i++) {
  let [nextI, nextJ] = getNextBox(robotPosition[0], robotPosition[1], moves[i]);

  if (testMove(nextI, nextJ, moves[i])) {
    matrix[robotPosition[0]][robotPosition[1]] = ".";
    matrix[nextI][nextJ] = "@";
    robotPosition = [nextI, nextJ];
  }
}

console.log(matrix.flatMap((m) => m.join("")).join("\n"));

let sumGps = 0;
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[0].length; j++) {
    if (matrix[i][j] === "O") {
      sumGps += i * 100 + j;
    }
  }
}
console.log(sumGps);

// PART 2 ====
robotPosition = [0, 0];
let countBox = 0;

matrix = input[0].split("\n").map((line, index) => {
  let yIndex = line.indexOf("@");
  if (yIndex !== -1) {
    robotPosition = [index, yIndex * 2];
  }
  return line
    .split("")
    .map((c) => {
      if (c === "#") return "##";
      if (c === "O") return "[]";
      if (c === ".") return "..";
      if (c === "@") return "@.";
    })
    .join("")
    .split("");
});

console.log(matrix.flatMap((m) => m.join("")).join("\n"));

for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[0].length; j++) {
    if (matrix[i][j] === "[") {
      countBox += 1;
    }
  }
}

console.log(countBox);

function testMoveDoubleSize(
  i: number,
  j: number,
  direction: string,
  allowMove: boolean,
): boolean {
  if (matrix[i][j] === "#") {
    return false;
  } else if (matrix[i][j] === ".") {
    return true;
  }

  // move horizontal
  if (direction === "<" || direction === ">") {
    if (matrix[i][j] === "[" || matrix[i][j] === "]") {
      let [newI, newJ] = getNextBox(i, j, direction);
      if (testMoveDoubleSize(newI, newJ, direction, allowMove)) {
        if (allowMove) {
          matrix[newI][newJ] = matrix[i][j];
          matrix[i][j] = ".";
        }
        return true;
      } else {
        return false;
      }
    }
  } else {
    // move vertical

    let [halfI1, halfJ1] = [0, 0];
    let [halfI2, halfJ2] = [0, 0];

    let possibleToMove = false;
    if (matrix[i][j] === "[") {
      [halfI1, halfJ1] = [i, j];
      [halfI2, halfJ2] = [i, j + 1];
    } else if (matrix[i][j] === "]") {
      [halfI1, halfJ1] = [i, j - 1];
      [halfI2, halfJ2] = [i, j];
    }
    let [newI1, newJ1] = getNextBox(halfI1, halfJ1, direction);
    let [newI2, newJ2] = getNextBox(halfI2, halfJ2, direction);

    possibleToMove =
      testMoveDoubleSize(newI1, newJ1, direction, allowMove) &&
      testMoveDoubleSize(newI2, newJ2, direction, allowMove);

    if (possibleToMove) {
      if (allowMove) {
        matrix[newI1][newJ1] = "[";
        matrix[newI2][newJ2] = "]";
        matrix[halfI1][halfJ1] = ".";
        matrix[halfI2][halfJ2] = ".";
      }
      return true;
    } else {
      return false;
    }
  }

  return false;
}

async function main() {
  for (let i = 0; i < moves.length; i++) {
    let [nextI, nextJ] = getNextBox(
      robotPosition[0],
      robotPosition[1],
      moves[i],
    );

    if (testMoveDoubleSize(nextI, nextJ, moves[i], false)) {
      testMoveDoubleSize(nextI, nextJ, moves[i], true);
      if (moves[i] === "<" || moves[i] === ">") {
        matrix[robotPosition[0]][robotPosition[1]] = ".";
        matrix[nextI][nextJ] = "@";
        robotPosition = [nextI, nextJ];
      } else {
        if (matrix[nextI][nextJ] === "[") {
          matrix[nextI][nextJ + 1] = ".";
        } else if (matrix[nextI][nextJ] === "]") {
          matrix[nextI][nextJ - 1] = ".";
        }
        matrix[robotPosition[0]][robotPosition[1]] = ".";
        matrix[nextI][nextJ] = "@";
        robotPosition = [nextI, nextJ];
      }
    }

    // Print file to debug
    // let data =
    //   "\n\n====== " +
    //   i +
    //   ": " +
    //   moves[i] +
    //   " ====== \n" +
    //   matrix.flatMap((m) => m.join("")).join("\n");
    // fs.appendFileSync("output.txt", data);

    pngArray.push(matrixToPngCanvas(matrix));
  }
}

let pngArray: Canvas[] = [];

main().then((r) => {
  // console.log(matrix.flatMap((m) => m.join("")).join("\n"));
  renderGifWithImages(matrix, pngArray, __dirname);
});

sumGps = 0;
countBox = 0;
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[0].length; j++) {
    if (matrix[i][j] === "[") {
      sumGps += i * 100 + j;
      countBox++;
    }
  }
}
// console.log(sumGps);
// console.log(countBox);
