export type CounterNum = number[];

export function hasDoubleDigit(digits: CounterNum): boolean {
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] === digits[i + 1]) {
      return true;
    }
  }
  return false;
}

export function hasSoloDoubleDigit(digits: CounterNum): boolean {
  const groupSizes = new Set();
  let prev = digits[0];
  let currentSize = 1;

  for (let i = 1; i < digits.length; i++) {
    if (digits[i] !== prev) {
      groupSizes.add(currentSize);
      currentSize = 0;
      prev = digits[i];
    }
    currentSize++;
  }

  groupSizes.add(currentSize);
  return groupSizes.has(2);
}

export function increment(
  digits: CounterNum,
  lastIndex: number = digits.length - 1,
  soloDoubles: boolean = false
) {
  const doubleDigit = soloDoubles
    ? hasSoloDoubleDigit
    : hasDoubleDigit;
  let i = lastIndex;
  let carry = false;

  do {
    digits[i]++;
    if (digits[i] > 9) {
      carry = true;
      i--;
    } else {
      carry = false;
    }
  } while (carry && i >= 0)

  while (i < lastIndex) {
    digits[i + 1] = digits[i];
    i++;
  }

  if (!doubleDigit(digits)) {
    increment(digits, lastIndex, soloDoubles);
  }
}

export function *Counter(
  startingValue: number,
  endingValue: number = Infinity,
  soloDoubles: boolean = false
) {
  let currentValue: number[] = String(startingValue).split('').map(Number);
  const getCurrentValue = () => Number(currentValue.join(''));
  const lastIndex = currentValue.length - 1;

  while (getCurrentValue() <= endingValue) {
    yield getCurrentValue();
    increment(currentValue, lastIndex, soloDoubles);
  }
}

export function numPasswords(
  startingValue: number,
  endingValue: number,
  soloDoubles: boolean = false
): number {
  const counter = Counter(startingValue, endingValue, soloDoubles);
  let numValidPasswords = 0;

  for (let pw of counter) {
    numValidPasswords++;
  }

  return numValidPasswords;
}
