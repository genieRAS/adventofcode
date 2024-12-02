import * as fs from 'fs';

// const filePath = 'input-sample.txt';
const filePath = 'input.txt';

function readFileIntoArrays(filePath: string): [number[], number[]] {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    const array1: number[] = [];
    const array2: number[] = [];

    lines.forEach(line => {
        const [num1, num2] = line.trim().split('   ').map(Number);
        array1.push(num1);
        array2.push(num2);
    });

    return [array1, array2];
}

// Getting distance
function gettingDistance(numbers1: number[], numbers2: number[]): number {
    numbers1.sort((a, b) => a - b);
    numbers2.sort((a, b) => a - b);

    if (numbers1.length !== numbers2.length) {  // Add length check
        throw new Error("Arrays must have the same length for distance calculation.");
    }

    return numbers1.reduce((total, num1, i) => total + Math.abs(num1 - numbers2[i]), 0);
}

// Getting similarity
function gettingSimilarity(numbers1: number[], numbers2: number[]): number {
    const num2Counts = new Map<number, number>();
    numbers2.forEach(num => num2Counts.set(num, (num2Counts.get(num) || 0) + 1));

    return numbers1.reduce((similarity, num1) => similarity + num1 * (num2Counts.get(num1) || 0), 0);
}


const [numbers1, numbers2] = readFileIntoArrays(filePath);

console.log(gettingDistance(numbers1, numbers2));

console.log(gettingSimilarity(numbers1, numbers2));
