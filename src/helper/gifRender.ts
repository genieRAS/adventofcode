import fs from "fs";
import GIFEncoder from "gifencoder";
import { Canvas, createCanvas } from "canvas";
import { promisify } from "node:util";
import { pipeline, Transform } from "node:stream";
const pngFileStream = require("png-file-stream");

let encoder = new GIFEncoder(320, 320);

const textSize = 10;
const padding = 10;

function halfWidthToFullWidth(str: string): string {
  return str.replace(
    /[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~]/g,
    (char) => {
      return String.fromCharCode(char.charCodeAt(0) + 0xfee0);
    },
  );
}

export function renderGifFromFiles(matrix: string[][], fileLocation: string) {
  encoder = new GIFEncoder(
    matrix[0].length * textSize + padding * 2,
    matrix.length * textSize * 1.5 + padding * 2,
  );
  const stream = pngFileStream(fileLocation + "/images/frame*.png")
    .pipe(encoder.createWriteStream({ repeat: -1, delay: 200, quality: 10 }))
    .pipe(fs.createWriteStream(fileLocation + "/myanimated.gif"));

  stream.on("finish", function () {
    console.log("Finished All");
  });
}

export function matrixToPngCanvas(matrix: string[][]): Canvas {
  const [width, height] = [
    matrix[0].length * textSize + padding * 2,
    matrix.length * textSize * 1.5 + padding * 2,
  ];
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d")!;

  const imageData = ctx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4; // 4 for RGBA
      const value = 255; //data[y][x]; // Assuming values are in the range [0, 255]

      // Map value to RGB (simple grayscale example)
      imageData.data[index] = value; // Red
      imageData.data[index + 1] = value; // Green
      imageData.data[index + 2] = value; // Blue
      imageData.data[index + 3] = 255; // Alpha (fully opaque)
    }
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.font = "bold 10px"; // textSize + "px";

  ctx.fillText(
    halfWidthToFullWidth(matrix.flatMap((m) => m.join("")).join("\n")),
    padding,
    padding,
  );

  return canvas;
}

export async function renderMatrixPng(
  matrix: string[][],
  updateCount: number,
  fileLocation: string,
) {
  if (!fs.existsSync(fileLocation + "/images")) {
    fs.mkdirSync(fileLocation + "/images");
  }

  const pngStream = matrixToPngCanvas(matrix).createPNGStream();
  let destinationStream = fs.createWriteStream(
    fileLocation + `/images/frame${updateCount}.png`,
  );
  destinationStream.on("finish", function () {
    console.log("Done" + updateCount);
  });
  await promisify(pipeline)(pngStream, destinationStream);
}

export function renderGifWithImages(
  matrix: string[][],
  pngCanvases: Canvas[],
  fileLocation: string,
) {
  encoder = new GIFEncoder(
    matrix[0].length * textSize + padding * 2,
    matrix.length * textSize * 1.5 + padding * 2,
  );

  encoder
    .createReadStream()
    .pipe(fs.createWriteStream(fileLocation + "/myanimated.gif"));

  encoder.setRepeat(-1); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(200); // frame delay in ms
  encoder.setQuality(10); // image quality. 10 is default.

  encoder.start();

  pngCanvases.forEach((pngStream) => {
    // @ts-ignore
    encoder.addFrame(pngStream.getContext("2d"));
  });

  encoder.finish();
}
