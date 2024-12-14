import * as fs from "fs";

// const filePath = "input-sample.txt"; // 480,875318608908
const filePath = "input.txt"; // 37680,87550094242995

const fileContent = fs.readFileSync(filePath, "utf8");

const input = fileContent.split("\n\n");
let a: { x: number; y: number } = { x: 0, y: 0 };
let b: { x: number; y: number } = { x: 0, y: 0 };
let prize: { x: number; y: number } = { x: 0, y: 0 };

function extractCoordinates(
  inputString: string,
  label: string,
): { x: number; y: number } {
  const match = inputString.match(`${label}: X[+=](\\d+), Y[+=](\\d+)`);
  if (match) {
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);
    return { x, y };
  } else {
    throw Error(`Invalid input string: ${inputString}`);
  }
}

let result = 0;

input.forEach((testCase) => {
  console.log(testCase);
  console.log("==============");
  let caseLine = testCase.split("\n");
  a = extractCoordinates(caseLine[0], "Button A");
  b = extractCoordinates(caseLine[1], "Button B");
  prize = extractCoordinates(caseLine[2], "Prize");

  let bStep = (a.x * prize.y - a.y * prize.x) / (a.x * b.y - a.y * b.x);
  let aStep = (prize.x - b.x * bStep) / a.x;

  if (Number.isInteger(aStep) && Number.isInteger(bStep)) {
    result += aStep * 3 + bStep;
  }
});

console.log(result);

result = 0;
input.forEach((testCase) => {
  let caseLine = testCase.split("\n");
  a = extractCoordinates(caseLine[0], "Button A");
  b = extractCoordinates(caseLine[1], "Button B");
  prize = extractCoordinates(caseLine[2], "Prize");
  prize.x = prize.x + 10000000000000;
  prize.y = prize.y + 10000000000000;

  let bStep = (a.x * prize.y - a.y * prize.x) / (a.x * b.y - a.y * b.x);
  let aStep = (prize.x - b.x * bStep) / a.x;

  if (Number.isInteger(aStep) && Number.isInteger(bStep)) {
    result += aStep * 3 + bStep;
  }
});

console.log(result);
