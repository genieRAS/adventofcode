import * as fs from 'fs';

// const filePath = 'input-sample.txt'; // 18, 9
const filePath = 'input.txt'; // 2427, 1990

function reverseString(str: string): string {
    return str.split('').reverse().join('');
}

function getNumOfXmasInLine(line: string): number {

    let count = 0;
    let index = 0;
    while ((index = line.indexOf("XMAS", index)) !== -1) {
        count++;
        index++;
    }
    return count;
}

function transposeMatrix(matrix: string[][]): string[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const transposedMatrix: string[][] = [];

    for (let i = 0; i < cols; i++) {
        transposedMatrix[i] = [];
        for (let j = 0; j < rows; j++) {
            transposedMatrix[i][j] = matrix[j][i];
        }
    }

    return transposedMatrix;
}

function getDiagonalLines(matrix: string[][]): string[] {
    let diagonalObtuseMatrix: string[][] = []; // \
    let diagonalAcuteMatrix: string[][] = []; // /

    for (let i = 0; i < matrix.length * 2 + 1; i++) {
        diagonalObtuseMatrix[i] = [];
        diagonalAcuteMatrix[i] = [];
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            diagonalAcuteMatrix[i+j][i] = matrix[i][j];
            if (j >= i) {
                diagonalObtuseMatrix[j-i][i] = matrix[i][j];
            } else {
                diagonalObtuseMatrix[matrix.length - 1+i-j][j] = matrix[i][j];
            }
        }
    }

    let diagonalLines: string[] = [];
    diagonalObtuseMatrix.forEach(line => {
        // console.log(line.join(''));
        diagonalLines.push(line.join(''));
    });

    // console.log("================");

    diagonalAcuteMatrix.forEach(line => {
        // console.log(line.join(''));
        diagonalLines.push(line.join(''));
    });

    return diagonalLines;
}

function getDiagonalReverseLines(matrix: string[][]): string[][] {
    let diagonalLines: string[][] = [];

    for (let i = 0; i < matrix.length * 2 + 1; i++) {
        diagonalLines[i] = [];
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            diagonalLines[i+j][i] = matrix[i][j];
        }
    }

    return diagonalLines;
}

function getNumOfXmas(fileContent: string): number {
    let numOfXmas = 0;

    const lines = fileContent.split('\n');

    let matrixLetter: string[][] = [];

    lines.forEach((line, x) => {
        matrixLetter[x] = [];
        line.split('').forEach((letter, y) => {
            matrixLetter[x][y] = letter;
        })
    });

    // normal line
    lines.forEach(line => {
        numOfXmas += getNumOfXmasInLine(line);
        numOfXmas += getNumOfXmasInLine(reverseString(line));
    });

    let transposeMatrixLetter = transposeMatrix(matrixLetter);
    // vertical line
    for (let i = 0; i < transposeMatrixLetter.length; i++) {
        let verticalLine = transposeMatrixLetter[i].join('');
        numOfXmas += getNumOfXmasInLine(verticalLine);
        numOfXmas += getNumOfXmasInLine(reverseString(verticalLine));
    }


    // diagonal line
    let diagonalLines = getDiagonalLines(matrixLetter);

    diagonalLines.forEach(line => {
        numOfXmas += getNumOfXmasInLine(line);
        numOfXmas += getNumOfXmasInLine(reverseString(line));
    });

    return numOfXmas;
}

const fileContent = fs.readFileSync(filePath, 'utf8');

console.log(getNumOfXmas(fileContent));


// PART 2

function getNumOfCrossMAS(fileContent: string): number {
    let numOfCrossMax = 0;

    const lines = fileContent.split('\n');

    let matrixLetter: string[][] = [];

    lines.forEach((line, x) => {
        matrixLetter[x] = [];
        line.split('').forEach((letter, y) => {
            matrixLetter[x][y] = letter;
        })
    });

    for (let i = 0; i < matrixLetter.length; i++) {
        for (let j = 0; j < matrixLetter[i].length; j++) {
            if (matrixLetter[i][j] === "A") {
                let topLeft = matrixLetter[i-1]?.[j-1] ?? "";
                let bottomLeft = matrixLetter[i-1]?.[j+1] ?? "";
                let topRight = matrixLetter[i+1]?.[j-1] ?? "";
                let bottomRight = matrixLetter[i+1]?.[j+1] ?? "";

                let firstCross = topLeft == "M" && bottomRight == "S" ||  topLeft == "S" && bottomRight == "M";
                let secondCross = topRight == "M" && bottomLeft == "S" ||  topRight == "S" && bottomLeft == "M";

                if (firstCross && secondCross) numOfCrossMax++ ;
            }
        }
    }

    return numOfCrossMax;
}

console.log(getNumOfCrossMAS(fileContent));