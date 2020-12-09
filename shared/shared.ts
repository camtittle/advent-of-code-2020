import * as fs from 'fs';

export const getInput = async (directory: string): Promise<string> => {
  const fileName = 'input.txt';
  const file: string = await fs.promises.readFile(directory + '/' + fileName, 'utf8');
  return file;
}

export const getInputLines = async (directory: string): Promise<string[]> => {
  const file = await getInput(directory)
    return file.split('\r\n');
}