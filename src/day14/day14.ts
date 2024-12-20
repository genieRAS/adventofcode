import * as fs from "fs";

// const filePath = "input-sample.txt"; // 480,875318608908
const filePath = "input.txt"; // 37680,87550094242995

const fileContent = fs.readFileSync(filePath, "utf8");

const input = fileContent.split("\n");

class Robot {
  x: number;
  y: number;
  vx: number;
  vy: number;

  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  public move(timeRemain: number, maxX: number, maxY: number) {
    if (timeRemain == 0) return;
    this.x += this.vx;
    this.y += this.vy;

    if (this.x >= maxX) {
      this.x -= maxX;
    }
    if (this.x < 0) {
      this.x = maxX + this.x;
    }

    if (this.y >= maxY) {
      this.y -= maxY;
    }
    if (this.y < 0) {
      this.y = maxY + this.y;
    }
    this.move(timeRemain - 1, maxX, maxY);
  }
}

function extractRobotInfo(inputString: string): Robot {
  const match = inputString.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
  if (match) {
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);
    const vx = parseInt(match[3]);
    const vy = parseInt(match[4]);

    return new Robot(x, y, vx, vy);
  } else {
    throw Error(`Invalid input string: ${inputString}`);
  }
}

let robotList: Robot[] = [];
const maxX = 101;
const maxY = 103;
input.forEach((robotInput) => {
  // console.log(extractRobotInfo(robotInput));
  let robot = extractRobotInfo(robotInput);
  robot.move(100, maxX, maxY);
  robotList.push(robot);
  // console.log(robot);
});

let countArr: number[] = [0, 0, 0, 0];

robotList.forEach((robot) => {
  if (robot.x < Math.floor(maxX / 2) && robot.y < Math.floor(maxY / 2)) {
    countArr[0]++;
  }
  if (robot.x < Math.floor(maxX / 2) && robot.y > Math.floor(maxY / 2)) {
    countArr[1]++;
  }
  if (robot.x > Math.floor(maxX / 2) && robot.y < Math.floor(maxY / 2)) {
    countArr[2]++;
  }
  if (robot.x > Math.floor(maxX / 2) && robot.y > Math.floor(maxY / 2)) {
    countArr[3]++;
  }
});
console.log(countArr);
console.log(countArr.reduce((a, b) => a * b));

// PART 2

robotList = [];

input.forEach((robotInput) => {
  let robot = extractRobotInfo(robotInput);
  robotList.push(robot);
});

const filename = "output.txt";

function render(robotList: Robot[]) {
  let matrix: string[][] = [];
  for (let i = 0; i < robotList.length; i++) {
    let robot = robotList[i];
    if (matrix[robot.y] === undefined) {
      matrix[robot.y] = ".".repeat(101).split("");
    }
    matrix[robot.y][robot.x] = "*";
  }

  let data = matrix.flatMap((m) => m.join("")).join("\n");

  fs.appendFile(filename, data, (err) => {
    if (err) throw err;
    // console.log("Data written to file:", filename);
  });
  // console.log(matrix.flatMap((m) => m.join("")));
}

for (let s = 0; s < 10000; s++) {
  for (let i = 0; i < robotList.length; i++) {
    robotList[i].move(1, maxX, maxY);
  }
  fs.appendFile(
    filename,
    "\n\n========== Num Of Seconds: " + (s + 1) + " ==========\n",
    (err) => {
      if (err) throw err;
      // console.log("Data written to file:", filename);
    },
  );
  render(robotList);
}
