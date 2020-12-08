import * as fs from 'fs';

interface BagMap {
  [innerBagName: string]: string[]
}

const buildTree = (file: string) => {
  const lines = file.split('\r\n');
  const map: BagMap = {};

  lines.forEach(line => {
    const [outer, inner] = line.split(' contain ');
    const outerName = outer.replace(' bags', '');

    let innerNames: string[] = [];
    if (!inner.includes('no other bags')) {
      innerNames = inner.split(', ').map(x => {
        const matches = x.match(/(\d+) (.+ .+) bag/);
  
        if (!matches || matches.length < 2) {
          throw new Error(`Unexpected input: ${x}`);
        }
  
        const count = matches[1];
        const name = matches[2];
  
        return name;
      });
    }

    innerNames.forEach(inner => {
      if (map[inner]) {
        map[inner].push(outerName);
      } else {
        map[inner] = [outerName];
      }
    });
  });

  return map;
};

interface BagMap2 {
  [bagName: string]: InnerBag[]
}

interface InnerBag {
  bagName: string;
  count: number;
}

const buildTree2 = (file: string) => {
  const lines = file.split('\r\n');
  const map: BagMap2 = {};

  lines.forEach(line => {
    const [outer, inner] = line.split(' contain ');
    const outerName = outer.replace(' bags', '');

    let innerNames: InnerBag[] = [];
    if (!inner.includes('no other bags')) {
      innerNames = inner.split(', ').map(x => {
        const matches = x.match(/(\d+) (.+ .+) bag/);
  
        if (!matches || matches.length < 2) {
          throw new Error(`Unexpected input: ${x}`);
        }
  
        const count = matches[1];
        const name = matches[2];
  
        return {
          bagName: name,
          count: Number.parseInt(count)
        };
      });
    }

    innerNames.forEach(inner => {
      if (map[outerName]) {
        map[outerName].push(inner);
      } else {
        map[outerName] = [inner];
      }
    });
  });

  return map;
};

(async () => {
  const fileName = 'input.txt';
  const file: string = await fs.promises.readFile(__dirname + '/' + fileName, 'utf8');
  const tree = buildTree(file);

  const getOutermostBags = (bagName: string): string[] => {
    const nextLevelUp = tree[bagName];
    const outermostBags: string[] = [];
    if (nextLevelUp && nextLevelUp.length > 0) {
      nextLevelUp.forEach(x => {
        if (!outermostBags.includes(x)) {
          outermostBags.push(x);
        }
        const theseOutermostBags = getOutermostBags(x);
        theseOutermostBags.forEach(bag => {
          if (!outermostBags.includes(bag)) {
            outermostBags.push(bag);
          }
        });
      });
    } else {
      outermostBags.push(bagName);
    }

    return outermostBags;
  }

  const outermostBags = getOutermostBags('shiny gold');
  const part1Solution = outermostBags.length;
  console.log(`Part 1 solution: ${part1Solution}`);

  const tree2 = buildTree2(file);
  console.log(tree2);

  const getBagCount = (bagName: string): number => {
    console.log(`getBagCount: ${bagName}`);
    const innerBags = tree2[bagName];
    if (!innerBags) {
      return 0;
    }
    return innerBags.reduce((count, bag) => {
      const innerCount = getBagCount(bag.bagName);
      console.log(`bag.bagName.innerCount: ${bag.bagName}: ${innerCount}`);
      return count + bag.count + (bag.count * innerCount);
    }, 0);
  }

  const part2 = getBagCount('shiny gold');
  console.log(`Part 2 solution: ${part2}`);

})();