// Onder Water: het hondje zwemt met duikbril en snorkel tussen koraal, zeewier en een scheepswrak.
import * as D from '../decor.js';
import * as O from '../decor/onderwater.js';

export default {
  id: 'onderwater',
  naam: 'Onder Water',
  emoji: '🐠',
  beschrijving: 'Duiken tussen koraal en zeewier',
  kaartKleuren: ['#2f8fd6', '#6fe0e8'],
  grootte: 200,
  zichtAfstand: 90,
  zaadje: 55,
  zwemmen: true, // het hondje zwemt hier (met snorkel)
  kleuren: {
    luchtBoven: 0x8fe3ff,
    luchtHorizon: 0x1d6fa3,
    mist: 0x2a86b8,
    grond: 0xf2dca6,
    grond2: 0xe6c98c,
    hemelLicht: 0xbff4ff,
    lichtSterkte: 1.5,
    zon: 0xd8fbff,
    zonSterkte: 1.8,
  },
  vriendjes: ['walvis', 'kwal', 'clownvis', 'dolfijn', 'narwal', 'octopus', 'krab', 'zeepaardje', 'schildpad', 'kogelvis'],

  // golvende zandbodem
  hoogte(x, z) {
    const vlak = Math.min(1, Math.max(0, (Math.hypot(x, z) - 8) / 20));
    return (1.6 * Math.sin(x * 0.05) * Math.cos(z * 0.045) + 0.9 * Math.sin(x * 0.11 + 1) * Math.sin(z * 0.09) + 1.2) * vlak;
  },

  bouw(w) {
    O.rotsrand(w);
    O.wateroppervlak(w, 22);
    O.lichtstralen(w, 28, 22);

    w.plaats(O.scheepswrak(w), 32, 42, { draai: 0.6 });
    w.plaats(O.schatkist(w), 24, 30, { draai: 2 });
    w.plaats(O.schatkist(w), -62, -58, { draai: 0.7 });
    w.plaats(O.schatkist(w), 70, -20, { draai: 4 });
    O.bubbelbronnen(w, 8);

    O.kelpwoud(w, { x: -45, z: 38, r: 22 }, 75);
    O.kelpwoud(w, { x: 50, z: -45, r: 20 }, 60);
    O.kelpwoud(w, { x: -40, z: -40, r: 14 }, 35);

    w.verspreid((w) => O.koraal(w), 100, { afstand: 0.8, schaal: [0.8, 1.6] });
    w.verspreid((w) => O.anemoon(w), 45, { afstand: 0.6, schaal: [0.8, 1.4] });
    w.verspreid((w) => D.rotsblok(w), 18, { afstand: 2 });
    w.verspreid((w) => D.steen(w), 30, { afstand: 1 });
    w.verspreid((w) => O.schelp(w), 25, { afstand: 0.5 });

    D.gras(w, 1500, 0x3fbf9a);
    O.visjes(w, 10);
    D.vuurvliegjes(w, 400, 0xd9fbff); // zwevend plankton
  },
};
