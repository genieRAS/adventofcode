import * as fs from "fs";

// const filePath = "input-sample.txt"; // 22
const filePath = "input.txt"; // 338, 20|44

const fileContent = fs.readFileSync(filePath, "utf8");

const input = fileContent.split("\n");

const MEM_SIZE = 71;
const NUM_OF_BYTE = 2970;

let matrix: string[][] = Array.from({ length: MEM_SIZE }, () =>
  Array(MEM_SIZE).fill("."),
);

input.forEach((line, index) => {
  if (index >= NUM_OF_BYTE) return;
  let X = parseInt(line.split(",")[0]);
  let Y = parseInt(line.split(",")[1]);
  matrix[Y][X] = "#";
});

// console.log(matrix.join("\n"));

let memCost = new Map<string, number>();
const toStringIndex = (i: number, j: number) => i + "|" + j;

function findExitGate(
  curI: number,
  curJ: number,
  curCost: number,
  lowestCost = -1, // in case of lowestCost provide, will mark O for each node on the path
): boolean {
  let strIndex = toStringIndex(curI, curJ);

  if (curI < 0 || curI >= MEM_SIZE || curJ < 0 || curJ >= MEM_SIZE) {
    return false;
  }
  if (matrix[curI][curJ] === "#") {
    return false;
  }

  if (memCost.has(strIndex) && curCost >= memCost.get(strIndex)!) {
    return false;
  }

  memCost.set(strIndex, curCost);

  if (
    lowestCost !== -1 &&
    curI == MEM_SIZE - 1 &&
    curJ == MEM_SIZE - 1 &&
    curCost == lowestCost
  ) {
    return true;
  }

  let correctPath =
    findExitGate(curI - 1, curJ, curCost + 1, lowestCost) ||
    findExitGate(curI + 1, curJ, curCost + 1, lowestCost) ||
    findExitGate(curI, curJ - 1, curCost + 1, lowestCost) ||
    findExitGate(curI, curJ + 1, curCost + 1, lowestCost);

  if (correctPath) {
    matrix[curI][curJ] = "O";
    return true;
  }

  return false;
}

// First travel to mark all smallest cost for each node
findExitGate(0, 0, 0);
let part1Result = memCost.get(toStringIndex(MEM_SIZE - 1, MEM_SIZE - 1));
console.log("======PART 1=========");
console.log(part1Result);

memCost = new Map<string, number>();
// This time travel to mark O for all node on the shortest path
findExitGate(0, 0, 0, part1Result);
// console.log(matrix.join("\n"));

let isBlocked = false;
let result = "";

for (let byteIndex = NUM_OF_BYTE; byteIndex < input.length; byteIndex++) {
  // console.log(byteIndex);
  let X = parseInt(input[byteIndex].split(",")[0]);
  let Y = parseInt(input[byteIndex].split(",")[1]);

  if (matrix[Y][X] == "O") {
    // clear path on matrix
    matrix.map((row) =>
      row.map((value) => (value === "O" ? "." : value.toString())),
    );
    matrix[Y][X] = "#";

    memCost = new Map<string, number>();
    findExitGate(0, 0, 0);
    let lowestCost = memCost.get(toStringIndex(MEM_SIZE - 1, MEM_SIZE - 1));

    if (!memCost.has(toStringIndex(MEM_SIZE - 1, MEM_SIZE - 1))) {
      isBlocked = true;
    }

    memCost = new Map<string, number>();
    findExitGate(0, 0, 0, lowestCost);
  }
  matrix[Y][X] = "#";
  if (isBlocked) {
    result = input[byteIndex];
    break;
  }
}
console.log("======PART 2=========");
// console.log(matrix.join("\n"));
console.log(result);
