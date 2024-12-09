import * as fs from "fs";

// const filePath = "input-sample.txt"; // 14, 34
// const filePath = "input-sample-T.txt"; // 3, 9

const filePath = "input.txt"; // 249, 905

const fileContent = fs.readFileSync(filePath, "utf8");

let mapCharacterPosition: Map<string, [number, number][]> = new Map();
const lines = fileContent.split("\n");
let maxi = lines.length;
let maxj = lines[0]?.length ?? 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const characters = line.split("");
  for (let j = 0; j < characters.length; j++) {
    const character = characters[j];
    if (character.trim() !== ".") {
      let characterPositions = mapCharacterPosition.get(character) ?? [];
      characterPositions.push([i, j]);
      mapCharacterPosition.set(character, characterPositions);
    }
  }
}

// PART 1
let antinodeSet: Set<string> = new Set();

Array.from(mapCharacterPosition.keys()).forEach((char) => {
  let characterPositions = mapCharacterPosition.get(char)!;
  for (let i = 0; i < characterPositions.length - 1; i++) {
    let [i1, j1] = characterPositions[i];

    for (let j = i + 1; j < characterPositions.length; j++) {
      let [i2, j2] = characterPositions[j];

      if (
        2 * i2 - i1 >= 0 &&
        2 * i2 - i1 < maxi &&
        2 * j2 - j1 < maxj &&
        2 * j2 - j1 >= 0
      ) {
        antinodeSet.add(2 * i2 - i1 + "|" + (2 * j2 - j1));
      }
      if (
        2 * i1 - i2 < maxi &&
        2 * i1 - i2 >= 0 &&
        2 * j1 - j2 >= 0 &&
        2 * j1 - j2 < maxj
      ) {
        antinodeSet.add(2 * i1 - i2 + "|" + (2 * j1 - j2));
      }
    }
  }
});

console.log(antinodeSet.size);

//====PART2=======
antinodeSet = new Set();

Array.from(mapCharacterPosition.keys()).forEach((char) => {
  let characterPositions = mapCharacterPosition.get(char)!;
  for (let i = 0; i < characterPositions.length; i++) {
    let ij1Srt = characterPositions[i].join(",");

    if (characterPositions.length > 1)
      antinodeSet.add(
        characterPositions[i][0] + "|" + characterPositions[i][1],
      );

    for (let j = i + 1; j < characterPositions.length; j++) {
      let ij2Str = characterPositions[j].join(",");

      let [i1, j1] = ij1Srt.split(",").map((a) => parseInt(a));
      let [i2, j2] = ij2Str.split(",").map((a) => parseInt(a));

      while (
        2 * i2 - i1 < maxi &&
        2 * i2 - i1 >= 0 &&
        2 * j2 - j1 < maxj &&
        2 * j2 - j1 >= 0
      ) {
        antinodeSet.add(2 * i2 - i1 + "|" + (2 * j2 - j1));
        let temIJ = [i2, j2].join(",");
        i2 = 2 * i2 - i1;
        j2 = 2 * j2 - j1;
        [i1, j1] = temIJ.split(",").map((a) => parseInt(a));
      }

      [i1, j1] = ij1Srt.split(",").map((a) => parseInt(a));
      [i2, j2] = ij2Str.split(",").map((a) => parseInt(a));

      while (
        2 * i1 - i2 >= 0 &&
        2 * i1 - i2 < maxi &&
        2 * j1 - j2 >= 0 &&
        2 * j1 - j2 < maxj
      ) {
        antinodeSet.add(2 * i1 - i2 + "|" + (2 * j1 - j2));
        let temIJ = [i1, j1].join(",");

        i1 = 2 * i1 - i2;
        j1 = 2 * j1 - j2;
        [i2, j2] = temIJ.split(",").map((a) => parseInt(a));
      }
    }
  }
});

console.log(antinodeSet.size);
