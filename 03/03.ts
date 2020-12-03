import * as fs from 'fs';

enum Tile {
  Empty,
  Tree
}

class Map {

  private map: Tile[][] = [];
  private width: number;
  private height: number;

  constructor(fileInput: string) {
    const lines = fileInput.split('\r\n');
    this.width = lines[0].length;
    this.height = lines.length;

    for (let x = 0; x < this.width; x++) {
      this.map[x] = [];
      for (let y = 0; y < this.height; y++) {
        const char = lines[y].charAt(x);
        switch (char) {
          case '.': this.map[x][y] = Tile.Empty; break;
          case '#': this.map[x][y] = Tile.Tree; break;
          default: throw new Error(`Unexpected char encountered at ${x},${y}: ${char}`);
        }
      }
    }
  }

  getTreesEncounteredOnSlope(xInterval: number, yInterval: number): number {
    let x = 0;
    let y = 0;
    let treeCount = 0;
    while (y < this.height) {
      if (this.map[x][y] === Tile.Tree) {
        treeCount++;
      }
      y += yInterval;
      x = (x + xInterval) % this.width;
    }

    return treeCount;
  }

}

(async () => {
  const fileName = 'input.txt';
  const file: string = await fs.promises.readFile(__dirname + '/' + fileName, 'utf8');

  const map = new Map(file);

  const part1 = map.getTreesEncounteredOnSlope(3, 1);
  console.log('Part 1 tree count: ' + part1);

  const slopes = [
    { x: 1, y: 1},
    { x: 3, y: 1},
    { x: 5, y: 1},
    { x: 7, y: 1},
    { x: 1, y: 2},
  ];

  const part2Result = slopes.reduce((acc, slope) => {
    return acc * map.getTreesEncounteredOnSlope(slope.x, slope.y);
  }, 1);

  console.log('Part 2 tree count: ' + part2Result);


})();