import {
  answer1,
  answer2,
  Body,
  OrbitalBody,
  OrbitalSystem,
  OrbitalSystemType
} from './orbits';

describe('OrbitalBody', () => {
  test('add/get satellite', () => {
    const bodyA: OrbitalBody = Body('A');
    const bodyB: OrbitalBody = Body('B');
    const bodyC: OrbitalBody = Body('C');

    bodyA.addSatellite(bodyB);
    expect(bodyA.getSatellites()).toEqual([bodyB]);

    bodyA.addSatellite(bodyC);
    expect(bodyA.getSatellites()).toEqual([bodyB, bodyC]);
  });

  test('countOrbits', () => {
    const bodyA: OrbitalBody = Body('A');
    const bodyB: OrbitalBody = Body('B');
    const bodyC: OrbitalBody = Body('C');
    const bodyD: OrbitalBody = Body('D');
    const bodyE: OrbitalBody = Body('E');

    bodyA.addSatellite(bodyB);
    expect(bodyA.countOrbits()).toEqual(1);

    bodyA.addSatellite(bodyC);
    expect(bodyA.countOrbits()).toEqual(2);

    bodyC.addSatellite(bodyD);
    expect(bodyA.countOrbits()).toEqual(3);

    bodyD.addSatellite(bodyE);

    expect(bodyA.countOrbits()).toEqual(4);
    expect(bodyC.countOrbits()).toEqual(2);
    expect(bodyB.countOrbits()).toEqual(0);
  });

  // test('distanceBetween - no transfers', () => {
  //   const bodyA: OrbitalBody = Body('A');
  //   const bodyB: OrbitalBody = Body('B');
  //   const bodyC: OrbitalBody = Body('C');

  //   bodyA.addSatellite(bodyB);
  //   bodyA.addSatellite(bodyC);

  //   const searchData1 = createSearchData('B');
  //   const searchData2 = createSearchData('C');
  //   expect(bodyA.distanceBetween(searchData1, searchData2)).toEqual(0);
  // });

  // test('distanceBetween - not reachable', () => {
  //   const bodyA: OrbitalBody = Body('A');
  //   const bodyB: OrbitalBody = Body('B');
  //   const bodyC: OrbitalBody = Body('C');

  //   bodyA.addSatellite(bodyB);
  //   bodyA.addSatellite(bodyC);

  //   const searchData1 = createSearchData('B');
  //   const searchData2 = createSearchData('D');
  //   expect(bodyA.distanceBetween(searchData1, searchData2)).toEqual(Infinity);

  //   const searchData3 = createSearchData('F');
  //   const searchData4 = createSearchData('C');
  //   expect(bodyA.distanceBetween(searchData1, searchData2)).toEqual(Infinity);
  // });

  // test('distanceBetween - transfers required', () => {
  //   const bodyA: OrbitalBody = Body('A');
  //   const bodyB: OrbitalBody = Body('B');
  //   const bodyC: OrbitalBody = Body('C');
  //   const bodyD: OrbitalBody = Body('D');
  //   const bodyE: OrbitalBody = Body('E');
  //   const bodyF: OrbitalBody = Body('F');

  //   bodyA.addSatellite(bodyB);
  //   bodyA.addSatellite(bodyC);
  //   bodyC.addSatellite(bodyD);
  //   bodyD.addSatellite(bodyE);
  //   bodyE.addSatellite(bodyF);

  //   const searchData1 = createSearchData('B');
  //   const searchData2 = createSearchData('F');
  //   expect(bodyA.distanceBetween(searchData1, searchData2)).toEqual(3);

  //   const searchData3 = createSearchData('F');
  //   const searchData4 = createSearchData('G');
  //   expect(bodyA.distanceBetween(searchData3, searchData4)).toEqual(Infinity);
  // });

  // test('distanceBetween - dead ends', () => {
  //   /*
  //                 I
  //                /
  //           F - G - H
  //          /
  //     A - D - E
  //      \
  //       B - C
  //   */
  //   const bodyA: OrbitalBody = Body('A');
  //   const bodyB: OrbitalBody = Body('B');
  //   const bodyC: OrbitalBody = Body('C');
  //   const bodyD: OrbitalBody = Body('D');
  //   const bodyE: OrbitalBody = Body('E');
  //   const bodyF: OrbitalBody = Body('F');
  //   const bodyG: OrbitalBody = Body('G');
  //   const bodyH: OrbitalBody = Body('H');
  //   const bodyI: OrbitalBody = Body('I');

  //   bodyA.addSatellite(bodyB);
  //   bodyA.addSatellite(bodyD);

  //   bodyB.addSatellite(bodyC);

  //   bodyD.addSatellite(bodyE);
  //   bodyD.addSatellite(bodyF);

  //   bodyF.addSatellite(bodyG);

  //   bodyG.addSatellite(bodyH);
  //   bodyG.addSatellite(bodyI);

  //   const searchData1 = createSearchData('C');
  //   const searchData2 = createSearchData('I');
  //   expect(bodyA.distanceBetween(searchData1, searchData2)).toEqual(4);
  // });

  // test('distanceBetween - same branch', () => {
  //   const bodyA: OrbitalBody = Body('A');
  //   const bodyB: OrbitalBody = Body('B');
  //   const bodyC: OrbitalBody = Body('C');
  //   const bodyD: OrbitalBody = Body('D');

  //   bodyA.addSatellite(bodyB);
  //   bodyB.addSatellite(bodyC);
  //   bodyC.addSatellite(bodyD);

  //   const searchData1 = createSearchData('A');
  //   const searchData2 = createSearchData('D');
  //   expect(bodyA.distanceBetween(searchData1, searchData2)).toEqual(1);
  // });
});

