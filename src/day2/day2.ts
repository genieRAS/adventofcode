import * as fs from 'fs';

// const filePath = 'input-sample.txt';
const filePath = 'input.txt';

function isSaveReport(levels: number[]): boolean {
    let subLevels = [];

    for (let i = 0; i < levels.length - 1; i++) {
        subLevels.push(levels[i+1] - levels[i]);
    }
    let isSafe = subLevels.every(num => num <= 3 && num >= 1)
        || subLevels.every(num => num >= -3 && num <= -1);

    return isSafe
}

function getNumOfSafeReport(filePath: string): number {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    let numOfSafeReported = 0;
    lines.forEach(line => {
        if (line == null || line.trim() == '') return;

        const levels = line.trim().split(' ').map(Number);
        let isSafe = isSaveReport(levels);
        numOfSafeReported += isSafe ? 1 : 0;
    });

    return numOfSafeReported;
}

function getNumOfDampenerSafeReport(filePath: string): number {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    let numOfSafeReported = 0;

    lines.forEach(line => {
        if (line == null || line.trim() == '') return;

        const levels = line.trim().split(' ').map(Number);

        for (let idx = 0; idx < levels.length; idx++) {
            let testLevels = [...levels.slice(0, idx), ...levels.slice(idx + 1, levels.length)];
            let isSafe = isSaveReport(testLevels);
            if (isSafe) {
                numOfSafeReported++;
                break;
            }
        }
    });

    return numOfSafeReported;
}


console.log(getNumOfSafeReport(filePath));
console.log(getNumOfDampenerSafeReport(filePath));
