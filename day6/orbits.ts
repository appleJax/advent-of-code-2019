import fs from 'fs';
import path from 'path';

export type OrbitalBody = {
  key: string;
  distance: number;
  visited: boolean;
  parent: OrbitalBody | null;
  getSatellites: () => OrbitalBody[];
  addSatellite: (newSatellite: OrbitalBody) => void;
  countOrbits: () => number;
}

export function Body(key): OrbitalBody {
  const satellites: OrbitalBody[] = [];
  return {
    key,
    distance: Infinity,
    visited: false,
    parent: null,
    getSatellites: (): OrbitalBody[] => satellites,
    addSatellite: (newSatellite: OrbitalBody): void => {
      satellites.push(newSatellite);
    },
    countOrbits: (): number =>
        satellites.reduce((subtotal, sat) =>
          subtotal + sat.countOrbits()
        , satellites.length)
  };
}

export type OrbitalSystemType = {
  addOrbit: ([primary, secondary]: string[]) => void;
  countOrbits: () => number;
  numTransfers: (bodyA: string, bodyB: string) => number;
}

export function OrbitalSystem() {
  const allBodies = new Map();
  return {
    addOrbit: ([primary, secondary]: string[]): void => {
      const primaryBody: OrbitalBody = allBodies.get(primary) || Body(primary);
      const secondaryBody: OrbitalBody = allBodies.get(secondary) || Body(secondary);

      secondaryBody.parent = primaryBody;
      primaryBody.addSatellite(secondaryBody);
      allBodies.set(primary, primaryBody);
      allBodies.set(secondary, secondaryBody);
    },
    countOrbits: (): number => {
      let totalOrbits = 0;
      for (let body of allBodies.values()) {
        totalOrbits += body.countOrbits()
      }
      return totalOrbits;
    },
    numTransfers: (bodyA: string, bodyB: string): number => {
      let current: OrbitalBody = allBodies.get(bodyA);
      let next: OrbitalBody | null = null;

      const unvisited: Set<OrbitalBody> = new Set();

      for (const [key, node] of allBodies) {
        if (key !== bodyA) {
          node.distance = Infinity;
          node.visited = false;
          unvisited.add(node);
        }
      }

      current.distance = 0;
      current.visited = true;

      SEARCH:
      while (unvisited.size > 0) {
        const unvisitedNeighbors = current.getSatellites()
          .concat(current.parent)
          .filter(node => node && !node.visited);

        if (unvisitedNeighbors.length === 0) {
          for (const node of unvisited) {
            if (node.distance < Infinity) {
              current = node;
              unvisited.delete(node);
              continue SEARCH;
            }
          }
        }
        for (let neighbor of unvisitedNeighbors) {
          neighbor.distance = Math.min(neighbor.distance, current.distance + 1);
          if (neighbor.key === bodyB) {
            current = neighbor;
            break SEARCH;
          }
          if (!next || neighbor.distance < next.distance) {
            next = neighbor;
          }
        }
        current = next;
        current.visited = true;
        next = null;
        unvisited.delete(current);
      }

      if (current.key !== bodyB) {
        return -1;
      }

      return current.distance - 2;
    }
  };
}

const orbitMap: string[][] = fs.readFileSync(path.resolve(__dirname, 'orbitMap.txt'), 'utf8')
  .split('\n')
  .map(line => line.trim().split(')'));

const orbitalSystem1 = OrbitalSystem();
orbitMap.forEach(orbitalSystem1.addOrbit);

export const answer1 = orbitalSystem1.countOrbits();
export const answer2 = orbitalSystem1.numTransfers('YOU', 'SAN');
