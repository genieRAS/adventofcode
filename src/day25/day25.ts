import * as fs from "fs";

// const filePath = "input-sample.txt"; // 3
const filePath = "input.txt"; // 3116

const fileContent = fs.readFileSync(filePath, "utf8");

const allLocks = fileContent.split("\n\n").filter((c) => c.startsWith("#####"));
const allKeys = fileContent.split("\n\n").filter((c) => c.startsWith("....."));

console.log(allLocks.join("\n***=====****\n"));

const allArrLocks: number[][] = Array.from({ length: allLocks.length }, () =>
  Array(5).fill(0),
);

const allArrKeys: number[][] = Array.from({ length: allKeys.length }, () =>
  Array(5).fill(0),
);

let numOfRow = 7;

allLocks.forEach((lock, lockIndex) => {
  let lockRows = lock.split("\n");
  numOfRow = lockRows.length;
  for (let i = 0; i < lockRows.length; i++) {
    for (let j = 0; j < lockRows[i].length; j++) {
      if (lockRows[i][j] == "#") allArrLocks[lockIndex][j]++;
    }
  }
});
console.log(allArrLocks);

allKeys.forEach((key, keyIndex) => {
  let keyRows = key.split("\n");
  for (let i = 0; i < keyRows.length; i++) {
    for (let j = 0; j < keyRows[i].length; j++) {
      if (keyRows[i][j] == "#") allArrKeys[keyIndex][j]++;
    }
  }
});
console.log(allArrKeys);

function testKeyLock(key: number[], lock: number[]): boolean {
  let sumArr = key.map((num, index) => num + lock[index]);
  if (sumArr.every((num, index) => num <= numOfRow)) return true;

  return false;
}

let totalPairs = 0;
allArrKeys.forEach((key) => {
  allArrLocks.forEach((lock) => {
    if (testKeyLock(key, lock)) totalPairs++;
  });
});

console.log(totalPairs);