describe('OrbitalSystem', () => {
  test('add/count orbits', () => {
    const orbitalSystem: OrbitalSystemType = OrbitalSystem();
    expect(orbitalSystem.countOrbits()).toEqual(0);

    orbitalSystem.addOrbit(['A', 'B']);
    expect(orbitalSystem.countOrbits()).toEqual(1);

    orbitalSystem.addOrbit(['A', 'C']);
    expect(orbitalSystem.countOrbits()).toEqual(2);

    orbitalSystem.addOrbit(['C', 'D']);
    expect(orbitalSystem.countOrbits()).toEqual(4);
  });

  test('countOrbits with complex system', () => {
    const orbitalSystem: OrbitalSystemType = OrbitalSystem();
    orbitalSystem.addOrbit(['COM', 'B']);
    orbitalSystem.addOrbit(['B', 'C']);
    orbitalSystem.addOrbit(['C', 'D']);
    orbitalSystem.addOrbit(['D', 'E']);
    orbitalSystem.addOrbit(['E', 'F']);
    orbitalSystem.addOrbit(['B', 'G']);
    orbitalSystem.addOrbit(['G', 'H']);
    orbitalSystem.addOrbit(['D', 'I']);
    orbitalSystem.addOrbit(['E', 'J']);
    orbitalSystem.addOrbit(['J', 'K']);
    orbitalSystem.addOrbit(['K', 'L']);

    expect(orbitalSystem.countOrbits()).toEqual(42);
  });

  test('numTransfers', () => {
    const orbitalSystem: OrbitalSystemType = OrbitalSystem();
    orbitalSystem.addOrbit(['COM', 'B']);
    orbitalSystem.addOrbit(['B', 'C']);
    orbitalSystem.addOrbit(['C', 'D']);
    orbitalSystem.addOrbit(['D', 'E']);
    orbitalSystem.addOrbit(['E', 'F']);
    orbitalSystem.addOrbit(['B', 'G']);
    orbitalSystem.addOrbit(['G', 'H']);
    orbitalSystem.addOrbit(['D', 'I']);
    orbitalSystem.addOrbit(['E', 'J']);
    orbitalSystem.addOrbit(['J', 'K']);
    orbitalSystem.addOrbit(['K', 'L']);
    orbitalSystem.addOrbit(['K', 'YOU']);
    orbitalSystem.addOrbit(['I', 'SAN']);

    expect(orbitalSystem.numTransfers('YOU', 'SAN')).toEqual(4);
  });
});

describe('answers', () => {
  expect(answer1).toEqual(295936); 
  expect(answer2).toEqual(457);
});
