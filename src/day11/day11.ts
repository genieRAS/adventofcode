import * as fs from "fs";

// const filePath = "input-sample.txt"; // 55312
const filePath = "input.txt"; // 203228

const fileContent = fs.readFileSync(filePath, "utf8");

const input = fileContent.split("\n")[0].split(" ");
console.log(input);

const numOfBlink = 75;

let memoryMap: Map<number, number>[] = [];

// // Split a stone
function splitStone(stone: string, blink: number): number {
  if (blink == 0) return 1;

  if (memoryMap[parseInt(stone)] == undefined)
    memoryMap[parseInt(stone)] = new Map<number, number>();
  if (memoryMap[parseInt(stone)].get(blink) != undefined)
    return <number>memoryMap[parseInt(stone)].get(blink);

  // console.log(stone);
  let result = 0;

  if (parseInt(stone) === 0) {
    result = splitStone("1", blink - 1);
  } else if (stone.length % 2 === 0) {
    let firstHalf = parseInt(stone.substring(0, stone.length / 2));
    let secondHalf = parseInt(stone.substring(stone.length / 2, stone.length));
    result =
      splitStone(firstHalf.toString(), blink - 1) +
      splitStone(secondHalf.toString(), blink - 1);
  } else {
    result = splitStone((parseInt(stone) * 2024).toString(), blink - 1);
  }

  memoryMap[parseInt(stone)].set(blink, result);
  return result;
}

let totalStone = 0;
input.forEach((stone) => {
  totalStone += splitStone(stone, numOfBlink);
});

// console.log(memoryMap);
console.log(totalStone);
