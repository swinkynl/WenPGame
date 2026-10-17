// De Boerderij: schuur, weides, maisvelden, hooibalen en een molen.
import * as D from '../decor.js';

export default {
  id: 'boerderij',
  naam: 'De Boerderij',
  emoji: '🚜',
  beschrijving: 'Schuren, weides, maisvelden en een molen',
  kaartKleuren: ['#6cc24a', '#f2b33d'],
  grootte: 220,
  zichtAfstand: 150,
  zaadje: 21,
  kleuren: {
    luchtBoven: 0x4f9dff,
    luchtHorizon: 0xd6efff,
    mist: 0xdcefff,
    grond: 0x9bd46a,
    grond2: 0x7fc25a,
  },
  vriendjes: ['koe', 'varken', 'kip', 'eend', 'schaap', 'kat', 'konijn', 'kikker'],

  bouw(w) {
    D.omheining(w, 'hek');

    // zandpaden over het erf
    const zand = 0xd9b77e;
    D.pad(w, [[0, 0], [8, 10], [20, 10]], 3, zand);
    D.pad(w, [[0, 0], [-8, 10], [-18, 15]], 3, zand);
    D.pad(w, [[8, 10], [40, 30], [55, 40]], 3, zand);
    D.pad(w, [[0, 0], [5, -20], [0, -40]], 3, zand);
    D.pad(w, [[-8, 10], [-40, -10], [-60, -45]], 3, zand);

    // het erf
    w.plaats(D.schuur(w), 24, 20, { draai: -0.4 });
    w.plaats(D.silo(w), 33, 7, { draai: 0 });
    w.plaats(D.huis(w), -22, 24, { draai: 0.35 });
    w.plaats(D.kippenhok(w), -30, 8, { draai: 1.2 });
    w.plaats(D.trekker(w), 12, 32, { draai: 2.2 });
    w.plaats(D.trekker(w), 55, -30, { draai: 0.4 });
    w.plaats(D.windmolen(w), -62, -62, { draai: 0.8 });

    // weides met hekken en wat hooi erin
    const weides = [
      { regio: { x: 55, z: 62, b: 36, d: 28 }, opening: 'z-' },
      { regio: { x: -58, z: 58, b: 30, d: 30 }, opening: 'x+' },
      { regio: { x: 62, z: -70, b: 34, d: 26 }, opening: 'x-' },
    ];
    for (const { regio, opening } of weides) {
      D.weide(w, regio, { opening });
      w.plaats(D.hooistapel(w), regio.x - regio.b * 0.25, regio.z + regio.d * 0.2);
      w.plaats(D.hooibaal(w), regio.x + regio.b * 0.25, regio.z - regio.d * 0.2);
      w.plaats(D.hooibaal(w), regio.x + regio.b * 0.1, regio.z + regio.d * 0.25);
      w.plaats(D.boom(w), regio.x + regio.b * 0.3, regio.z + regio.d * 0.3, { schaal: 1.3 });
      w.plaats(D.struik(w), regio.x - regio.b * 0.3, regio.z - regio.d * 0.3);
    }

    // maisvelden (heerlijk om in te verstoppen!)
    D.maisveld(w, { x: -8, z: -62, b: 34, d: 24 });
    D.maisveld(w, { x: 78, z: 10, b: 20, d: 36 });

    w.plaats(D.vijver(w, 7), -55, 2, { draai: 0 });
    w.plaats(D.vijver(w, 5), 22, -82, { draai: 0 });

    // boomgaard
    w.verspreid((w) => D.appelboom(w), 22, { regio: { x: 0, z: 74, b: 44, d: 30 }, afstand: 1.5 });

    w.verspreid((w) => D.hooibaal(w), 26, { afstand: 1.5 });
    w.verspreid((w) => D.hooistapel(w), 8, { afstand: 2 });
    w.verspreid((w) => D.boom(w), 40, { afstand: 2, schaal: [0.9, 1.4] });
    w.verspreid((w) => D.dennenboom(w), 25, { afstand: 2, schaal: [0.9, 1.4] });
    w.verspreid((w) => D.struik(w), 70, { afstand: 0.6, schaal: [0.8, 1.4] });
    w.verspreid((w) => D.steen(w), 12, { afstand: 1 });

    D.bloemen(w, 900, [0xffffff, 0xffeb3b, 0xff7043, 0xe1bee7]);
    D.gras(w, 1800, 0x6aa84f);
    D.wolken(w, 16);
  },
};
