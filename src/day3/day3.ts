import * as fs from 'fs';

// const filePath = 'input-sample.txt';
const filePath = 'input.txt';

function getSumOfMul(filePath: string): number {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    const regex = /mul\((\d+),(\d+)\)/g;
    const matches: string[] = [];

    var sum = 0;
    var currentIndex = 0;
    var isDoing = true;

    lines.forEach(line => {
        let match;
        while ((match = regex.exec(line)) !== null) {
            matches.push(match[0]);
            currentIndex = match.index;

            let substring = line.substring(0, currentIndex);

            let newDontIndex = substring.lastIndexOf("don't()");
            let newDoIndex = substring.lastIndexOf("do()");

            isDoing = (newDontIndex < 0 && isDoing) || (newDoIndex > newDontIndex);

            if (isDoing) {
                let a = (parseInt(match[1]) > 0 && parseInt(match[1]) <= 999) ? parseInt(match[1]) : 0;
                let b = (parseInt(match[2]) > 0 && parseInt(match[2]) <= 999) ? parseInt(match[2]) : 0;
                sum += a * b;
            }
        }
    });

    return sum;
}


console.log(getSumOfMul(filePath));
