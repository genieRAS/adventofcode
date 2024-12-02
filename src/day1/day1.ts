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
function gettingDistance(number1: number[], number2: number[]): number {
    const sorted1 = numbers1.sort((a, b) => a - b);
    const sorted2 = numbers2.sort((a, b) => a - b);

    let totalDistance = 0;
    for (var i = 0; i < sorted1.length; i++) {
        totalDistance += sorted1[i] - sorted2[i] > 0 ? sorted1[i] - sorted2[i] : sorted2[i] - sorted1[i];
    }
    return totalDistance;
}

// Getting similarity
function gettingSimilarity(number1: number[], number2: number[]): number {
    // const map1 = new Map<number, number>();
    const map2 = new Map<number, number>();

    for (var i = 0; i < number1.length; i++) {
        // map1.set(number1[i], (map1.get(number1[i]) || 0) + 1);
        map2.set(number2[i], (map2.get(number2[i]) || 0) + 1);
    }

    let similarity = 0;

    number1.forEach(number => {
        console.log(number + " " + number * (map2.get(number) || 0));
        similarity += number * (map2.get(number) || 0);
    })

    return similarity;
}


const [numbers1, numbers2] = readFileIntoArrays(filePath);

console.log(gettingDistance(numbers1, numbers2));

console.log(gettingSimilarity(numbers1, numbers2));
