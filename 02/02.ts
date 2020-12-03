import * as fs from 'fs';

class Password {
    rule: {
        letter: string;
        num1: number;
        num2: number;
    };

    password: string;

    constructor(inputLine: string) {
        const regex = /^(\d+)-(\d+) (.): (\w+)$/;
        const groups = inputLine.match(regex);

        this.password = groups[4];
        this.rule = {
            letter: groups[3],
            num1: Number.parseInt(groups[1]),
            num2: Number.parseInt(groups[2])
        };
    }

    isValidPart1 = (): boolean => {
        // https://stackoverflow.com/questions/2903542/javascript-how-many-times-a-character-occurs-in-a-string
        const regex = new RegExp(this.rule.letter, 'g');
        const matches = this.password.match(regex);
        const count = matches ? matches.length : 0;

        return count >= this.rule.num1 && count <= this.rule.num2;
    }

    isValidPart2 = (): boolean => {
        const char1 = this.password.charAt(this.rule.num1 - 1) === this.rule.letter;
        const char2 = this.password.charAt(this.rule.num2 - 1) === this.rule.letter;
        return (char1 && !char2) || (!char1 && char2);
    }
}

(async () => {
    const fileName = 'input.txt';
    const file: string = await fs.promises.readFile(__dirname + '/' + fileName, 'utf8');
    const lines = file.split('\r\n');

    const passwords = lines.map((line) => new Password(line));

    const correctCountPart1 = passwords.reduce((count, password) => {
        return password.isValidPart1() ? ++count : count;
    }, 0);
    console.log('Part 1 Correct passwords count: ' + correctCountPart1);

    const correctCountPart2 = passwords.reduce((count, password) => {
        return password.isValidPart2() ? ++count : count;
    }, 0);
    console.log('Part 2 Correct passwords count: ' + correctCountPart2);
})();