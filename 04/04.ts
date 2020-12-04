import * as fs from 'fs';

const byr = /byr:(\d+)/;
const iyr = /iyr:(\d+)/;
const eyr = /eyr:(\d+)/;
const hgt = /hgt:(\d+)(in|cm)/;
const hcl = /hcl:#([0-9]|[a-f]){6}( |$)/;
const ecl = /ecl:(amb|blu|brn|gry|grn|hzl|oth)( |$)/;
const pid = /pid:(\d{9})( |$)/;

const validateByr = (line: string): boolean => {
  const matches = line.match(byr);
  if (!matches || matches.length < 2) {
    return false;
  }

  const year = Number.parseInt(matches[1]);
  return year >= 1920 && year <= 2002;
};

const validateIyr = (line: string): boolean => {
  const matches = line.match(iyr);
  if (!matches || matches.length < 2) {
    return false;
  }

  const year = Number.parseInt(matches[1]);
  return year >= 2010 && year <= 2020;
};

const validateEyr = (line: string): boolean => {
  const matches = line.match(eyr);
  if (!matches || matches.length < 2) {
    return false;
  }

  const year = Number.parseInt(matches[1]);
  return year >= 2020 && year <= 2030;
};

const validateHgt = (line: string): boolean => {
  const matches = line.match(hgt);
  if (!matches || matches.length < 3) {
    return false;
  }

  const height = Number.parseInt(matches[1]);
  const unit = matches[2];
  switch (unit) {
    case 'in': return height >= 59 && height <= 76;
    case 'cm': return height >= 150 && height <= 193;
  }

  return false;
};

const validateHcl = (line: string): boolean => {
  const matches = line.match(hcl);
  return !!matches;
};

const validateEcl = (line: string): boolean => {
  const matches = line.match(ecl);
  return !!matches;
};

const validatePid = (line: string): boolean => {
  const matches = line.match(pid);
  return !!matches;
};

(async () => {
  const fileName = 'input.txt';
  const file: string = await fs.promises.readFile(__dirname + '/' + fileName, 'utf8');

  // Part 1
  const passports = file.split('\r\n\r\n').map(x => x.replace(/\r\n/g, ' '));
  const regexes = [/byr:.+/, /iyr:.+/, /eyr:.+/, /hgt:.+/, /hcl:.+/, /ecl:.+/, /pid:.+/];

  const validCount = passports.reduce((acc, passport) => {
    const valid = regexes.reduce((isValid, regex) => {
      if (isValid && !passport.match(regex)) {
        return false;
      } else {
        return isValid;
      }
    }, true)

    return valid ? ++acc : acc;
  }, 0);

  console.log('Part 1 Valid passports: ' + validCount);

  // Part 2
  const validCount2 = passports.reduce((acc, p) => {
    const valid = validateByr(p) && validateIyr(p) && validateEyr(p) && validateHgt(p) && validateHcl(p) && validateEcl(p) && validatePid(p);
    return valid ? ++acc : acc;
  }, 0);

  console.log('Part 2 valid: ' + validCount2);

})();