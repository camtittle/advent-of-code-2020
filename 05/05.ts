import * as fs from 'fs';

const getSeatFromInstructions = (instructions: string, min: number, max: number) => {
  let currentMin = min;
  let currentMax = max;

  for (const letter of instructions) {
    switch (letter) {
      case 'F':
      case 'L':
        currentMax = currentMax - Math.ceil((currentMax - currentMin) / 2);
        break;
      case 'B':
      case 'R':
        currentMin = currentMin + Math.ceil((currentMax - currentMin) / 2);
        break;
      default:
        throw new Error('Unexpected instruction: ' + letter);
    }
  }

  // check
  if (currentMin !== currentMax) {
    throw new Error(`ERROR: min !== max. Current min: ${currentMin}, currentMax: ${currentMax}.`);
  }

  return currentMin;
}

(async () => {
  const fileName = 'input.txt';
  const file: string = await fs.promises.readFile(__dirname + '/' + fileName, 'utf8');
  const lines = file.split('\r\n');

  const maxSeatId = lines.reduce((maxSeatId, line) => {
    const rowInstructions = line.slice(0, 7);
    const colInstructions = line.slice(7, 10);
    const rowNum = getSeatFromInstructions(rowInstructions, 0, 127);
    const colNum = getSeatFromInstructions(colInstructions, 0, 7);
    const seatId = (rowNum * 8) + colNum;

    return seatId > maxSeatId ? seatId : maxSeatId;
  }, 0);

  console.log(`Part 1 Max seat ID: ${maxSeatId}`);

  const seatIds = lines.map(line => {
    const rowInstructions = line.slice(0, 7);
    const colInstructions = line.slice(7, 10);
    const rowNum = getSeatFromInstructions(rowInstructions, 0, 127);
    const colNum = getSeatFromInstructions(colInstructions, 0, 7);
    return (rowNum * 8) + colNum;
  }, 0).sort();

  console.log(seatIds);

  for (let i = 0; i < seatIds.length - 2; i++) {
    const prevSeat = seatIds[i];
    const thisSeat = seatIds[i + 1];
    // look for a gap
    if (thisSeat - 2 === prevSeat) {
      console.log('Part 2: My Seat ID = ' + (prevSeat + 1));
      break;
    }
  }

})();