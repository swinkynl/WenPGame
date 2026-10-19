// De Snackbar: een grote snackbar (waar je in kunt!) op een zonnig plein vol snack-vriendjes.
import * as D from '../decor.js';
import * as S from '../decor/snackbar.js';

export default {
  id: 'snackbar',
  naam: 'De Snackbar',
  emoji: '🍟',
  beschrijving: 'Bob Bitterbal en zijn snack-vriendjes',
  kaartKleuren: ['#e63946', '#ffc93c'],
  grootte: 150,
  zichtAfstand: 130,
  zaadje: 77,
  kleuren: {
    luchtBoven: 0x5aa9ff,
    luchtHorizon: 0xdff1ff,
    mist: 0xe4f2ff,
    grond: 0xe2d6c3, // stoeptegels
    grond2: 0xd4c6b0,
  },
  vriendjes: ['bitterbal', 'kroket', 'frikandel', 'patat', 'kaassouffle', 'softijs', 'milkshake', 'hamburger', 'ketchup'],
  altijd: ['bitterbal'], // Bob Bitterbal doet altijd mee

  bouw(w) {
    D.omheining(w, 'heg', 0x4f9d4f);

    const tegel = 0xc9b8a0;
    D.pad(w, [[0, 0], [0, 14]], 3, tegel);
    D.pad(w, [[0, 4], [-30, -6]], 2.6, tegel);
    D.pad(w, [[0, 4], [30, 0], [40, 20]], 2.6, tegel);

    // de snackbar zelf, met de deur naar de start
    w.plaats(S.snackbar(w), 0, 22, { draai: Math.PI });
    w.plaats(S.reuzeIjsje(w), 15, 16, { draai: Math.PI });
    w.plaats(S.reuzePatat(w), -15, 16, { draai: Math.PI });

    // terras voor de deur
    for (const [x, z] of [[-12, 9], [-6.5, 8], [6.5, 8], [12, 9]]) w.plaats(S.parasolTafel(w), x, z, { draai: 0 });

    // kraampjes
    w.plaats(S.patatkraam(w), -32, -12, { draai: 0.8 });
    w.plaats(S.ijscokar(w), 26, -14, { draai: -0.6 });
    w.plaats(S.ijscokar(w), -40, 30, { draai: 2 });

    // parkeerplaats met autootjes
    const parkeer = { x: 42, z: 34 };
    for (let i = 0; i < 6; i++) {
      for (const rij of [-1, 1]) {
        if (w.kans(0.3)) continue;
        w.plaats(S.autootje(w), parkeer.x - 10 + i * 4, parkeer.z + rij * 4, { draai: rij > 0 ? Math.PI : 0 });
      }
    }
    w.reserveer({ x: parkeer.x, z: parkeer.z, b: 26, d: 14 });

    w.verspreid((w) => S.parasolTafel(w), 8, { afstand: 1.5 });
    w.verspreid(() => S.bankje(), 14, { afstand: 1 });
    w.verspreid((w) => S.plantenbak(w), 22, { afstand: 1 });
    w.verspreid(() => S.prullenbak(), 14, { afstand: 1 });
    w.verspreid(() => D.lantaarn(), 18, { afstand: 2 });
    w.verspreid((w) => D.boom(w), 30, { afstand: 2, schaal: [0.9, 1.3] });
    w.verspreid((w) => D.struik(w, { bessen: w.kans(0.3) }), 40, { afstand: 0.6 });
    w.verspreid((w) => S.autootje(w), 6, { afstand: 2 });

    D.wolken(w, 14);
  },
};
