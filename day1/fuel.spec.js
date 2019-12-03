import {
  calculateFuelForModule,
  calculateFuelForAllModules,
  calculateTotalFuelForModule,
  calculateTotalFuelForAllModules,
  firstAnswer,
  secondAnswer
} from './fuel';

describe('calculateFuelForModule', () => {
  it('should calculate the amount of fuel needed for a given module', () => {
    expect(calculateFuelForModule(300)).toEqual(98);
    expect(calculateFuelForModule(20)).toEqual(4);
    expect(calculateFuelForModule(9)).toEqual(1);
    expect(calculateFuelForModule(0)).toEqual(0);
    expect(calculateFuelForModule(-10)).toEqual(0);
  });
});

describe('calculateFuelForAllModules', () => {
  it('should calculate the amount of fuel needed for an array of modules', () => {
    expect(calculateFuelForAllModules([300, 20, 9, 0, -10])).toEqual(103);
    expect(calculateFuelForAllModules([20])).toEqual(4);
    expect(calculateFuelForAllModules([-300, -20, -9, 0, -10])).toEqual(0);
    expect(calculateFuelForAllModules([])).toEqual(0);
  });
});

describe('calculateTotalFuelForModule', () => {
  it('should calculate the total amount of fuel needed for a module plus the fuel itself', () => {
    expect(calculateTotalFuelForModule(14)).toEqual(2);
    expect(calculateTotalFuelForModule(1969)).toEqual(966);
    expect(calculateTotalFuelForModule(100756)).toEqual(50346);
    expect(calculateTotalFuelForModule(-300)).toEqual(0);
  });
});

describe('calculateTotalFuelForAllModules', () => {
  it('should calculate the total amount of fuel needed for all modules plus the fuel itself', () => {
    expect(calculateTotalFuelForAllModules([14])).toEqual(2);
    expect(calculateTotalFuelForAllModules([1969])).toEqual(966);
    expect(calculateTotalFuelForAllModules([100756])).toEqual(50346);
    expect(calculateTotalFuelForAllModules(Array(1000).fill(100).concat(700, 50, 6))).toEqual(39350);
    expect(calculateTotalFuelForAllModules([300, 20, 9, 0, 10])).toEqual(142);
    expect(calculateTotalFuelForAllModules([-300, -20, -9, 0, -10])).toEqual(0);
    expect(calculateTotalFuelForAllModules([])).toEqual(0);
  });
});

test('answers', () => {
  expect(firstAnswer).toEqual(3254441);
  expect(secondAnswer).toEqual(4878818);
});
