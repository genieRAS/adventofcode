import * as fs from "fs";

const filePath = "input-sample.txt"; // 41, 6
// const filePath = "input.txt"; // 4890, 1995

// PART 1
const fileContent = fs.readFileSync(filePath, "utf8");
const lines = fileContent.split("\n");

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

function getNextDirection(currentDirection: Direction): Direction {
  switch (currentDirection) {
    case Direction.UP:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.LEFT;
    case Direction.LEFT:
      return Direction.UP;
  }
}

function getNumberOfPosition(lines: string[]): [number, string[]] {
  let matrix: string[][] = [];

  lines.forEach((line, index) => {
    if (line.trim() === "") {
      return;
    }
    matrix[index] = [];
    matrix[index] = line.split("");
    return;
  });

  let currentDirection: Direction = Direction.UP;
  let currentX = 0;
  let currentY = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === "^") {
        currentX = j;
        currentY = i;
        matrix[i][j] = "X";
      }
    }
  }

  while (
    currentX < matrix.length &&
    currentY < matrix[0].length &&
    currentX >= 0 &&
    currentY >= 0
  ) {
    if (currentDirection === Direction.UP) {
      if (matrix[currentY - 1]?.[currentX] !== "#") {
        matrix[currentY][currentX] = "X";
        currentY = currentY - 1;
      } else {
        currentDirection = getNextDirection(currentDirection);
      }
    }

    if (currentDirection === Direction.RIGHT) {
      if (matrix[currentY][currentX + 1] !== "#") {
        matrix[currentY][currentX] = "X";
        currentX = currentX + 1;
      } else {
        currentDirection = getNextDirection(currentDirection);
      }
    }

    if (currentDirection === Direction.DOWN) {
      if (matrix[currentY + 1]?.[currentX] !== "#") {
        matrix[currentY][currentX] = "X";
        currentY = currentY + 1;
      } else {
        currentDirection = getNextDirection(currentDirection);
      }
    }

    if (currentDirection === Direction.LEFT) {
      if (matrix[currentY][currentX - 1] !== "#") {
        matrix[currentY][currentX] = "X";
        currentX = currentX - 1;
      } else {
        currentDirection = getNextDirection(currentDirection);
      }
    }
  }
  // console.log("========");
  // for (let i = 0; i < matrix.length; i++) {
  //   console.log(matrix[i].join(""));
  // }

  let numberOfPosition = 0;
  let XPositions: string[] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === "X") {
        numberOfPosition++;
        XPositions.push(i + "," + j);
      }
    }
  }

  return [numberOfPosition, XPositions];
}

// Part 1
let [numberOfPosition, XPositions] = getNumberOfPosition(lines);
console.log(numberOfPosition);

function checkLoopPosibility(
  lines: string[],
  obsX: number,
  obsY: number,
): boolean {
  let matrix: string[][] = [];

  lines.forEach((line, index) => {
    if (line.trim() === "") {
      return;
    }
    matrix[index] = [];
    matrix[index] = line.split("");
    return;
  });

  let currentDirection: Direction = Direction.UP;
  let currentX = 0;
  let currentY = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === "^") {
        currentX = j;
        currentY = i;
        matrix[i][j] = "X";
      }
    }
  }

  if (currentX == obsX && currentY == obsY) {
    return false;
  }

  matrix[obsY][obsX] = "#";

  let count = 0;
  while (
    currentX < matrix.length &&
    currentY < matrix[0].length &&
    currentX >= 0 &&
    currentY >= 0
  ) {
    count++;
    if (count > matrix.length * matrix[0].length) {
      // console.log(obsX, obsY);
      return true;
    }

    if (currentDirection === Direction.UP) {
      if (matrix[currentY - 1]?.[currentX] !== "#") {
        matrix[currentY][currentX] = "X";
        currentY = currentY - 1;
      } else {
        currentDirection = getNextDirection(currentDirection);
      }
    }

    if (currentDirection === Direction.RIGHT) {
      if (matrix[currentY][currentX + 1] !== "#") {
        matrix[currentY][currentX] = "X";
        currentX = currentX + 1;
      } else {
        currentDirection = getNextDirection(currentDirection);
      }
    }

    if (currentDirection === Direction.DOWN) {
      if (matrix[currentY + 1]?.[currentX] !== "#") {
        matrix[currentY][currentX] = "X";
        currentY = currentY + 1;
      } else {
        currentDirection = getNextDirection(currentDirection);
      }
    }

    if (currentDirection === Direction.LEFT) {
      if (matrix[currentY][currentX - 1] !== "#") {
        matrix[currentY][currentX] = "X";
        currentX = currentX - 1;
      } else {
        currentDirection = getNextDirection(currentDirection);
      }
    }
  }

  return false;
}

// console.log(getNumberOfObstructionOption(lines));

let numOfObstruction = 0;

XPositions.forEach((XPosition) => {
  let obstructionX = parseInt(XPosition.split(",")[1]);
  let obstructionY = parseInt(XPosition.split(",")[0]);

  if (checkLoopPosibility(lines, obstructionX, obstructionY))
    numOfObstruction++;
});

console.log(numOfObstruction);
