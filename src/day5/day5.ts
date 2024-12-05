import * as fs from "fs";

// const filePath = "input-sample.txt"; // 143
const filePath = "input.txt"; // 6260, 5346

// PART 1
function checkLineCorrectOrder(
  line: string,
  rules: number[][],
): [correct: boolean, sortedLine: string] {
  // sort and compare strategy
  let sortedLine = line
    .split(",")
    .sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);

      let allKeys = Array.from(rules.keys());
      for (let i = 0; i < allKeys.length; i++) {
        let k = allKeys[i];
        if (k == aNum && rules[k]?.includes(bNum)) return -1;
        if (k == bNum && rules[k]?.includes(aNum)) return 1;
      }
      return 0;
    })
    .join(",");

  console.log("original  : " + line);
  console.log("sortedLine: " + sortedLine);
  return [sortedLine === line, sortedLine];
}

const fileContent = fs.readFileSync(filePath, "utf8");
const lines = fileContent.split("\n");

// let rules: Map<number, number> = new Map();

let rules: number[][] = [];
let updates: string[] = [];

lines.forEach((line) => {
  if (line.trim() === "") {
    return;
  }
  if (line.includes("|")) {
    let [a, b] = line.split("|");
    if (rules[parseInt(a)] == undefined) rules[parseInt(a)] = [];
    rules[parseInt(a)].push(parseInt(b));
    return;
  }
  if (line.includes(",")) {
    updates.push(line);
  }
});

let result = 0;
let sumOfIncorrectLine = 0;

updates.forEach((update) => {
  let [isCorrect, sortedLine] = checkLineCorrectOrder(update, rules);

  if (isCorrect) {
    let updateArr = update.split(",");
    let midIndex = Math.floor(updateArr.length / 2);
    // console.log(updateArr[midIndex]);
    result += parseInt(updateArr[midIndex]);
  } else {
    let updateArr = sortedLine.split(",");
    let midIndex = Math.floor(updateArr.length / 2);
    // console.log(updateArr[midIndex]);
    sumOfIncorrectLine += parseInt(updateArr[midIndex]);
  }
});

// Part 1
console.log(result);
// Part 2
console.log(sumOfIncorrectLine);
