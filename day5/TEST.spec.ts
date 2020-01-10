import {
  add,
  mult,
  save,
  print,
  jne,
  jeq,
  lt,
  eq,
  end,
  answer1,
  answer2,
  parseInstruction,
  evaluate,
  State
} from './TEST';

const newMockState = (customState = {}): State => ({
  input: [],
  inputIndex: 0,
  tape: [1, 2, 3, -1],
  tapeIndex: 0,
  output: [],
  ...customState
});

describe('parseInstruction', () => {
  test('add (position mode)', () => {
    const mockState = newMockState({
      tape: [2, 2, 1, 0]
    });
    expect(parseInstruction(mockState)).toEqual({
      opcode: 2,
      arg1: 1,
      arg2: 2,
      writeIndex: 0
    });
  });

  test('add (immediate mode)', () => {
    const mockState = newMockState({
      tape: [1102, 2, 1, 0]
    });
    expect(parseInstruction(mockState)).toEqual({
      opcode: 2,
      arg1: 2,
      arg2: 1,
      writeIndex: 0
    });
  });

  test('mult (mixed mode)', () => {
    const mockState = newMockState({
      tape: [102, 2, 1, 0]
    });
    expect(parseInstruction(mockState)).toEqual({
      opcode: 2,
      arg1: 2,
      arg2: 2,
      writeIndex: 0
    });
  });

  test('exit program', () => {
    const mockState = newMockState({
      tape: [99]
    });
    expect(parseInstruction(mockState)).toEqual({
      opcode: 9,
      arg1: undefined,
      arg2: undefined,
      writeIndex: undefined
    });
  });
});

describe('end', () => {
  it(`should set the tapeIndex to state.tape.length`, () => {
    const mockState = newMockState();
    expect(mockState.tapeIndex).toEqual(0);
    expect(mockState.tape.length).toEqual(4);
    const newState = end(mockState, { opcode: 9 });

    expect(newState.tapeIndex).toEqual(newState.tape.length);
  });
});

describe('add', () => {
  test(`position mode`, () => {
    const mockState = newMockState({
      tape: [1, 0, 2, 1]
    });
    const newState = add(mockState, {
      opcode: 1,
      arg1: 1,
      arg2: 2,
      writeIndex: 1
    });

    expect(newState.tapeIndex).toEqual(newState.tape.length);
    expect(newState.tape).toEqual([ 1, 3, 2, 1 ]);
  });

  test(`immediate mode`, () => {
    const mockState = newMockState({
      tape: [1101, 0, 2, 1]
    });
    const newState = add(mockState, {
      opcode: 1,
      arg1: 0,
      arg2: 2,
      writeIndex: 1
    });

    expect(newState.tapeIndex).toEqual(newState.tape.length);
    expect(newState.tape).toEqual([ 1101, 2, 2, 1 ]);
  });
});

describe('mult', () => {
  test(`position mode`, () => {
    const mockState = newMockState({
      tape: [2, 0, 2, 1]
    });
    const newState = mult(mockState, {
      opcode: 1,
      arg1: 2,
      arg2: 2,
      writeIndex: 1
    });

    expect(newState.tapeIndex).toEqual(newState.tape.length);
    expect(newState.tape).toEqual([ 2, 4, 2, 1 ]);
  });

  test(`immediate mode`, () => {
    const mockState = newMockState({
      tape: [1102, 3, 2, 1]
    });
    const newState = mult(mockState, {
      opcode: 1,
      arg1: 3,
      arg2: 2,
      writeIndex: 1
    });

    expect(newState.tapeIndex).toEqual(newState.tape.length);
    expect(newState.tape).toEqual([ 1102, 6, 2, 1 ]);
  });
});

describe('save', () => {
  it(`should save the input to a given position on the tape`, () => {
    const mockState = newMockState({
      input: [ 4, 7 ],
      inputIndex: 1,
      tape: [ 3, 0, 2, 1, 3, 3 ],
      tapeIndex: 0
    });
    const newState = save(mockState, {
      opcode: 3,
      arg1: 0
    });

    expect(newState.tapeIndex).toEqual(2);
    expect(newState.tape).toEqual([7, 0, 2, 1, 3, 3]);
  });
});

describe('print', () => {
  it(`should save the given position on tape to the output array`, () => {
    const mockTape = [ 4, 3, 2, 1, 3, 3 ];
    const mockState = newMockState({
      tape: mockTape,
      tapeIndex: 0,
      output: []
    });
    const newState = print(mockState, {
      opcode: 4,
      arg1: 1
    });

    expect(newState.tapeIndex).toEqual(2);
    expect(newState.tape).toEqual(mockTape);
    expect(newState.output).toEqual([1]);
  });
});

describe('jne', () => {
  test(`JUMP - position mode`, () => {
    const mockTape = [5, 3, 12, 6]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = jne(mockState, {
      opcode: 5,
      arg1: 9,
      arg2: 12
    });

    expect(newState.tapeIndex).toEqual(12);
    expect(newState.tape).toEqual(mockTape);
  });

  test(`JUMP - immediate mode`, () => {
    const mockTape = [105, 1, 9, 6]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = jne(mockState, {
      opcode: 5,
      arg1: 1,
      arg2: 9
    });

    expect(newState.tapeIndex).toEqual(9);
    expect(newState.tape).toEqual(mockTape);
  });

  test(`NO JUMP - position mode`, () => {
    const mockTape = [5, 2, 0, 9]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = jne(mockState, {
      opcode: 5,
      arg1: 0,
      arg2: 0
    });

    expect(newState.tapeIndex).toEqual(3);
    expect(newState.tape).toEqual(mockTape);
  });

  test(`NO JUMP - immediate mode`, () => {
    const mockTape = [105, 0, 6, 9]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = jne(mockState, {
      opcode: 5,
      arg1: 0,
      arg2: 6
    });

    expect(newState.tapeIndex).toEqual(3);
    expect(newState.tape).toEqual(mockTape);
  });
});

