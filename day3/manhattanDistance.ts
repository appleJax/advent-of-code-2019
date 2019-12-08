import * as fs from 'fs';
import * as path from 'path';

const moves: string[][] = fs.readFileSync(
  path.resolve(__dirname, 'moves.txt'), 'utf8'
).split('\n').map(wire => wire.split(','));

export type Coord = {
  x: number;
  y: number;
}

export type Line = {
  a: Coord;
  b: Coord;
}

export type WireObject = {
  advance: (move: string) => LineSegment;
  getHead: () => Coord;
  getLineSegments: () => LineSegment[];
}

const isOrigin = (coord: Coord): boolean =>
  coord.x === 0 && coord.y === 0;

const calculateManhattanDistance = (coord: Coord): number => Math.abs(coord.x) + Math.abs(coord.y);

export function minCoord(coord1: Coord, coord2: Coord): Coord {
  const dist1 = calculateManhattanDistance(coord1);
  const dist2 = calculateManhattanDistance(coord2);

  if (isOrigin(coord1)) {
    return coord2;
  }

  if (isOrigin(coord2)) {
    return coord1;
  }

  return dist1 < dist2
    ? coord1
    : coord2;
}

export function findIntersection(lineSegment1: LineSegment, lineSegment2: LineSegment): Coord {
  const { line: line1 } = lineSegment1;
  const { line: line2 } = lineSegment2;

  if (line1.a.x === line1.b.x &&
      line1.a.x === line2.a.x &&
      line1.a.x === line2.b.x) {
        
    if ((line1.a.y >= line2.a.y && line1.a.y <= line2.b.y)
      || (line1.a.y <= line2.a.y && line1.a.y >= line2.b.y)
      || (line1.b.y >= line2.a.y && line1.b.y <= line2.b.y)
      || (line1.b.y <= line2.a.y && line1.b.y >= line2.b.y)

      || (line2.a.y >= line1.a.y && line2.a.y <= line1.b.y)
      || (line2.a.y <= line1.a.y && line2.a.y >= line1.b.y)
      || (line2.b.y >= line1.a.y && line2.b.y <= line1.b.y)
      || (line2.b.y <= line1.a.y && line2.b.y >= line1.b.y)
    ) {
      const absA: number = Math.abs(line2.a.y);
      const absB: number = Math.abs(line2.b.y);
      const realCoord = {
        [absA]: line2.a.y,
        [absB]: line2.b.y
      };
      return {
        x: line1.a.x,
        y: realCoord[
          Math.min(absA, absB)
        ]
      };
    }
  }

  if (line1.a.y === line1.b.y &&
     line1.a.y === line2.a.y &&
     line1.a.y === line2.b.y) {

    if ((line1.a.x >= line2.a.x && line1.a.x <= line2.b.x)
      || (line1.a.x <= line2.a.x && line1.a.x >= line2.b.x)
      || (line1.b.x >= line2.a.x && line1.b.x <= line2.b.x)
      || (line1.b.x <= line2.a.x && line1.b.x >= line2.b.x)
      
      || (line2.a.x >= line1.a.x && line2.a.x <= line1.b.x)
      || (line2.a.x <= line1.a.x && line2.a.x >= line1.b.x)
      || (line2.b.x >= line1.a.x && line2.b.x <= line1.b.x)
      || (line2.b.x <= line1.a.x && line2.b.x >= line1.b.x)
    ) {
      const absA: number = Math.abs(line2.a.x);
      const absB: number = Math.abs(line2.b.x);
      const realCoord = {
        [absA]: line2.a.x,
        [absB]: line2.b.x
      };
      return {
        x: realCoord[
          Math.min(absA, absB)
        ],
        y: line1.a.y
      };
    }
  }

  const tNumerator = (line1.a.x - line2.a.x) * (line2.a.y - line2.b.y) - (line1.a.y - line2.a.y) * (line2.a.x - line2.b.x);
  const denominator = (line1.a.x - line1.b.x) * (line2.a.y - line2.b.y) - (line1.a.y - line1.b.y) * (line2.a.x - line2.b.x);
  const t = tNumerator / denominator;

  if (denominator === 0) {
    // return origin, which signifies that the lines do not intersect
    return { x: 0, y: 0 };
  }

  const uNumerator = (line1.a.x - line1.b.x) * (line1.a.y - line2.a.y) - (line1.a.y - line1.b.y) * (line1.a.x - line2.a.x);
  const u = -uNumerator / denominator;

  if (t < 0 || t > 1 || u < 0 || u > 1) {
    return { x: 0, y: 0 };
  }

  if (t >= 0 && t <= 1) {
    const xCoord: number = line1.a.x + (t * (line1.b.x - line1.a.x));
    const yCoord: number = line1.a.y + (t * (line1.b.y - line1.a.y));

    return { x: xCoord, y: yCoord };
  }

  if (u >= 0 && u <= 1){
    const xCoord: number = line2.a.x + (u * (line2.b.x - line2.a.x));
    const yCoord: number = line2.a.y + (u * (line2.b.y - line2.a.y));

    return { x: xCoord, y: yCoord };
  } 

  return { x: 0, y: 0 };
}

