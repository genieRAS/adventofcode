import * as fs from "fs";

// const filePath = "input-sample.txt"; //2024,
const filePath = "input.txt"; //

const fileContent = fs.readFileSync(filePath, "utf8");

let inputValues: Map<string, number> = new Map<string, number>();

fileContent
  .split("\n\n")[0]
  .split("\n")
  .forEach((line) => {
    inputValues.set(line.split(": ")[0], parseInt(line.split(": ")[1]));
  });

console.log(inputValues);

const inputX = Array.from(inputValues.keys())
  .filter((k) => k.startsWith("x"))
  .map((k) => inputValues.get(k)!);

const inputXstr = inputX.join("");

const inputY = Array.from(inputValues.keys())
  .filter((k) => k.startsWith("y"))
  .map((k) => inputValues.get(k)!);

const inputYstr = inputY.join("");

// const connectedGate = fileContent.split("\n\n")[1].split("\n");

interface Connection {
  input: [string, string];
  output: string;
  operation: string;
}
const allConnections = fileContent
  .split("\n\n")[1]
  .split("\n")
  .map((line) => {
    return {
      input: [line.split(" ")[0], line.split(" ")[2]],
      operation: line.split(" ")[1],
      output: line.split(" -> ")[1],
    } as Connection;
  });

console.log(allConnections);

function getOperationValue(connection: Connection) {
  let input1 = inputValues.get(connection.input[0])!;
  let input2 = inputValues.get(connection.input[1])!;
  let outputValue = 0;

  switch (connection.operation) {
    case "AND":
      outputValue = input1 & input2;
      break;
    case "OR":
      outputValue = input1 | input2;
      break;
    case "XOR":
      outputValue = input1 ^ input2;
  }
  return outputValue;
}

let tmpConnections = new Set(allConnections);
while (tmpConnections.size > 0) {
  tmpConnections.forEach((connection) => {
    if (
      inputValues.has(connection.input[0]) &&
      inputValues.has(connection.input[1])
    ) {
      inputValues.set(connection.output, getOperationValue(connection));
      tmpConnections.delete(connection);
    }
  });
}

let binary: string = "";
Array.from(inputValues.keys())
  .filter((k) => k.startsWith("z"))
  .sort((a, b) => b.localeCompare(a))
  .forEach((z) => (binary += inputValues.get(z)));

console.log(binary);

let resultP1 = parseInt(binary, 2);
console.log(resultP1);

// console.log(inputXstr);
// console.log(inputYstr);
let X = parseInt(inputXstr, 2);
let Y = parseInt(inputYstr, 2);
let expectedResult = (X + Y).toString(2);
console.log(expectedResult);

let result = "";
for (let i = 0; i < binary.length; i++) {
  result += (parseInt(binary[i], 2) ^ parseInt(expectedResult[i], 2)).toString(
    2,
  );
}
console.log(result);
