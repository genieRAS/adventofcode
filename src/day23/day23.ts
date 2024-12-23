import * as fs from "fs";

// const filePath = "input-sample.txt"; // 7 | co,de,ka,ta
const filePath = "input.txt"; // 1035 | de,id,ke,ls,po,sn,tf,tl,tm,uj,un,xw,yz

const fileContent = fs.readFileSync(filePath, "utf8");

let pairs = fileContent.split("\n");

let normalPairs = pairs.map((pair) => {
  return pair.split("-");
});

let normalGroup = new Map<string, string[]>();

for (let i = 0; i < normalPairs.length; i++) {
  let key = normalPairs[i][0];
  let value = normalPairs[i][1];

  let listOfPair = normalGroup.get(key);
  if (listOfPair == null) {
    listOfPair = [];
  }
  listOfPair.push(value);
  normalGroup.set(key, listOfPair);

  listOfPair = normalGroup.get(value);
  if (listOfPair == null) {
    listOfPair = [];
  }
  listOfPair.push(key);
  normalGroup.set(value, listOfPair);
}

// console.log(normalGroup);

let pairWithT = pairs
  .filter((pair) => {
    return pair.startsWith("t") || pair.includes("-t");
  })
  .map((pair) => {
    return pair.split("-");
  });

let groupedByT = new Map<string, string[]>();

for (let i = 0; i < pairWithT.length; i++) {
  if (pairWithT[i][0].startsWith("t")) {
    let key = pairWithT[i][0];
    let value = pairWithT[i][1];

    let listOfPair = groupedByT.get(key);
    if (listOfPair == null) {
      listOfPair = [];
    }
    listOfPair.push(value);
    groupedByT.set(key, listOfPair);
  }
  if (pairWithT[i][1].startsWith("t")) {
    let key = pairWithT[i][1];
    let value = pairWithT[i][0];

    let listOfPair = groupedByT.get(key);
    if (listOfPair == null) {
      listOfPair = [];
    }
    listOfPair.push(value);
    groupedByT.set(key, listOfPair);
  }
}

// console.log(groupedByT);

let set3Com = new Set<string>();
let numOfSet3Com = 0;

groupedByT.forEach((listKey, groupKey) => {
  for (let i = 0; i < listKey.length - 1; i++) {
    for (let j = i + 1; j < listKey.length; j++) {
      if (normalGroup.get(listKey[i])!.includes(listKey[j])) {
        let set3 = [groupKey, listKey[i], listKey[j]].sort((a, b) =>
          a.localeCompare(b),
        );
        set3Com.add(set3.join("|"));

        numOfSet3Com++;
      }
    }
  }
});

// console.log(numOfSet3Com); // 1078 - with duplication
// console.log(set3Com);
console.log(set3Com.size); // 1046

// PART 2
let allConnectedSet = new Set<string>();
let maxPoints = 0;
let seqResult = "";

function addAllConnectedPoints(points: string[]) {
  points.sort((a, b) => a.localeCompare(b));

  if (points.length > maxPoints) {
    maxPoints = points.length;
    seqResult = points.join(",");
  }
  allConnectedSet.add(points.join(","));
}

let visittedSeq = new Set<string>();

function FindAllConnectedSeq(curSeq: string[], curLinkedPoints: Set<string>) {
  let s = Array.from(curSeq);
  s.sort((a, b) => a.localeCompare(b));
  if (visittedSeq.has(s.join(","))) {
    return;
  }

  for (let index = 0; index < curSeq.length - 1; index++) {
    let point = curSeq[index];
    if (curLinkedPoints.delete(point) == false) {
      addAllConnectedPoints(curSeq.slice(0, curSeq.length - 1));
      return;
    }
    if (curLinkedPoints.size == 0) {
      addAllConnectedPoints(curSeq.slice(0, curSeq.length));
      return;
    }
  }

  curLinkedPoints.forEach((point) => {
    let newSeq = Array.from(curSeq);
    newSeq.push(point);
    FindAllConnectedSeq(newSeq, new Set(normalGroup.get(point)));
  });
  visittedSeq.add(s.join(","));
}

normalGroup.forEach((linkedPoints, point) => {
  FindAllConnectedSeq([point], new Set(linkedPoints));
});

// console.log(allConnectedSet);
console.log(seqResult);
console.log(maxPoints);
