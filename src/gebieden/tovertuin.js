// De Tovertuin: een Japanse kawaii-tuin met kersenbloesem, toriipoorten, koivijvers
// en een beetje toverij (paddenstoelhuisjes, kristallen, vuurvliegjes).
import * as D from '../decor.js';

export default {
  id: 'tovertuin',
  naam: 'De Tovertuin',
  emoji: '🌸',
  beschrijving: 'Kersenbloesem, toriipoorten en koivijvers',
  kaartKleuren: ['#ff8fbf', '#ffc6dc'],
  grootte: 200,          // breedte van het gebied in meters
  zichtAfstand: 140,     // hoe ver je kunt kijken voordat het mistig wordt
  zaadje: 7,             // ander getal = andere indeling van het gebied
  kleuren: {
    luchtBoven: 0x9fbcff,
    luchtHorizon: 0xffdce9,
    mist: 0xffe4ef,
    grond: 0x9ad98b,
    grond2: 0x87cb7a,
    hemelLicht: 0xfff0f6,
  },
  // welke vriendjes zich hier kunnen verstoppen (id's uit src/vriendjes)
  vriendjes: ['eenhoorn', 'konijn', 'uil', 'kikker', 'kat', 'beer', 'eend', 'schaap'],

  bouw(w) {
    D.omheining(w, 'heg', 0x5aa86a);

    // paadjes met toriipoorten erover
    const zand = 0xf6e7cf;
    const paden = [
      [[0, 0], [0, 14]],
      [[2, 14], [14, 24], [30, 40], [48, 50]],
      [[-2, 14], [-25, 25], [-45, 35]],
      [[3, 12], [30, 0], [55, -20], [60, -45]],
      [[0, -4], [-20, -30], [-50, -50]],
    ];
    for (const pad of paden) D.pad(w, pad, 2.4, zand);
    const poort = (x, z, dx, dz) => w.plaats(D.torii(w), x, z, { draai: Math.atan2(dx, dz) });
    poort(0, 7, 0, 1);
    poort(22, 32, 16, 16);
    poort(-14, 19.5, -23, 11);
    poort(42, -10, 25, -20);
    poort(-10, -17, -20, -26);

    // koivijvers met bruggetjes en een pagode
    w.plaats(D.koivijver(w, 6), 0, 22, { draai: 0 });
    w.plaats(D.koivijver(w, 7), 62, 30, { draai: 1.1 });
    w.plaats(D.pagode(w), -62, -18, { draai: 0.7 });

    // kabouterdorp met paddenstoelhuisjes
    for (const [x, z] of [[-48, 44], [-60, 28], [-36, 57], [72, 66]]) {
      w.plaats(D.paddenstoelhuisje(w), x, z, { draai: Math.atan2(-x, -z) + w.tussen(-0.5, 0.5) });
    }
    w.plaats(D.regenboog(w), 18, 78, { draai: 1.2 });

    // bamboebosjes
    w.verspreid((w) => D.bamboe(w), 18, { regio: { x: 60, z: -60, r: 26 }, afstand: 0.4 });
    w.verspreid((w) => D.bamboe(w), 12, { regio: { x: -40, z: 75, r: 18 }, afstand: 0.4 });

    const kristalKleuren = [0xb388ff, 0x80deea, 0xff80ab, 0xa7ffeb];
    w.verspreid((w) => D.kristal(w, w.kies(kristalKleuren)), 16, { regio: { x: -60, z: -62, r: 20 }, afstand: 0.8, schaal: [0.8, 1.8] });

    w.verspreid((w) => D.sakura(w), 85, { afstand: 2, schaal: [0.85, 1.35] });
    w.verspreid((w) => D.toverboom(w), 12, { afstand: 2, schaal: [0.8, 1.2] });
    w.verspreid((w) => D.paddenstoel(w), 25, { afstand: 1.5, schaal: [0.7, 1.4] });
    w.verspreid((w) => D.struik(w, { kleuren: [0x5aad5a, 0x4f9d4f, 0xf7a1c4, 0xf48fb1], bessen: w.kans(0.4) }), 110, { afstand: 0.6, schaal: [0.8, 1.4] });
    w.verspreid(() => D.steenlantaarn(), 28, { afstand: 2 });
    w.verspreid((w) => D.steen(w), 25, { afstand: 1 });

    D.bloemen(w, 1500, [0xff6fae, 0xffd166, 0xffffff, 0xffb7c9, 0xb388ff]);
    D.gras(w, 1200, 0x6cc25e);
    D.vuurvliegjes(w, 300, 0xfff59d);
    D.bloesem(w, 300);
    D.wolken(w, 14);
  },
};