describe('jeq', () => {
  test(`JUMP - position mode`, () => {
    const mockTape = [6, 3, 12, 0]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = jeq(mockState, {
      opcode: 6,
      arg1: 0,
      arg2: 12
    });

    expect(newState.tapeIndex).toEqual(12);
    expect(newState.tape).toEqual(mockTape);
  });

  test(`JUMP - immediate mode`, () => {
    const mockTape = [106, 0, 9, 6]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = jeq(mockState, {
      opcode: 6,
      arg1: 0,
      arg2: 9
    });

    expect(newState.tapeIndex).toEqual(9);
    expect(newState.tape).toEqual(mockTape);
  });

  test(`NO JUMP - position mode`, () => {
    const mockTape = [6, 2, 1, 9]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = jeq(mockState, {
      opcode: 6,
      arg1: 1,
      arg2: 1
    });

    expect(newState.tapeIndex).toEqual(3);
    expect(newState.tape).toEqual(mockTape);
  });

  test(`NO JUMP - immediate mode`, () => {
    const mockTape = [106, 1, 6, 9]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = jeq(mockState, {
      opcode: 6,
      arg1: 1,
      arg2: 6
    });

    expect(newState.tapeIndex).toEqual(3);
    expect(newState.tape).toEqual(mockTape);
  });
});

describe('lt', () => {
  test(`write 1 in writeIndex - position mode`, () => {
    const mockTape = [7, 3, 2, 0]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = lt(mockState, {
      opcode: 7,
      arg1: 0,
      arg2: 2,
      writeIndex: 0
    });

    expect(newState.tapeIndex).toEqual(4);
    expect(newState.tape).toEqual([1, 3, 2, 0]);
  });

  test(`write 1 in writeIndex - immediate mode`, () => {
    const mockTape = [1107, 0, 9, 1]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = lt(mockState, {
      opcode: 7,
      arg1: 0,
      arg2: 9,
      writeIndex: 1
    });

    expect(newState.tapeIndex).toEqual(4);
    expect(newState.tape).toEqual([1107, 1, 9, 1]);
  });

  test(`write 0 in writeIndex - position mode`, () => {
    const mockTape = [7, 0, 1, 3]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = lt(mockState, {
      opcode: 7,
      arg1: 7,
      arg2: 0,
      writeIndex: 3
    });

    expect(newState.tapeIndex).toEqual(4);
    expect(newState.tape).toEqual([7, 0, 1, 0]);
  });

  test(`write 0 in writeIndex - immediate mode`, () => {
    const mockTape = [1107, 6, 1, 3]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = lt(mockState, {
      opcode: 7,
      arg1: 6,
      arg2: 1,
      writeIndex: 3
    });

    expect(newState.tapeIndex).toEqual(4);
    expect(newState.tape).toEqual([1107, 6, 1, 0]);
  });
});

describe('eq', () => {
  test(`write 1 in writeIndex - position mode`, () => {
    const mockTape = [8, 2, 3, 3]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = eq(mockState, {
      opcode: 8,
      arg1: 3,
      arg2: 3,
      writeIndex: 3
    });

    expect(newState.tapeIndex).toEqual(4);
    expect(newState.tape).toEqual([8, 2, 3, 1]);
  });

  test(`write 1 in writeIndex - immediate mode`, () => {
    const mockTape = [1108, 0, 0, 1]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = eq(mockState, {
      opcode: 1,
      arg1: 0,
      arg2: 0,
      writeIndex: 1
    });

    expect(newState.tapeIndex).toEqual(4);
    expect(newState.tape).toEqual([1108, 1, 0, 1]);
  });

  test(`write 0 in writeIndex - position mode`, () => {
    const mockTape = [8, 0, 1, 3]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = eq(mockState, {
      opcode: 8,
      arg1: 8,
      arg2: 0,
      writeIndex: 3
    });

    expect(newState.tapeIndex).toEqual(4);
    expect(newState.tape).toEqual([8, 0, 1, 0]);
  });

  test(`write 0 in writeIndex - immediate mode`, () => {
    const mockTape = [1108, 6, 1, 3]; 
    const mockState = newMockState({
      tape: mockTape
    });
    const newState = lt(mockState, {
      opcode: 8,
      arg1: 6,
      arg2: 1,
      writeIndex: 3
    });

    expect(newState.tapeIndex).toEqual(4);
    expect(newState.tape).toEqual([1108, 6, 1, 0]);
  });
});

describe('evaluate program', () => {
  it('should return the correct output - 0', () => {
    const program = [3,3,1105,-1,9,1101,0,0,12,4,12,99,1];
    const result = evaluate(program, [0]);
    expect(result).toEqual([0]);
  });

  it('should return the correct output - 1', () => {
    const program = [3,3,1105,-1,9,1101,0,0,12,4,12,99,1];
    const result = evaluate(program, [32]);
    expect(result).toEqual([1]);
  });
});

describe('answers', () => {
  test('should give the correct answers', () => {
    expect(answer1).toEqual([0,0,0,0,0,0,0,0,0,13346482]);
    expect(answer2).toEqual([12111395]);
  });
});
