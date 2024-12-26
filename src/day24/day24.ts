import * as fs from "fs";
import { isProxy } from "node:util/types";

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

let resultOutputs: string[] = [];

function aFullyAdditionGates(index: number, cin: string | undefined): string {
  let indexStr = index.toString().padStart(2, "0");
  let x = "x" + indexStr;
  let y = "y" + indexStr;
  let z = "z" + indexStr;

  let xorConnection = allConnections.find((connection) => {
    let inputSet = new Set(connection.input);
    return inputSet.has(x) && inputSet.has(y) && connection.operation === "XOR";
  });

  if (xorConnection === undefined) {
    console.log(indexStr);
  }
  let xy = xorConnection?.output!;

  if (cin === undefined) {
    if (xy != z) {
      console.log(x + "|" + y);
    }

    let andConnection = allConnections.find((connection) => {
      let inputSet = new Set(connection.input);
      return (
        inputSet.has(x) && inputSet.has(y) && connection.operation === "AND"
      );
    });

    return andConnection!.output;
  } else {
    let xor2Connection = allConnections.find((connection) => {
      let inputSet = new Set(connection.input);
      return (
        inputSet.has(xy) && inputSet.has(cin) && connection.operation === "XOR"
      );
    });

    if (xor2Connection === undefined) {
      console.log(xy + "|" + cin);

      let expectedXor2Connection = allConnections.find((connection) => {
        let inputSet = new Set(connection.input);
        return inputSet.has(cin) && connection.operation === "XOR";
      })!;

      expectedXor2Connection.input.forEach((input) => {
        if (input != cin) {
          let xor2Input = input.slice(0, input.length);

          //Now find a connection has output is xor2Input
          let swappedXorConnection = allConnections.find((connection) => {
            return connection.output === xor2Input;
          })!;

          console.log(swappedXorConnection);

          let tmp = swappedXorConnection.output.slice(
            0,
            swappedXorConnection.output.length,
          );
          swappedXorConnection.output = xorConnection!.output.slice(
            0,
            xorConnection!.output.length,
          );
          xorConnection!.output = tmp;
          xy = tmp;

          // add result
          resultOutputs.push(xorConnection!.output);
          resultOutputs.push(swappedXorConnection.output);
        }
      });

      xor2Connection = allConnections.find((connection) => {
        let inputSet = new Set(connection.input);
        return (
          inputSet.has(xy) &&
          inputSet.has(cin) &&
          connection.operation === "XOR"
        );
      })!;
    }

    if (xor2Connection.output != z) {
      console.log(xy + "|" + cin);

      let expectedCon = allConnections.find((connection) => {
        return connection.output == z;
      })!;
      console.log(expectedCon.input[0] + "|" + expectedCon.input[1]);

      expectedCon.output = xor2Connection.output;
      xor2Connection.output = z;

      // add result
      resultOutputs.push(expectedCon.output);
      resultOutputs.push(xor2Connection.output);
    }

    let andConnection = allConnections.find((connection) => {
      let inputSet = new Set(connection.input);
      return (
        inputSet.has(x) && inputSet.has(y) && connection.operation === "AND"
      );
    });

    let cout1 = andConnection!.output;

    let and2Connection = allConnections.find((connection) => {
      let inputSet = new Set(connection.input);
      return (
        inputSet.has(xy) && inputSet.has(cin) && connection.operation === "AND"
      );
    });
    let cout2 = and2Connection!.output;

    let orConnection = allConnections.find((connection) => {
      let inputSet = new Set(connection.input);
      return (
        inputSet.has(cout1) &&
        inputSet.has(cout2) &&
        connection.operation === "OR"
      );
    });

    if (orConnection === undefined) {
      console.log(cout1 + "|" + cout2);
    }

    return orConnection!.output;
  }
}

let carry: string | undefined = undefined;
for (let i = 0; i < 44; i++) {
  carry = aFullyAdditionGates(i, carry);
}

// xorConnection:  x XOR y -> xy
// xor2Connection: xy XOR cin -> z
// andConnection: x AND y -> cout1
// and2Connection:  xy AND cin -> cout2
// orConnection: cout1 OR cout2 -> cout
//
console.log(resultOutputs.sort((a, b) => a.localeCompare(b)).join(","));
