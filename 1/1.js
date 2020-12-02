const fs = require('fs');

const part1 = (numbers) => {
    // brute force: try each number with every other number (On^2)
    for (const num1 of numbers) {
        for (const num2 of numbers) {
            if (num1 + num2 === 2020) {
                return num1 * num2;
            }
        }
    }
}

const part2 = (numbers) => {
    // brute force: try each number with every other pair of numbers (On^3)
    for (const num1 of numbers) {
        for (const num2 of numbers) {
            for (const num3 of numbers) {
                if (num1 + num2 + num3 === 2020) {
                    return num1 * num2 * num3;
                }
            }
        }
    }
}

(async () => {
    const fileName = './input.txt';
    const file = await fs.promises.readFile(fileName, 'utf8');
    const numbers = file.split('\r\n').map(str => Number.parseInt(str));

    const part1Result = part1(numbers);
    console.log(`Part 1 result: ${part1Result}`);

    const part2Result = part2(numbers);
    console.log(`Part 2 result: ${part2Result}`);
})();
