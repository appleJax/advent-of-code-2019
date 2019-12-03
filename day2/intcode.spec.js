import {
  answer1,
  calculateAnswer2,
  evaluate
} from './intcode';

describe('evaluate', () => {
  it('should add 2 numbers when opcode = 1', () => {
    expect(evaluate([1, 1, 1, 3])).toEqual([1, 1, 1, 2]);
    expect(evaluate([1, 2, 3, 2])).toEqual([1, 2, 5, 2]);
    expect(evaluate([1, 1, 0, 4, 3, 6, 5, 0])).toEqual([30, 1, 0, 4, 2, 6, 5, 0]);
  });

  it('should multiply 2 numbers when opcode = 2', () => {
    expect(evaluate([2, 1, 1, 3])).toEqual([2, 1, 1, 1]);
    expect(evaluate([2, 2, 3, 0])).toEqual([0, 2, 3, 0]);
    expect(evaluate([2, 2, 1, 4])).toEqual([2, 2, 1, 4, 2]);
    expect(evaluate([2, 2, 1, 4, 3, 6, 3, 1])).toEqual([2, 12, 1, 4, 2, 6, 3, 1]);
  });

  it('should end when opcode = 99', () => {
    expect(evaluate([99, 1, 1, 3])).toEqual([99, 1, 1, 3]);
    expect(evaluate([99])).toEqual([99]);
    expect(evaluate([2, 5, 6, 4, 2, 33, 3, 1])).toEqual([2, 5, 6, 4, 99, 33, 3, 1]);
  });

  it('should throw error when opcode not in [1, 2, 99]', () => {
    expect(() => evaluate([0])).toThrow(/invalid/i);
    expect(() => evaluate([3])).toThrow(/invalid/i);
    expect(() => evaluate([98])).toThrow(/invalid/i);
    expect(() => evaluate([100])).toThrow(/invalid/i);
    expect(() => evaluate([2, 3, 2, 4])).toThrow(/invalid/i);
  });

  it('should evaluate a program', () => {
    expect(evaluate([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]))
      .toEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
  });
})

test('answer1', () => {
  expect(answer1).toEqual(3654868);
})

test('calculate 2nd answer', () => {
  expect(calculateAnswer2()).toEqual(7014);
});
