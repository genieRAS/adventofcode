import * as fs from "fs";
import { before } from "node:test";

// const filePath = "input-sample.txt"; // 126384
const filePath = "input.txt"; //134120 , wrong cost: 190604550402542 // part2 result: 167389793580400

const fileContent = fs.readFileSync(filePath, "utf8");

const codes = fileContent.split("\n");

const numericKeyMap = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["#", "0", "A"],
];

const numericKeyIndex: Map<string, number[]> = new Map([
  ["7", [0, 0]],
  ["8", [0, 1]],
  ["9", [0, 2]],
  ["4", [1, 0]],
  ["5", [1, 1]],
  ["6", [1, 2]],
  ["1", [2, 0]],
  ["2", [2, 1]],
  ["3", [2, 2]],
  ["0", [3, 1]],
  ["A", [3, 2]],
]);

const controlKeyMap = [
  ["#", "^", "A"],
  ["<", "v", ">"],
];

const controlKeyIndex: Map<string, number[]> = new Map([
  ["", [0, 0]],
  ["^", [0, 1]],
  ["A", [0, 2]],
  ["<", [1, 0]],
  ["v", [1, 1]],
  [">", [1, 2]],
]);

function getControlSequenceForSingleDigit(
  digit: string,
  curX: number,
  curY: number,
): string[] {
  if (numericKeyMap[curX][curY] == digit) return [""];

  let [digitX, digitY] = numericKeyIndex.get(digit)!;

  let controlList: string[] = [];

  if (curY > digitY && curY - 1 >= 0 && numericKeyMap[curX][curY - 1] != "#") {
    getControlSequenceForSingleDigit(digit, curX, curY - 1).forEach(
      (control) => {
        controlList.push("<" + control);
      },
    );
  }
  if (
    curX < digitX &&
    curX + 1 < numericKeyMap.length &&
    numericKeyMap[curX + 1][curY] != "#"
  ) {
    getControlSequenceForSingleDigit(digit, curX + 1, curY).forEach(
      (control) => {
        controlList.push("v" + control);
      },
    );
  }
  if (
    curY < digitY &&
    curY + 1 < numericKeyMap[0].length &&
    numericKeyMap[curX][curY + 1] != "#"
  ) {
    getControlSequenceForSingleDigit(digit, curX, curY + 1).forEach(
      (control) => {
        controlList.push(">" + control);
      },
    );
  }
  if (curX > digitX && curX - 1 >= 0 && numericKeyMap[curX - 1][curY] != "#") {
    getControlSequenceForSingleDigit(digit, curX - 1, curY).forEach(
      (control) => {
        controlList.push("^" + control);
      },
    );
  }

  return controlList;
}

function getBestSequence(listControl: string[]) {
  let minCost = 1000;
  let bestControlSequence = "";
  listControl
    .map((control) => control + "A")
    .forEach((control) => {
      let moves = control.split("");
      let cost = 0;
      for (let i = 0; i < moves.length - 1; i++) {
        if (moves[i + 1] == "A") {
          switch (moves[i]) {
            case ">":
              cost = cost + 1;
              break;
            case "^":
              cost = cost + 2;
              break;
            case "v":
              cost = cost + 3;
              break;
            case "<":
              cost = cost + 4;
              break;
          }
        } else if (
          moves[i] != moves[i + 1] &&
          (moves[i] == "v" || moves[i + 1] == "v")
        ) {
          cost = cost + 2;
        } else if (moves[i] != moves[i + 1]) {
          cost = cost + 4;
        }
      }
      if (cost < minCost) {
        minCost = cost;
        bestControlSequence = control;
      }
    });
  return bestControlSequence;
}

function getControlSequenceForCode(code: string): string {
  let sequenceControl = "";
  let prevPosition = numericKeyIndex.get("A")!;

  code.split("").forEach((digit) => {
    let listControl = getControlSequenceForSingleDigit(
      digit,
      prevPosition[0],
      prevPosition[1],
    );
    sequenceControl += getBestSequence(listControl);
    prevPosition = numericKeyIndex.get(digit)!;
  });

  return sequenceControl;
}

function getControlSequenceForSingleMove(
  move: string,
  curX: number,
  curY: number,
): string[] {
  let controlList: string[] = [];
  if (controlKeyMap[curX][curY] == move) return [""];

  let [moveX, moveY] = controlKeyIndex.get(move)!;

  if (curY > moveY && curY - 1 >= 0 && controlKeyMap[curX][curY - 1] != "#") {
    getControlSequenceForSingleMove(move, curX, curY - 1).forEach((control) => {
      controlList.push("<" + control);
    });
  }
  if (
    curX < moveX &&
    curX + 1 < controlKeyMap.length &&
    controlKeyMap[curX + 1][curY] != "#"
  ) {
    getControlSequenceForSingleMove(move, curX + 1, curY).forEach((control) => {
      controlList.push("v" + control);
    });
  }
  if (
    curY < moveY &&
    curY + 1 < controlKeyMap[0].length &&
    controlKeyMap[curX][curY + 1] != "#"
  ) {
    getControlSequenceForSingleMove(move, curX, curY + 1).forEach((control) => {
      controlList.push(">" + control);
    });
  }
  if (curX > moveX && curX - 1 >= 0 && controlKeyMap[curX - 1][curY] != "#") {
    getControlSequenceForSingleMove(move, curX - 1, curY).forEach((control) => {
      controlList.push("^" + control);
    });
  }

  return controlList;
}

