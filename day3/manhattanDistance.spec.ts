import {
  answer1,
  answer2,
  calculateDelay,
  calculateLength,
  Coord,
  findIntersection,
  LineSegment,
  manhattanDistance,
  minCoord,
  Wire,
  WireObject,
  Line
} from './manhattanDistance';

const ORIGIN: Coord = { x: 0, y: 0 };

describe('minCoord', () => {
  it('should return the coordinate with the least Manhattan distance from (0,0)', () => {
    const coord1: Coord = { x: 3, y: 3 };
    const coord2: Coord = { x: 3, y: 4 };
    expect(minCoord(coord1, coord2)).toEqual(coord1);

    const coord3: Coord = { x: -5, y: 3 };
    const coord4: Coord = { x: -4, y: 3 };
    expect(minCoord(coord3, coord4)).toEqual(coord4);
  });

  it('should not return a coord with value (0,0)', () => {
    const coord1: Coord = { x: 999, y: 354 };
    const coord2: Coord = ORIGIN;
    expect(minCoord(coord1, coord2)).toEqual(coord1);

    const coord3: Coord = ORIGIN;
    const coord4: Coord = { x: 999, y: 354 };
    expect(minCoord(coord3, coord4)).toEqual(coord4);
  });
});

describe('findIntersection', () => {
  it('should find the intersection coordinate of two perpendicular lines', () => {
    const line1 = {
      line: {
        a: { x: 3, y: 1 },
        b: { x: 6, y: 1 }
      },
      lengthFromOrigin: 0
    };
    const line2 = {
      line: {
        a: { x: 4, y: 5 },
        b: { x: 4, y: 0 }
      },
      lengthFromOrigin: 0
    };
    expect(findIntersection(line1, line2)).toEqual({ x: 4, y: 1 });

    const line3 = {
      line: {
        a: { x: 3, y: 1 },
        b: { x: 6, y: 1 }
      },
      lengthFromOrigin: 0
    };
    const line4 = {
      line: {
        a: { x: 3, y: 5 },
        b: { x: 3, y: 1 }
      },
      lengthFromOrigin: 0
    };
    expect(findIntersection(line3, line4)).toEqual({ x: 3, y: 1 });
  });

  it('should find the intersection coordinate of two overlapping lines', () => {
    const line1 = {
      line: {
        a: { x: 4, y: 1 },
        b: { x: 11, y: 1 }
      },
      lengthFromOrigin: 0
    };
    const line2 = {
      line: {
        a: { x: 5, y: 1 },
        b: { x: 10, y: 1 }
      },
      lengthFromOrigin: 0
    };
    expect(findIntersection(line1, line2)).toEqual({ x: 5, y: 1 });

    const line3 = {
      line: {
        a: { x: 3, y: 10 },
        b: { x: 3, y: 1 }
      },
      lengthFromOrigin: 0
    };
    const line4 = {
      line: {
        a: { x: 3, y: -5 },
        b: { x: 3, y: 1 }
      },
      lengthFromOrigin: 0
    };
    expect(findIntersection(line3, line4)).toEqual({ x: 3, y: 1 });

    line4.line.b.y = 0;
    expect(findIntersection(line3, line4)).toEqual(ORIGIN);
  });

  it('should return ORIGIN if lines are parallel and do not intersect', () => {
    const line1 = {
      line: {
        a: { x: 6, y: 10 },
        b: { x: 6, y: 1 }
      },
      lengthFromOrigin: 0
    };
    const line2 = {
      line: {
        a: { x: 3, y: 5 },
        b: { x: 3, y: 1 }
      },
      lengthFromOrigin: 0
    };
    expect(findIntersection(line1, line2)).toEqual(ORIGIN);
  });

  it('should return ORIGIN if lines are perpendicular and do not intersect', () => {
    const line1 = {
      line: {
        a: { x: 4, y: 3 },
        b: { x: 6, y: 3 }
      },
      lengthFromOrigin: 0
    };
    const line2 = {
      line: {
        a: { x: 3, y: 5 },
        b: { x: 3, y: 1 }
      },
      lengthFromOrigin: 0
    };
    expect(findIntersection(line1, line2)).toEqual(ORIGIN);

    const line3 = {
      line: {
        a: { x: -2, y: 3 },
        b: { x: 1, y: 3 }
      },
      lengthFromOrigin: 0
    };
    const line4 = {
      line: {
        a: { x: -3, y: 5 },
        b: { x: -3, y: 1 }
      },
      lengthFromOrigin: 0
    };
    expect(findIntersection(line3, line4)).toEqual(ORIGIN);

    const line5 = {
      line: {
        a: { x: 75, y: -30 },
        b: { x: 158, y: -30 }
      },
      lengthFromOrigin: 0
    };
    const line6 = {
      line: {
        a: { x: 0, y: 0 },
        b: { x: 0, y: 62 }
      },
      lengthFromOrigin: 0
    };
    expect(findIntersection(line5, line6)).toEqual(ORIGIN);
  });
});

describe('Wire', () => {
  test('constructor', () => {
    const wire: WireObject = Wire();
    expect(wire.getHead()).toEqual(ORIGIN);
    expect(wire.getLineSegments()).toEqual([]);
  });
});

