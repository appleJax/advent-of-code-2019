import {
  Counter,
  CounterNum,
  hasDoubleDigit,
  hasSoloDoubleDigit,
  increment,
  numPasswords
} from './secureContainer';

describe('hasDoubleDigit', () => {
  it('should return true if there is a double digit', () => {
    expect(hasDoubleDigit([1, 1])).toBe(true);
    expect(hasDoubleDigit([3, 3, 3, 3])).toBe(true);
    expect(hasDoubleDigit([1, 1, 1, 4, 4, 5])).toBe(true);
  });

  it('should return false if there is NOT a double digit', () => {
    expect(hasDoubleDigit([1])).toBe(false);
    expect(hasDoubleDigit([2, 1, 2])).toBe(false);
    expect(hasDoubleDigit([1, 2, 3, 4, 5])).toBe(false);
  });
});

describe('hasDoubleDigit - not part of larger group', () => {
  it('should return true if there is a double digit', () => {
    expect(hasSoloDoubleDigit([1, 1])).toBe(true);
    expect(hasSoloDoubleDigit([1, 2, 2, 3])).toBe(true);
    expect(hasSoloDoubleDigit([1, 1, 1, 4, 4, 5])).toBe(true);
  });

  it('should return false if there is NOT a double digit', () => {
    expect(hasSoloDoubleDigit([1])).toBe(false);
    expect(hasSoloDoubleDigit([2, 2, 2])).toBe(false);
    expect(hasSoloDoubleDigit([1, 2, 3, 4, 5])).toBe(false);
  });
});

describe('increment', () => {
  it('ensures each number is <= numbers that follow', () => {
    let counterNum: CounterNum = [2, 2, 7];

    increment(counterNum);
    expect(counterNum).toEqual([2, 2, 8]);

    increment(counterNum);
    expect(counterNum).toEqual([2, 2, 9]);

    increment(counterNum);
    expect(counterNum).toEqual([2, 3, 3]);

    counterNum = [7, 9, 9, 9];
    increment(counterNum);
    expect(counterNum).toEqual([8, 8, 8, 8]);

    increment(counterNum);
    expect(counterNum).toEqual([8, 8, 8, 9]);

    increment(counterNum);
    expect(counterNum).toEqual([8, 8, 9, 9]);

    increment(counterNum);
    expect(counterNum).toEqual([8, 9, 9, 9]);

    increment(counterNum);
    expect(counterNum).toEqual([9, 9, 9, 9]);
  });

  it('ensures there is at least one double digit', () => {
    let counterNum: CounterNum = [2, 7, 7];

    increment(counterNum);
    expect(counterNum).toEqual([2, 8, 8]);

    increment(counterNum);
    expect(counterNum).toEqual([2, 9, 9]);

    increment(counterNum);
    expect(counterNum).toEqual([3, 3, 3]);

    increment(counterNum);
    expect(counterNum).toEqual([3, 3, 4]);

    increment(counterNum);
    expect(counterNum).toEqual([3, 3, 5]);
  }); 
});

describe('Counter', () => {
  it('should accept a startingValue', () => {
    const counter = Counter(12);
    expect(counter.next().value).toEqual(12);

    const counter2 = Counter(24);
    expect(counter2.next().value).toEqual(24);
  });

  it('should stop incrementing at the endingValue - happy path', () => {
    const counter = Counter(222, 240);

    let lastValue;

    for (let val of counter) {
      lastValue = val;
    }

    expect(lastValue).toEqual(233);
  });

  it('should stop incrementing at the endingValue - no valid numbers', () => {
    const counter = Counter(12, 20);

    let lastValue;

    for (let val of counter) {
      lastValue = val;
    }

    expect(lastValue).toEqual(12);
  });
});

describe('numPasswords', () => {
  it('should calculate the number of valid passwords in a range', () => {
    expect(numPasswords(222, 240)).toEqual(9);
    expect(numPasswords(2222, 2400)).toEqual(49);
  });

  test('answers', () => {
    expect(numPasswords(155555, 630395)).toEqual(1729);

    const SOLO_DOUBLES = true;
    expect(numPasswords(155566, 630395, SOLO_DOUBLES)).toEqual(1172);
  });
});