const DELTA = {
  R: [ 1,  0],
  L: [-1,  0],
  U: [ 0,  1],
  D: [ 0, -1]
};

export type LineSegment = {
  line: Line;
  lengthFromOrigin: number;
};

export function calculateLength(line: Line): number {
  return Math.abs(line.a.x - line.b.x) + Math.abs(line.a.y - line.b.y);
}

export function calculateDelay(
  lineSegment1: LineSegment,
  lineSegment2: LineSegment,
  intersection: Coord
): number {
  const lengthA = lineSegment1.lengthFromOrigin - calculateLength({ a: lineSegment1.line.b, b: intersection });
  const lengthB = lineSegment2.lengthFromOrigin - calculateLength({ a: lineSegment2.line.b, b: intersection });
  return lengthA + lengthB;
}

export function Wire(): WireObject {
  const lineSegments: LineSegment[] = [];
  let head: Coord = { x: 0, y: 0 };
  let lengthFromOrigin = 0;

  return {
    advance(move: string): LineSegment {
      const [dX, dY]: number[] = DELTA[move[0]].map((d: number): number => d * Number(move.slice(1)));

      const newCoord: Coord = {
        x: head.x + dX,
        y: head.y + dY
      };
      const newLine = {
        a: head,
        b: newCoord
      };

      head = newCoord;
      lengthFromOrigin += calculateLength(newLine);

      const newLineSegment = {
        line: newLine,
        lengthFromOrigin
      };

      lineSegments.push(newLineSegment);

      return newLineSegment;
    },
    
    getHead(): Coord {
      return head;
    },

    getLineSegments(): LineSegment[] {
      return lineSegments;
    }
  };
}

export function manhattanDistance(movesA: string[], movesB: string[], leastDelay?: boolean): number {
  const wireA: WireObject = Wire();
  const wireB: WireObject = Wire();
  let minimum = Infinity;

  movesA.forEach(move => wireA.advance(move));
  const linesA: LineSegment[] = wireA.getLineSegments();

  movesB.forEach((move: string) => {
    const newestLine: LineSegment = wireB.advance(move);
    linesA.forEach(line => {
      const intersection: Coord = findIntersection(line, newestLine);
      if (!isOrigin(intersection)) {
        minimum = leastDelay
          ? Math.min(minimum, calculateDelay(line, newestLine, intersection))
          : Math.min(minimum, calculateManhattanDistance(intersection));
      }
    });
  });

  return minimum;
}

export const answer1: number = manhattanDistance(moves[0], moves[1]);

export const answer2: number = manhattanDistance(moves[0], moves[1], true);