describe('move', () => {
  it('should advance a given wire to the correct coordinate', () => {
    const wire: WireObject = Wire();

    // Up 2
    wire.advance('U2');
    const segment1 = {
      line: {
        a: ORIGIN,
        b: { x: 0, y: 2 }
      },
      lengthFromOrigin: 2
    };
    expect(wire.getLineSegments()).toEqual([segment1]);
    expect(wire.getHead()).toEqual({ x: 0, y: 2 });

    // Right 5
    wire.advance('R5');
    const segment2 = {
      line: {
        a: { x: 0, y: 2 },
        b: { x: 5, y: 2 }
      },
      lengthFromOrigin: 7
    };
    expect(wire.getLineSegments()).toEqual([segment1, segment2]);
    expect(wire.getHead()).toEqual({ x: 5, y: 2 });

    // Down 10
    wire.advance('D10');
    const segment3 = {
      line: {
        a: { x: 5, y: 2 },
        b: { x: 5, y: -8 }
      },
      lengthFromOrigin: 17
    };
    expect(wire.getLineSegments()).toEqual([segment1, segment2, segment3]);
    expect(wire.getHead()).toEqual({ x: 5, y: -8 });

    // Left 1
    wire.advance('L1');
    const segment4 = {
      line: {
        a: { x: 5, y: -8 },
        b: { x: 4, y: -8 }
      },
      lengthFromOrigin: 18
    };
    expect(wire.getLineSegments()).toEqual([segment1, segment2, segment3, segment4]);
    expect(wire.getHead()).toEqual({ x: 4, y: -8 });
  });
});

describe('manhattanDistance', () => {
  it('should calculate the closest crossing of wires for simple wires', () => {
    const wireA = ["R7","D3","L4"];
    const wireB = ["U2","R3","D10"];
    expect(manhattanDistance(wireA, wireB)).toEqual(3);

    const wireC = ["R8", "U5", "L5", "D3"];
    const wireD = ["U7", "R6", "D4", "L4"];
    expect(manhattanDistance(wireC, wireD)).toEqual(6);
  });

  it('should calculate the closest crossing of wires', () => {
    const wireA = ["R75","D30","R83","U83","L12","D49","R71","U7","L72"];
    const wireB = ["U62","R66","U55","R34","D71","R55","D58","R83"];
    expect(manhattanDistance(wireA, wireB)).toEqual(159);

    const wireC = ["R98","U47","R26","D63","R33","U87","L62","D20","R33","U53","R51"];
    const wireD = ["U98","R91","D20","R16","D67","R40","U7","R15","U6","R7"];
    expect(manhattanDistance(wireC, wireD)).toEqual(135);
  });
});

describe('calculateLength', () => {
  test('positive', () => {
    const line = {
      a: { x: 0, y: 2 },
      b: { x: 8, y: 2 }
    };
    expect(calculateLength(line)).toEqual(8);
  });

  test('negative', () => {
    const line = {
      a: { x: -10, y: -6 },
      b: { x: -10, y: -10 }
    };
    expect(calculateLength(line)).toEqual(4);
  });

  test('cross axis', () => {
    const line = {
      a: { x: -10, y: -6 },
      b: { x: -10, y: 7 }
    };
    expect(calculateLength(line)).toEqual(13);
  });

  test('zero', () => {
    const line2 = {
      a: { x: -15, y: -3 },
      b: { x: -15, y: -3 }
    };
    expect(calculateLength(line2)).toEqual(0);
  });
});

describe('calculateDelay', () => {
  it('should calculate the delay for an intersection', () => {
    const lineSegment1: LineSegment = {
      line: {
        a: { x: 3, y: 2 },
        b: { x: 6, y: 2 }
      },
      lengthFromOrigin: 8
    };
    const lineSegment2: LineSegment = {
      line: {
        a: { x: 4, y: 4 },
        b: { x: 4, y: 0 }
      },
      lengthFromOrigin: 12
    };
    const intersection: Coord = { x: 4, y: 2 };
    expect(calculateDelay(lineSegment1, lineSegment2, intersection)).toEqual(16);
  });
});

describe('minimalDelay', () => {
  it('should calculate the minimal delay for all intersections - simple wires', () => {
    const wireA = ["R7","D3","L4"];
    const wireB = ["U2","R3","D10"];
    expect(manhattanDistance(wireA, wireB, true)).toEqual(10);

    const wireC = ["R8", "U5", "L5", "D3"];
    const wireD = ["U7", "R6", "D4", "L4"];
    expect(manhattanDistance(wireC, wireD, true)).toEqual(30);
  });

  it('should calculate the minimal delay for all intersections', () => {
    const wireA = ["R75","D30","R83","U83","L12","D49","R71","U7","L72"];
    const wireB = ["U62","R66","U55","R34","D71","R55","D58","R83"];
    expect(manhattanDistance(wireA, wireB, true)).toEqual(610);

    const wireC = ["R98","U47","R26","D63","R33","U87","L62","D20","R33","U53","R51"];
    const wireD = ["U98","R91","D20","R16","D67","R40","U7","R15","U6","R7"];
    expect(manhattanDistance(wireC, wireD, true)).toEqual(410);
  });
});

test('answers', () => {
  expect(answer1).toEqual(266);
  expect(answer2).toEqual(19242);
});
