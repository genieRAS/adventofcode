import * as fs from "fs";

// const filePath = "input-sample.txt"; // 6
const filePath = "input.txt"; // 283, 615388132411142
// const filePath = "input-test.txt"; //

const fileContent = fs.readFileSync(filePath, "utf8");

const initTowels = fileContent
  .split("\n\n")[0]
  .split(", ")
  .sort((a, b) => a.length - b.length);

let availableTowels: string[] = [];
let allPossibleDesignMem: Map<string, number> = new Map<string, number>();

// sanity check, remove unnecessary towels
for (let i = 0; i < initTowels.length; i++) {
  let possibleDesign = checkPossibility(initTowels[i]);
  if (!possibleDesign) availableTowels.push(initTowels[i]);
}

// let availableTowels = initTowels;

const designs = fileContent.split("\n\n")[1].split("\n");

console.log(initTowels);
console.log(availableTowels);
console.log(designs);

function checkPossibility(design: string): boolean {
  for (let i = 0; i <= availableTowels.length - 1; i++) {
    let possible = false;
    if (design === availableTowels[i]) {
      return true;
    }
    if (design.startsWith(availableTowels[i])) {
      possible = checkPossibility(design.substring(availableTowels[i].length));
    }
    if (possible) {
      return true;
    }
  }
  return false;
}

let possibleDesigns: string[] = [];

for (let i = 0; i < designs.length; i++) {
  const startTime = performance.now();
  let possibleDesign = checkPossibility(designs[i]);
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  console.log(elapsedTime);

  if (possibleDesign) {
    possibleDesigns.push(designs[i]);
  }
}

console.log(possibleDesigns.length);

// PART 2

allPossibleDesignMem = new Map<string, number>();

function getAllPossibility(design: string): [boolean, number] {
  let finalPos = false;
  if (allPossibleDesignMem.has(design)) {
    // console.log(design);
    return [true, allPossibleDesignMem.get(design)!];
  }

  let currentDesignPossibilityCount = 0;

  for (let i = 0; i <= initTowels.length - 1; i++) {
    let isPos = false;
    let subPosCount = 0;

    if (design === initTowels[i]) {
      finalPos = true;
      if (!allPossibleDesignMem.has(design)) {
        allPossibleDesignMem.set(design, 1);
      }
      currentDesignPossibilityCount++;
    }

    if (design.startsWith(initTowels[i])) {
      [isPos, subPosCount] = getAllPossibility(
        design.substring(initTowels[i].length),
      );
    }
    finalPos = finalPos || isPos;

    if (isPos) {
      currentDesignPossibilityCount += subPosCount;
      // console.log(
      //   "Substring: " +
      //     design.substring(initTowels[i].length) +
      //     ": " +
      //     subPosCount,
      // );
      allPossibleDesignMem.set(
        design.substring(initTowels[i].length),
        subPosCount,
      );
    }
  }
  return [finalPos, currentDesignPossibilityCount];
}

for (let i = 0; i < possibleDesigns.length; i++) {
  console.log("========");
  let [a, count] = getAllPossibility(possibleDesigns[i]);
  allPossibleDesignMem.set(possibleDesigns[i], count);
  console.log(possibleDesigns[i] + ": " + count);
}

let sum = 0;
for (let i = 0; i < possibleDesigns.length; i++) {
  sum += allPossibleDesignMem.get(possibleDesigns[i]) ?? 0;
}

console.log(sum);
