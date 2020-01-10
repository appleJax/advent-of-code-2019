import * as fs from 'fs';
import * as path from 'path';

const program: number[] = fs.readFileSync(
  path.resolve(__dirname, 'input.txt'), 'utf8'
).split(',').map(Number);

type OpCode = {
  opcode: number;
  mode1: number;
  mode2: number;
};

export type Instruction = {
  opcode: number;
  arg1?: number;
  arg2?: number;
  writeIndex?: number;
};

export type State = {
  input: number[];
  inputIndex: number;
  tape: number[];
  tapeIndex: number;
  output: number[];
}

export function parseInstruction(state: State): Instruction {
  const { opcode, mode1, mode2 } : OpCode = tokenizeInstruction(state.tape[state.tapeIndex]); 

  let [arg1, arg2, writeIndex] = state.tape.slice(state.tapeIndex + 1, state.tapeIndex + 4);

  if (opcode !== 3 && !mode1) {
    arg1 = state.tape[arg1];
  }

  if (!mode2) {
    arg2 = state.tape[arg2];
  }

  return {
    opcode,
    arg1,
    arg2,
    writeIndex
  };
}

function tokenizeInstruction(instruction: number): OpCode {
  const [
    opcode,
    _,
    mode1 = 0,
    mode2 = 0
  ] = String(instruction).split('').map(Number).reverse();

  return {
    opcode,
    mode1,
    mode2
  };
}

export function add(state: State, instruction: Instruction): State {
  const { arg1, arg2, writeIndex } = instruction;
  state.tape[writeIndex] = arg1 + arg2;
  state.tapeIndex += 4;

  return state;
}

export function mult(state: State, instruction: Instruction): State {
  const { arg1, arg2, writeIndex } = instruction;
  state.tape[writeIndex] = arg1 * arg2;
  state.tapeIndex += 4;

  return state;
}

export function save(state: State, instruction: Instruction): State {
  const { arg1 } = instruction;
  state.tape[arg1] = state.input[state.inputIndex];
  state.inputIndex++
  state.tapeIndex += 2;

  return state;
}

export function print(state: State, instruction: Instruction): State {
  const { arg1 } = instruction;
  state.output.push(arg1);
  state.tapeIndex += 2;

  return state;
}

export function jne(state: State, instruction: Instruction): State {
  const { arg1, arg2 } = instruction;
  state.tapeIndex = (arg1 !== 0)
    ? arg2
    : state.tapeIndex + 3;

  return state;
}

export function jeq(state: State, instruction: Instruction): State {
  const { arg1, arg2 } = instruction;
  state.tapeIndex = (arg1 === 0)
    ? arg2
    : state.tapeIndex + 3;

  return state;
}

export function lt(state: State, instruction: Instruction): State {
  const { arg1, arg2, writeIndex } = instruction;
  state.tape[writeIndex] = Number(arg1 < arg2);
  state.tapeIndex += 4

  return state;
}

export function eq(state: State, instruction: Instruction): State {
  const { arg1, arg2, writeIndex } = instruction;
  state.tape[writeIndex] = Number(arg1 === arg2);
  state.tapeIndex += 4

  return state;
}

export function end(state: State, instruction: Instruction): State {
  state.tapeIndex = state.tape.length;
  return state;
}

const EVAL = {
  1: add,
  2: mult,
  3: save,
  4: print,
  5: jne,
  6: jeq,
  7: lt,
  8: eq,
  9: end
};

export function evaluate(
  tape: number[],
  input: number[] = [],
  output: number[] = []
): number[] {
  let state : State = {
    input,
    inputIndex: 0,
    tape,
    tapeIndex: 0,
    output
  }

  while (state.tapeIndex < state.tape.length) {
    const instruction: Instruction = parseInstruction(state);
    const { opcode } = instruction;

    if (![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(opcode)) {
      throw new Error(`Invalid opcode: ${opcode} - please double check your program`);
    }

    state = EVAL[opcode](state, instruction);
  }

  return state.output;
}

export const answer1 = evaluate([ ...program ], [1]);

export const answer2 = evaluate([ ...program ], [5]);
