import * as fs from "fs";
import { matrixToPngCanvas, renderGifWithImages } from "../helper/gifRender";
import GIFEncoder from "gifencoder";

// const filePath = "input-sample.txt"; // 7036, 45
// const filePath = "input-sample-2.txt"; // 11048, 64
const filePath = "input.txt"; // 91464, 494

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

enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}

let memCost = new Map<string, number>();

const toStringIndex = (i: number, j: number) => i + "|" + j;

function travel(
  curI: number,
  curJ: number,
  curDir: Direction,
  curStep: number,
  curRotation: number,
) {
  let strIndex = toStringIndex(curI, curJ);
  if (!memCost.has(strIndex)) {
    memCost.set(strIndex, -1);
  }

  if (
    memCost.get(strIndex) != -1 &&
    memCost.get(strIndex)! < 1000 * curRotation + curStep
  ) {
    return;
  }

  memCost.set(strIndex, 1000 * curRotation + curStep);

  if (matrix[curI][curJ] === "E") return;

  if (matrix[curI - 1][curJ] !== "#") {
    // Direction.Up
    travel(
      curI - 1,
      curJ,
      Direction.Up,
      curStep + 1,
      curDir != Direction.Up ? curRotation + 1 : curRotation,
    );
  }
  if (matrix[curI + 1][curJ] !== "#") {
    // Direction.Down
    travel(
      curI + 1,
      curJ,
      Direction.Down,
      curStep + 1,
      curDir != Direction.Down ? curRotation + 1 : curRotation,
    );
  }
  if (matrix[curI][curJ - 1] !== "#") {
    // Direction.Left
    travel(
      curI,
      curJ - 1,
      Direction.Left,
      curStep + 1,
      curDir != Direction.Left ? curRotation + 1 : curRotation,
    );
  }
  if (matrix[curI][curJ + 1] !== "#") {
    // Direction.Right
    travel(
      curI,
      curJ + 1,
      Direction.Right,
      curStep + 1,
      curDir != Direction.Right ? curRotation + 1 : curRotation,
    );
  }
}

// console.log(matrix);
// console.log(startPoint);
// console.log(endPoint);

travel(startPoint[0], startPoint[1], Direction.Right, 0, 0);

// console.log(memCost);
const resultPart1 = memCost.get(toStringIndex(endPoint[0], endPoint[1]));
console.log(resultPart1);

// Part 2

memCost = new Map<string, number>();

let memBestRoute: Set<string> = new Set();

function travelBestRoute(
  curI: number,
  curJ: number,
  curDir: Direction,
  curStep: number,
  curRotation: number,
): boolean {
  let strIndex = toStringIndex(curI, curJ);
  if (!memCost.has(strIndex)) {
    memCost.set(strIndex, -1);
  }

  if (
    memCost.get(strIndex) != -1 &&
    memCost.get(strIndex)! < 1000 * curRotation + curStep
  ) {
    return false;
  }

  memCost.set(strIndex, 1000 * curRotation + curStep);

  if (matrix[curI][curJ] === "E") {
    memBestRoute.add(strIndex);
    return resultPart1 == 1000 * curRotation + curStep;
  }

  let isOnBestPath = [false, false, false, false];

  if (matrix[curI - 1][curJ] !== "#") {
    // Direction.Up
    isOnBestPath[0] = travelBestRoute(
      curI - 1,
      curJ,
      Direction.Up,
      curStep + 1,
      curDir != Direction.Up ? curRotation + 1 : curRotation,
    );
    if (isOnBestPath[0] && curDir != Direction.Up) {
      memCost.set(strIndex, 1000 * (curRotation + 1) + curStep);
    }
  }
  if (matrix[curI + 1][curJ] !== "#") {
    // Direction.Down
    isOnBestPath[1] = travelBestRoute(
      curI + 1,
      curJ,
      Direction.Down,
      curStep + 1,
      curDir != Direction.Down ? curRotation + 1 : curRotation,
    );
    if (isOnBestPath[1] && curDir != Direction.Up) {
      memCost.set(strIndex, 1000 * (curRotation + 1) + curStep);
    }
  }
  if (matrix[curI][curJ - 1] !== "#") {
    // Direction.Left
    isOnBestPath[2] = travelBestRoute(
      curI,
      curJ - 1,
      Direction.Left,
      curStep + 1,
      curDir != Direction.Left ? curRotation + 1 : curRotation,
    );
    if (isOnBestPath[2] && curDir != Direction.Up) {
      memCost.set(strIndex, 1000 * (curRotation + 1) + curStep);
    }
  }
  if (matrix[curI][curJ + 1] !== "#") {
    // Direction.Right
    isOnBestPath[3] = travelBestRoute(
      curI,
      curJ + 1,
      Direction.Right,
      curStep + 1,
      curDir != Direction.Right ? curRotation + 1 : curRotation,
    );
    if (isOnBestPath[3] && curDir != Direction.Up) {
      memCost.set(strIndex, 1000 * (curRotation + 1) + curStep);
    }
  }

  if (
    isOnBestPath[0] ||
    isOnBestPath[1] ||
    isOnBestPath[2] ||
    isOnBestPath[3]
  ) {
    memBestRoute.add(strIndex);
    matrix[curI][curJ] = "O";
    return true;
  }

  return false;
}

memCost = new Map<string, number>();
travelBestRoute(startPoint[0], startPoint[1], Direction.Right, 0, 0);

// console.log(matrix.flatMap((m) => m.join("")).join("\n"));
console.log(memBestRoute.size);
// console.log(newMemCost);
