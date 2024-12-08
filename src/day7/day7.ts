import * as fs from "fs";

// const filePath = "input-sample.txt"; // 3749
const filePath = "input.txt"; // 3119088655389 / 264184041398847

// PART 1
const fileContent = fs.readFileSync(filePath, "utf8");
const lines = fileContent.split("\n");

function testCalibration(params: string[], calibration: number): boolean {
  if (params.length == 1) return calibration == parseInt(params[0]);

  let lastParam = parseInt(params[params.length - 1]);

  return (
    (calibration % lastParam == 0 &&
      testCalibration(
        params.slice(0, params.length - 1),
        calibration / lastParam,
      )) ||
    (calibration - lastParam > 0 &&
      testCalibration(
        params.slice(0, params.length - 1),
        calibration - lastParam,
      ))
  );
}

let result = 0;
lines.forEach((line) => {
  //console.log(line);
  line = line.trim();
  let sumMul = parseInt(line.split(":")[0]);
  let params: string[] = line.split(":")[1].trim().split(" ");

  if (testCalibration(params, sumMul)) {
    result += sumMul;
  }
});

console.log(result);

// Part 2

function testCalibrationWithConcat(
  params: string[],
  calibration: number,
): boolean {
  if (params.length == 1) return calibration == parseInt(params[0]);

  let lastParam = parseInt(params[params.length - 1]);

  let calibrationStr = calibration + "";
  let lastParamStr = lastParam.toString();

  // 159 = 1 concat 59  [ lenght - 59.lenght , lenght - 1] [1,2]
  // console.log("===============");
  // console.log(calibration);
  // console.log(params);
  // console.log(lastParam);
  // console.log(params.slice(0, params.length - 1));
  // console.log((calibration - lastParam) / Math.pow(10, lastParamStr.length));
  // console.log("===============");

  return (
    (calibrationStr.substring(
      calibrationStr.length - lastParamStr.length,
      calibrationStr.length,
    ) === lastParamStr &&
      testCalibrationWithConcat(
        params.slice(0, params.length - 1),
        (calibration - lastParam) / Math.pow(10, lastParamStr.length),
      )) ||
    (calibration % lastParam == 0 &&
      testCalibrationWithConcat(
        params.slice(0, params.length - 1),
        calibration / lastParam,
      )) ||
    testCalibrationWithConcat(
      params.slice(0, params.length - 1),
      calibration - lastParam,
    )
  );
}

let result2 = 0;
lines.forEach((line) => {
  //console.log(line);
  line = line.trim();
  let sumMul = parseInt(line.split(":")[0]);
  let params: string[] = line.split(":")[1].trim().split(" ");

  if (testCalibrationWithConcat(params, sumMul)) {
    result2 += sumMul;
  }
});

console.log(result2);
