import * as fs from "fs";

// const filePath = "input-sample-simple.txt"; //772, 80
// const filePath = "input-sample.txt"; //1930
const filePath = "input.txt"; //

const fileContent = fs.readFileSync(filePath, "utf8");

const matrixInput = fileContent.split("\n").map((line) => line.split(""));
let memoryMap: Map<string, Set<number>> = new Map();
const toIndex = (x: number, y: number) => x * 1000 + y;

function travelAllSimilarChar(
  char: string,
  i: number,
  j: number,
): [area: number, perimeter: number] {
  if (memoryMap.get(char) == undefined) memoryMap.set(char, new Set());
  if (memoryMap.get(char)?.has(toIndex(i, j))) return [0, 0];

  memoryMap.get(char)?.add(toIndex(i, j));

  let area = 1;
  let perimeter = 0;

  if (i - 1 >= 0 && matrixInput[i - 1][j] === char) {
    let [newArea, newPerimeter] = travelAllSimilarChar(char, i - 1, j);
    area += newArea;
    perimeter += newPerimeter;
  } else {
    perimeter++;
  }

  if (i + 1 < matrixInput.length && matrixInput[i + 1][j] === char) {
    let [newArea, newPerimeter] = travelAllSimilarChar(char, i + 1, j);
    area += newArea;
    perimeter += newPerimeter;
  } else {
    perimeter++;
  }

  if (j - 1 >= 0 && matrixInput[i][j - 1] === char) {
    let [newArea, newPerimeter] = travelAllSimilarChar(char, i, j - 1);
    area += newArea;
    perimeter += newPerimeter;
  } else {
    perimeter++;
  }

  if (j + 1 < matrixInput[i].length && matrixInput[i][j + 1] === char) {
    let [newArea, newPerimeter] = travelAllSimilarChar(char, i, j + 1);
    area += newArea;
    perimeter += newPerimeter;
  } else {
    perimeter++;
  }
  return [area, perimeter];
}

let result = 0;
for (let i = 0; i < matrixInput.length; i++) {
  for (let j = 0; j < matrixInput[i].length; j++) {
    let char = matrixInput[i][j];
    if (memoryMap.get(char) == undefined) memoryMap.set(char, new Set());
    if (memoryMap.get(char)?.has(toIndex(i, j))) continue;

    let [area, perimeter] = travelAllSimilarChar(char, i, j);

    // console.log(char + " || area: " + area + " || perimeter: " + perimeter);
    memoryMap.get(char)?.add(toIndex(i, j));

    result += area * perimeter;
  }
}
console.log(result);

// ======= PART 2 ======

enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}

function getInnerCorner(
  char: string,
  i: number,
  j: number,
  connections: Set<Direction>,
): number {
  let innerCorner = 0;
  if (connections.has(Direction.Up) && connections.has(Direction.Left)) {
    if (matrixInput?.[i - 1][j - 1] !== char) {
      innerCorner++;
    }
  }

  if (connections.has(Direction.Up) && connections.has(Direction.Right)) {
    if (matrixInput?.[i - 1]?.[j + 1] !== char) {
      innerCorner++;
    }
  }
  if (connections.has(Direction.Right) && connections.has(Direction.Down)) {
    if (matrixInput?.[i + 1]?.[j + 1] !== char) {
      innerCorner++;
    }
  }
  if (connections.has(Direction.Down) && connections.has(Direction.Left)) {
    if (matrixInput?.[i + 1]?.[j - 1] !== char) {
      innerCorner++;
    }
  }
  return innerCorner;
}

function getOuterCorner(connections: Set<Direction>): number {
  let outerCorner = 0;
  switch (connections.size) {
    case 0:
      outerCorner = 4;
      break;
    case 1:
      outerCorner = 2;
      break;
    case 2:
      if (connections.has(Direction.Left) && connections.has(Direction.Right))
        outerCorner = 0;
      else if (connections.has(Direction.Up) && connections.has(Direction.Down))
        outerCorner = 0;
      else outerCorner = 1;
      break;
    default:
      outerCorner = 0;
  }
  return outerCorner;
}

function travelAllSameChar(
  char: string,
  i: number,
  j: number,
): [area: number, size: number] {
  if (memoryMap.get(char) == undefined) memoryMap.set(char, new Set());
  if (memoryMap.get(char)?.has(toIndex(i, j))) return [0, 0];

  memoryMap.get(char)?.add(toIndex(i, j));

  let area = 1;
  let totalCorner = 0;
  let numOfConnect = 0;
  let outerCorner = 0;
  let innerCorner = 0;

  let connections = new Set<Direction>();

  if (i - 1 >= 0 && matrixInput[i - 1][j] === char) {
    let [newArea, newCorner] = travelAllSameChar(char, i - 1, j);
    area += newArea;
    totalCorner += newCorner;
    numOfConnect++;
    connections.add(Direction.Up);
  }

  if (i + 1 < matrixInput.length && matrixInput[i + 1][j] === char) {
    let [newArea, newCorner] = travelAllSameChar(char, i + 1, j);
    area += newArea;
    totalCorner += newCorner;

    numOfConnect++;
    connections.add(Direction.Down);
  }

  if (j - 1 >= 0 && matrixInput[i][j - 1] === char) {
    let [newArea, newCorner] = travelAllSameChar(char, i, j - 1);
    area += newArea;
    totalCorner += newCorner;

    numOfConnect++;
    connections.add(Direction.Left);
  }

  if (j + 1 < matrixInput[i].length && matrixInput[i][j + 1] === char) {
    let [newArea, newCorner] = travelAllSameChar(char, i, j + 1);
    area += newArea;
    totalCorner += newCorner;
    numOfConnect++;
    connections.add(Direction.Right);
  }

  innerCorner = getInnerCorner(char, i, j, connections);
  outerCorner = getOuterCorner(connections);

  totalCorner = totalCorner + innerCorner + outerCorner;

  return [area, totalCorner];
}

let result2 = 0;
memoryMap = new Map();

for (let i = 0; i < matrixInput.length; i++) {
  for (let j = 0; j < matrixInput[i].length; j++) {
    let char = matrixInput[i][j];
    if (memoryMap.get(char) == undefined) memoryMap.set(char, new Set());
    if (memoryMap.get(char)?.has(toIndex(i, j))) continue;

    let [area, perimeter] = travelAllSameChar(char, i, j);

    // console.log(char + " || area: " + area + " || perimeter: " + perimeter);
    memoryMap.get(char)?.add(toIndex(i, j));

    result2 += area * perimeter;
  }
}

console.log(result2);
