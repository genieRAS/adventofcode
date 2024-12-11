import * as fs from "fs";

// const filePath = "input-sample.txt"; // 1928, 2858
const filePath = "input.txt"; // 6241633730082,6265268809555

const fileContent = fs.readFileSync(filePath, "utf8");

const input = fileContent.split("\n")[0];

let individualRepresent = input.split("").map((digit, index) => {
  if (index % 2 === 0) {
    let fileIndex = (index / 2).toString() + "|";
    return fileIndex
      .repeat(parseInt(digit))
      .split("|")
      .filter((x) => x !== "");
  } else {
    return "."
      .repeat(parseInt(digit))
      .split("")
      .filter((x) => x !== null);
  }
});

// console.log(individualRepresent.flat());

function part1CheckSum(individualRepresent: string[][]): number {
  let individualRepresentFlat = individualRepresent.flat();

  for (let i = individualRepresentFlat.length - 1; i > 0; i--) {
    if (individualRepresentFlat[i] !== ".") {
      for (let j = 0; j < i; j++) {
        if (individualRepresentFlat[j] === ".") {
          individualRepresentFlat[j] = individualRepresentFlat[i];
          individualRepresentFlat[i] = ".";
        }
      }
    }
  }
  // console.log(individualRepresentFlat);

  let checksum = 0;
  for (let i = individualRepresentFlat.length - 1; i > 0; i--) {
    if (individualRepresentFlat[i] !== ".") {
      checksum += parseInt(individualRepresentFlat[i]) * i;
    }
  }
  return checksum;
}

console.log(part1CheckSum(individualRepresent));

// PART 2

function part2CheckSum(individualRepresent: string[][]): number {
  let individualRepresentFlat = individualRepresent.flat();

  for (let i = individualRepresentFlat.length - 1; i > 0; i--) {
    if (individualRepresentFlat[i] !== ".") {
      let numOfFileBlock = 1;
      let temI = i - 1;
      while (individualRepresentFlat[temI] === individualRepresentFlat[i]) {
        numOfFileBlock++;
        temI--;
      }
      i = i - numOfFileBlock + 1;

      // console.log(individualRepresentFlat);

      for (let j = 0; j < i; j++) {
        let numOfEmptyBlock = 0;

        while (
          individualRepresentFlat[j] === "." &&
          numOfEmptyBlock < numOfFileBlock
        ) {
          numOfEmptyBlock++;
          j++;
        }
        if (numOfEmptyBlock >= numOfFileBlock) {
          for (let k = 0; k < numOfFileBlock; k++) {
            individualRepresentFlat[j - k - 1] = individualRepresentFlat[i];
          }
          for (let k = 0; k < numOfFileBlock; k++) {
            individualRepresentFlat[i + k] = ".";
          }
        }
      }
    }
  }
  // console.log(individualRepresentFlat);

  let checksum = 0;
  for (let i = individualRepresentFlat.length - 1; i > 0; i--) {
    if (individualRepresentFlat[i] !== ".") {
      checksum += parseInt(individualRepresentFlat[i]) * i;
    }
  }
  return checksum;
}

console.log(part2CheckSum(individualRepresent));