function getControlSequenceForControlSequence(inputControlSeq: string): string {
  let sequenceControl = "";
  let prevPosition = controlKeyIndex.get("A")!;

  let subControls = inputControlSeq.split("A");
  subControls = subControls.slice(0, subControls.length - 1); // remove last item when splitting by A
  subControls.forEach((subControl) => {
    let subSeq = "";
    (subControl + "A").split("").forEach((move) => {
      let seq = "";
      seq = getBestSequence(
        getControlSequenceForSingleMove(move, prevPosition[0], prevPosition[1]),
      );
      subSeq += seq;
      prevPosition = controlKeyIndex.get(move)!;
    });
    // console.log(subControl + "A" + " |==> " + subSeq);
    sequenceControl += subSeq;
  });

  // inputControlSeq.split("").forEach((move) => {
  //   let seq = "";
  //   seq = getBestSequence(
  //     getControlSequenceForSingleMove(move, prevPosition[0], prevPosition[1]),
  //   );
  //   sequenceControl += seq;
  //   prevPosition = controlKeyIndex.get(move)!;
  // });
  console.log("Input " + inputControlSeq);
  console.log("Control " + sequenceControl);

  return sequenceControl;
}

let result = 0;
codes.forEach((code: string) => {
  let sequenceControl = getControlSequenceForCode(code);
  console.log(sequenceControl);

  let controlLv1 = getControlSequenceForControlSequence(sequenceControl);
  let controlLv2 = getControlSequenceForControlSequence(controlLv1);

  console.log(
    "Code: " +
      code +
      "  || result: " +
      controlLv2.length +
      " * " +
      parseInt(code.replace("A", "")),
  );
  result += controlLv2.length * parseInt(code.replace("A", ""));
});

console.log(result);

// ===================== PART 2 =====================

function getControlSequence(input: string): string {
  let sequenceControl = "";
  let subControls = input.split("A");
  subControls = subControls.slice(0, subControls.length - 1); // remove last item when splitting by A
  subControls.forEach((subControl) => {
    subControl = subControl + "A";
    let subSeq = "";
    let prevPosition = controlKeyIndex.get("A")!;
    subControl.split("").forEach((move) => {
      let seq = "";
      seq = getBestSequence(
        getControlSequenceForSingleMove(move, prevPosition[0], prevPosition[1]),
      );
      subSeq += seq;
      prevPosition = controlKeyIndex.get(move)!;
    });
    sequenceControl += subSeq;
  });
  return sequenceControl;
}

let sequenceControlNumberMap = new Map<string, number>(); // inputSeq|layer => length of sequence when no more layer

function getControlSequenceNumberRecursive(
  inputControlSeq: string,
  numOfLayer: number,
): number {
  let sequenceControlLength = 0;

  if (numOfLayer === 1) {
    sequenceControlLength = getControlSequence(inputControlSeq).length;
    sequenceControlNumberMap.set(
      inputControlSeq + "|" + numOfLayer,
      sequenceControlLength,
    );
    return sequenceControlLength;
  }

  if (sequenceControlNumberMap.has(inputControlSeq + "|" + numOfLayer)) {
    // console.log("HIT HIT: " + inputControlSeq + "|" + numOfLayer);
    return sequenceControlNumberMap.get(inputControlSeq + "|" + numOfLayer)!;
  }

  let subControls = inputControlSeq.split("A");
  subControls = subControls.slice(0, subControls.length - 1); // remove last item when splitting by A
  subControls.forEach((subControl) => {
    subControl = subControl + "A";

    if (sequenceControlNumberMap.has(subControl + "|" + numOfLayer)) {
      // console.log("HIT: " + subControl + "|" + numOfLayer);
      sequenceControlLength += sequenceControlNumberMap.get(
        subControl + "|" + numOfLayer,
      )!;
    } else {
      let subSequenceControlLength = getControlSequenceNumberRecursive(
        getControlSequence(subControl),
        numOfLayer - 1,
      );

      sequenceControlLength += subSequenceControlLength;

      sequenceControlNumberMap.set(
        subControl + "|" + numOfLayer,
        subSequenceControlLength,
      );
      sequenceControlNumberMap.set(
        getControlSequence(subControl) + "|" + (numOfLayer - 1),
        subSequenceControlLength,
      );
    }
  });

  // console.log(sequenceControl);

  return sequenceControlLength;
}

let finalSum = 0;
codes.forEach((code: string) => {
  let sequenceControl = getControlSequenceForCode(code);
  sequenceControlNumberMap.clear();
  let lenOfLastSeq = getControlSequenceNumberRecursive(sequenceControl, 25);
  sequenceControlNumberMap.clear();

  console.log(lenOfLastSeq);
  finalSum += lenOfLastSeq * parseInt(code.replace("A", ""));
});

console.log(finalSum);

let all1stseq = [
  ">A",
  "<A",
  "^A",
  "vA",
  "v<<A",
  "<v<A",
  "<<vA",
  "v<A",
  "<<A",
  "<^A",
  ">>A",
  ">^A",
  "^>A",
  ">>^A",
  "^>>A",
];

console.log(
  "======CHECK BETTER PATTERN => THEN CHOOSE COST FOR getBestSequence =========",
);
all1stseq.forEach((sequenceControl: string) => {
  sequenceControlNumberMap.clear();
  let lenOfLastSeq = getControlSequenceNumberRecursive(sequenceControl, 25);
  sequenceControlNumberMap.clear();

  console.log(sequenceControl + ": " + lenOfLastSeq);
});
