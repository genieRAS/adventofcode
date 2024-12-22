import * as fs from "fs";

// const filePath = "input-sample.txt"; //
const filePath = "input.txt"; //

const fileContent = fs.readFileSync(filePath, "utf8");

function step1(secret: bigint): bigint {
  // mul 64 => mix => prune
  return ((secret * 64n) ^ secret) % 16777216n;
}

function step2(secret: bigint): bigint {
  // div 32 => mix => prune
  return ((secret / 32n) ^ secret) % 16777216n;
}

function step3(secret: bigint): bigint {
  // mul 2048 => mix => prune
  return ((secret * 2048n) ^ secret) % 16777216n;
}
const secretNumbers = fileContent.split("\n");

const numOfGen = 2000;
let result: bigint = BigInt(0);
secretNumbers.forEach((secret) => {
  let num = BigInt(parseInt(secret));

  for (let i = 0; i < numOfGen; i++) {
    num = step1(num);
    num = step2(num);
    num = step3(num);
    // console.log(num);
  }
  result += num;
  // console.log(num);
});

console.log(result);
