import * as fs from 'fs';

class Password {
    rule: {
        letter: string;
        min: number;
        max: number;
    };

    password: string;

    constructor(inputLine: string) {
        const regex = /^(\d+)-(\d+) (.): (\w+)$/;
        const groups = inputLine.match(regex);

        this.password = groups[4];
        this.rule = {
            letter: groups[3],
            min: Number.parseInt(groups[1]),
            max: Number.parseInt(groups[2])
        };
    }

    isValid = (): boolean => {
        // https://stackoverflow.com/questions/2903542/javascript-how-many-times-a-character-occurs-in-a-string
        const regex = new RegExp(this.rule.letter, 'g');
        const matches = this.password.match(regex);
        const count = matches ? matches.length : 0;

        return count >= this.rule.min && count <= this.rule.max;
    }
}

(async () => {
    const fileName = 'input.txt';
    const file: string = await fs.promises.readFile(__dirname + '/' + fileName, 'utf8');
    const lines = file.split('\r\n');

    const passwords: Password[] = lines.map(line => {
        return new Password(line);
    });

    const correctCount = passwords.reduce((count, password) => {
        const valid = password.isValid();
        return valid ? ++count : count;
    }, 0);

    console.log('Correct passwords count: ' + correctCount);
})();