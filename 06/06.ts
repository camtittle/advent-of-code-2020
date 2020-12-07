import * as fs from 'fs';

(async () => {
  const fileName = 'input.txt';
  const file: string = await fs.promises.readFile(__dirname + '/' + fileName, 'utf8');
  const groups = file.split('\r\n\r\n');

  const groupCounts = groups.map(group => {
    const questions = group.replace(/\r\n/g, '');
    const questionMap: { [q: string]: boolean } = {};
    for (const question of questions) {
      questionMap[question] = true;
    }

    return Object.keys(questionMap).length;
  });

  const part1Sum = groupCounts.reduce((sum, x) => sum + x, 0);
  console.log(`Part 1: ${part1Sum}`);

  const groupCounts2 = groups.map(group => {
    const people = group.split('\r\n');
    const questionMap: { [q: string]: number } = {};

    let firstPerson = true;
    for (const questions of people) {
      for (const question of questions) {
        if (firstPerson) {
          questionMap[question] = 1;
        } else if (questionMap[question]) {
          questionMap[question]++;
        }
      }
      firstPerson = false;
    }

    const questionsEveryoneAnswered = Object.keys(questionMap).filter(x => questionMap[x] === people.length);
    return questionsEveryoneAnswered.length;
  });

  const part2Sum = groupCounts2.reduce((sum, x) => sum + x, 0);
  console.log(`Part 2: ${part2Sum}`);


})();