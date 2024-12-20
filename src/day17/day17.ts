import * as fs from "fs";
import { log } from "node:util";

// const filePath = "input-sample.txt"; // 4,6,3,5,6,3,5,2,1,0
// const filePath = "input-sample-2.txt"; // 117440
const filePath = "input.txt"; // 5,0,3,5,7,6,1,5,4  ||

const fileContent = fs.readFileSync(filePath, "utf8");

const registerA = fileContent.split("\n")[0].split(": ")[1];
const registerB = fileContent.split("\n")[1].split(": ")[1];
const registerC = fileContent.split("\n")[2].split(": ")[1];

const program = fileContent.split("\n\n")[1].split(": ")[1];

let DEBUG = false;
console.log("Program: " + program);

let regA = BigInt(parseInt(registerA));
let regB = BigInt(parseInt(registerB));
let regC = BigInt(parseInt(registerC));

let pPointer = 0;
const nextInstruction = () => (pPointer = pPointer + 2);

const getComboOperandValue = (operand: number) => {
  switch (operand) {
    case 4:
      return regA;
    case 5:
      return regB;
    case 6:
      return regC;
    case 7:
      throw Error("Wrong combo operand");
    default:
      return operand;
  }
};

const avd = (literalOperand: number) => {
  DEBUG &&
    console.log(
      "avd: regA = regA / Math.pow(2, getComboOperandValue(literalOperand))"
    );

  let powerResult = BigInt(
    Math.pow(2, Number(getComboOperandValue(literalOperand)))
  );

  regA = regA / powerResult;
};

const bxl = (literalOperand: number) => {
  DEBUG && console.log("bxl: regB = regB ^ literalOperand");

  regB = regB ^ BigInt(literalOperand);
};

const bst = (literalOperand: number) => {
  DEBUG && console.log("bst: regB = getComboOperandValue(literalOperand) % 8");

  regB = BigInt(getComboOperandValue(literalOperand)) % 8n;
};

const jnz = (literalOperand: number) => {
  if (regA === 0n) return;
  DEBUG && console.log("jnz");
  pPointer = literalOperand;
  pPointer = pPointer - 2;
};

const bxc = (literalOperand: number) => {
  DEBUG && console.log("bxc: regB = regB ^ regC;");

  regB = regB ^ regC;
};

const out = (literalOperand: number): string => {
  DEBUG && console.log("OUT: regB % 8");

  // process.stdout.write((getComboOperandValue(literalOperand) % 8) + ",");
  return (Number(getComboOperandValue(literalOperand)) % 8).toString();
};

const bdv = (literalOperand: number) => {
  DEBUG &&
    console.log(
      "bdv: regB = Math.floor(regA / Math.pow(2, getComboOperandValue(literalOperand)))"
    );
  let powerResult = BigInt(
    Math.pow(2, Number(getComboOperandValue(literalOperand)))
  );

  regB = regA / powerResult;
};

const cdv = (literalOperand: number) => {
  DEBUG &&
    console.log(
      "cdv: regC = Math.floor(regA / Math.pow(2, getComboOperandValue(literalOperand)))"
    );
  let powerResult = BigInt(
    Math.pow(2, Number(getComboOperandValue(literalOperand)))
  );

  regC = regA / powerResult;
};

const instructionMap = new Map<number, Function>([
  [0, avd],
  [1, bxl],
  [2, bst],
  [3, jnz],
  [4, bxc],
  [5, out],
  [6, bdv],
  [7, cdv],
]);

let programExe = program.split(",").map((letter) => parseInt(letter));

let output = "";

while (pPointer < programExe.length) {
  let instruction = programExe[pPointer];
  let literalOperand = programExe[pPointer + 1];
  let c = instructionMap.get(instruction)?.(literalOperand);
  if (instruction == 5) {
    output = output.concat(c);
  }
  nextInstruction();
}
console.log(output.split("").join(","));

// PART 2
function getLast3Bits(num: BigInt): string {
  const binary = num.toString(2);
  const last3 = binary.slice(-3); // Extract the last 3 characters
  if (last3.length < 3) {
    return last3.padStart(3, "0");
  }
  return last3;
}

let expectedA = 0n;
let A = 0;
let o = -1;

let resultConcat = "";

while (o != 0) {
  A++;
  o = (A % 8 ^ 1 ^ 5 ^ (A / Math.pow(2, A % 8 ^ 1))) % 8;
}
o = -1;

let AA = BigInt(A);

let carryOn = 0n;

for (let i = programExe.length - 2; i >= 0; i--) {
  AA = (AA << 3n) + carryOn;
  console.log("CHECKING: " + programExe[i]);

  for (let j = 0; j < 8; j++) {
    let AATest = AA + BigInt(j);

    let threeBits = Number(AATest % 8n);
    let powResult = BigInt(Math.pow(2, threeBits ^ 1));
    let divideRes = AATest / powResult;

    let oo = (AATest % 8n ^ 1n ^ 5n ^ divideRes) % 8n;
    if (oo == BigInt(programExe[i])) {
      AA = AATest;
      resultConcat = resultConcat + getLast3Bits(AA);
      console.log(AATest.toString(2));
      console.log("FOUND: " + programExe[i]);
      carryOn = 0n;
      expectedA = AA;
      break;
    }
    if ((AATest % 8n == 0n && j > 0) || j == 7) {
      console.log(AA.toString(2));
      AA = AA >> 3n;
      carryOn = (AA % 8n) + 1n;
      AA = AA >> 3n;
      console.log(AA.toString(2));
      console.log("==== END REMOVE ==" + programExe[i]);
      i = i + 2;
      break;
    }
  }
}
console.log(expectedA);
