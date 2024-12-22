import * as fs from "fs";

// const filePath = "input-sample.txt"; // 37327623
// const filePath = "input-sample-part2.txt"; // 37990510 | 23 => "-2, 1, -1, 3"
const filePath = "input.txt"; // 20332089158 | 2191 => "0, -3, 2, 1"

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

let prices: number[][] = [];
let changes: number[][] = [];

secretNumbers.forEach((secret, index) => {
  let num = BigInt(parseInt(secret));

  prices[index] = [Number(num % 10n)];
  changes[index] = [];

  for (let i = 0; i < numOfGen; i++) {
    num = step1(num);
    num = step2(num);
    num = step3(num);
    // console.log(num);

    let price = Number(num % 10n);
    let change = price - (prices[index][prices[index].length - 1] ?? 0);

    prices[index].push(price);
    changes[index].push(change);
  }
  result += num;
  // console.log(prices);
  // console.log(changes);
});

console.log(result);

let fourChangesPriceMap: Map<string, number[]> = new Map();

changes.forEach((changesOfSingleBuyer, buyerIndex) => {
  changesOfSingleBuyer.forEach((change, index) => {
    if (index < 3) return;

    let changeSeq = changesOfSingleBuyer.slice(index - 3, index + 1).join("");
    if (!fourChangesPriceMap.has(changeSeq)) {
      let priceList: number[] = new Array(prices.length).fill(0);
      priceList[buyerIndex] = prices[buyerIndex][index + 1];
      fourChangesPriceMap.set(changeSeq, priceList);
    } else {
      let priceList = fourChangesPriceMap.get(changeSeq)!;
      // if sequence not found before
      if (priceList[buyerIndex] == 0) {
        priceList[buyerIndex] = prices[buyerIndex][index + 1];
      }
    }
  });
});

let maxBananas = 0;
let chosenSeq = "";

fourChangesPriceMap.forEach((price, changeSeq) => {
  let sumPrice = price.reduce((sum, currentValue) => sum + currentValue, 0);
  if (sumPrice > maxBananas) {
    maxBananas = sumPrice;
    chosenSeq = changeSeq;
  }
});

// console.log(fourChangesPriceMap);
console.log(chosenSeq);
console.log(maxBananas);
