// Het Spookhuis: halloween-nacht met een groot spookhuis (waar je in kunt!) en een griezeltuin.
import * as D from '../decor.js';
import * as H from '../decor/halloween.js';

export default {
  id: 'spookhuis',
  naam: 'Het Spookhuis',
  emoji: '🎃',
  beschrijving: 'Halloween! Zoek in het spookhuis en de griezeltuin',
  kaartKleuren: ['#6a3d9a', '#ff8a1f'],
  grootte: 170,
  zichtAfstand: 120,
  zaadje: 31,
  kleuren: {
    luchtBoven: 0x1e1640,
    luchtHorizon: 0x8a4f8f,
    mist: 0x4b3b6e,
    grond: 0x55734f,
    grond2: 0x4a6450,
    hemelLicht: 0x9f9fe0,
    lichtSterkte: 1.3,
    zon: 0xc8d0ff, // maanlicht
    zonSterkte: 1.4,
  },
  vriendjes: ['heksenkat', 'spookpoes', 'mummiekat', 'vampierhond', 'pompoencorgi', 'pompoenkat', 'zwartekat', 'vleermuis'],

  bouw(w) {
    D.omheining(w, 'hek', 0x2b2440);
    H.maanEnSterren(w);

    const pad = 0x9a8a78;
    D.pad(w, [[0, 0], [0, 19]], 2.6, pad);
    D.pad(w, [[0, 6], [-25, 0], [-38, -16]], 2.4, pad);
    D.pad(w, [[0, 6], [28, 0], [40, -18]], 2.4, pad);
    D.pad(w, [[0, 19], [-14, 20], [-16, 36], [0, 40], [16, 36], [14, 20], [0, 19]], 2.2, pad);

    // het grote spookhuis, met de deur naar de start
    w.plaats(H.spookhuis(w), 0, 26, { draai: Math.PI });
    for (const x of [-2.2, 2.2]) w.plaats(H.pompoen(w, { groot: false }), x, 18.6, { draai: Math.PI });
    H.vleermuizen(w, 10, { x: 0, z: 26 });

    // kerkhofje met hekje
    const kerkhof = { x: -42, z: -30, b: 30, d: 22 };
    D.weide(w, kerkhof, { opening: 'x+', kleur: 0x2b2440 });
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 5; j++) {
        w.plaats(H.grafsteen(w), kerkhof.x - 11 + j * 5.5 + w.tussen(-0.5, 0.5), kerkhof.z - 7.5 + i * 4.8, { draai: w.tussen(-0.15, 0.15) });
      }
    }
    w.plaats(H.kaleBoom(w), kerkhof.x + 11, kerkhof.z + 8, { schaal: 1.4 });
    w.plaats(H.kaleBoom(w), kerkhof.x - 12, kerkhof.z - 8, { schaal: 1.2 });

    // pompoenveld met vogelverschrikker
    const veld = { x: 45, z: -32, b: 30, d: 24 };
    w.plaats(H.vogelverschrikker(w), veld.x, veld.z, { draai: -0.5 });
    w.verspreid((w) => H.pompoen(w, { groot: w.kans(0.25) }), 45, { regio: veld, afstand: 0.4 });
    w.reserveer(veld);

    for (const [x, z] of [[26, 32], [-30, 22], [10, -48], [-55, 45]]) w.plaats(H.heksenketel(w), x, z);
    H.spookjes(w, 7, { x: 0, z: 5 }, 55);

    w.verspreid((w) => H.kaleBoom(w), 45, { afstand: 2, schaal: [0.9, 1.5] });
    w.verspreid((w) => H.pompoen(w, { groot: w.kans(0.3) }), 50, { afstand: 1 });
    w.verspreid((w) => D.struik(w, { kleuren: [0x3f5a4a, 0x4a4a6a, 0x355046], bessen: w.kans(0.3) }), 70, { afstand: 0.6, schaal: [0.8, 1.4] });
    w.verspreid((w) => D.paddenstoel(w, { kleuren: [0x9b59ff, 0xff7a3d, 0x5ad1ff] }), 25, { afstand: 1.2, schaal: [0.6, 1.2] });
    w.verspreid(() => D.lantaarn(), 25, { afstand: 3 });
    w.verspreid((w) => D.hooibaal(w), 10, { afstand: 1.5 });
    w.verspreid((w) => H.grafsteen(w), 8, { afstand: 1 });

    D.bloemen(w, 500, [0xff8a1f, 0x9b59ff, 0xffffff]);
    D.gras(w, 1500, 0x4f6b4f);
    D.vuurvliegjes(w, 250, 0xffb347);
  },
};
