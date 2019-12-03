import * as fs from 'fs';
import * as path from 'path';

const spaceModules: number[] = fs.readFileSync(
  path.resolve(__dirname, 'fuel.txt'), 'utf8'
).split('\n').map(Number);

export function calculateFuelForModule(moduleMass: number): number {
  return Math.max(
    0,
    Math.floor(
      (moduleMass / 3) - 2
    )
  );
}

export function calculateFuelForAllModules(allModules: number[]): number {
  return allModules.reduce((totalFuel, module) =>
    totalFuel + calculateFuelForModule(module)
  , 0);
}

export function calculateTotalFuelForModule(moduleMass: number): number {
  let totalFuel = calculateFuelForModule(moduleMass);

  let fuelsFuel = calculateFuelForModule(totalFuel);
  while (fuelsFuel > 0) {
    totalFuel += fuelsFuel;
    fuelsFuel = calculateFuelForModule(fuelsFuel);
  }

  return totalFuel;
}

export function calculateTotalFuelForAllModules(allModules: number[]): number {
  return allModules.reduce((totalFuel, module) =>
    totalFuel + calculateTotalFuelForModule(module)
  , 0);
}

export const firstAnswer = calculateFuelForAllModules(spaceModules);
export const secondAnswer = calculateTotalFuelForAllModules(spaceModules);
