import * as fs from 'fs';
import * as path from 'path';

const program: number[] = fs.readFileSync(
  path.resolve(__dirname, 'intcode_program.txt'), 'utf8'
).split(',').map(Number);

export function evaluate(arr: number[]): number[] {
  for (let i = 0; i < arr.length; i += 4) {
    const [ opcode, aIndex, bIndex, newIndex ] = arr.slice(i, i + 4);

    if (![1, 2, 99].includes(opcode)) {
      throw new Error(`Invalid opcode: ${opcode} - please double check your program`);
    }
    else if (aIndex === undefined || bIndex === undefined) {
      return arr;
    }
    else if (opcode === 1) {
      arr[newIndex] = arr[aIndex] + arr[bIndex];
    }
    else if (opcode === 2) {
      arr[newIndex] = arr[aIndex] * arr[bIndex];
    }
    else { // opcode === 99
      return arr;
    }
  }

  return arr;
}

export const answer1: number = evaluate(program.slice())[0];

function tryRandomNumbers(x: number, y: number): number[] {
  return evaluate([
    program[0],
    x, y,
    ...program.slice(3)
  ]);
}

export function calculateAnswer2(): number {
  let result: number;
  let noun: number;
  let verb: number;

  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      try {
        [ result, noun, verb ] = tryRandomNumbers(i, j);
      } catch {
        continue;
      }

      if (result === 19690720) {
        return (noun * 100) + verb;
      }
    }
  }

  return -1;
}
