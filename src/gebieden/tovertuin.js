// De Tovertuin: paddenstoelen, toverbomen, kristallen en vuurvliegjes.
import * as D from '../decor.js';

export default {
  id: 'tovertuin',
  naam: 'De Tovertuin',
  emoji: '🍄',
  beschrijving: 'Paddenstoelen, kristallen en vuurvliegjes',
  kaartKleuren: ['#b98cff', '#ff8fc8'],
  grootte: 200,          // breedte van het gebied in meters
  zichtAfstand: 140,     // hoe ver je kunt kijken voordat het mistig wordt
  zaadje: 7,             // ander getal = andere indeling van het gebied
  kleuren: {
    luchtBoven: 0x8fa8ff,
    luchtHorizon: 0xffd9f2,
    mist: 0xf6dcff,
    grond: 0x86d97a,
    grond2: 0x6fc46e,
    hemelLicht: 0xfff0ff,
  },
  // welke vriendjes zich hier kunnen verstoppen (id's uit src/vriendjes)
  vriendjes: ['eenhoorn', 'konijn', 'uil', 'kikker', 'kat', 'beer', 'eend', 'schaap'],

  bouw(w) {
    D.omheining(w, 'heg', 0x3f9b55);

    // paadjes vanaf de start
    const zand = 0xf3e5c0;
    D.pad(w, [[0, 0], [0, 12]], 2.4, zand);
    D.pad(w, [[0, 18], [10, 35], [30, 48], [55, 55]], 2.4, zand);
    D.pad(w, [[-3, 16], [-25, 25], [-45, 35]], 2.4, zand);
    D.pad(w, [[3, 14], [30, 0], [55, -20], [60, -45]], 2.4, zand);
    D.pad(w, [[0, -4], [-20, -30], [-50, -50]], 2.4, zand);

    w.plaats(D.fontein(w), 0, 15, { draai: 0 });

    // kabouterdorp met paddenstoelhuisjes
    for (const [x, z] of [[-48, 42], [-58, 26], [-36, 55], [62, -52], [72, -36], [48, -66], [70, 62]]) {
      w.plaats(D.paddenstoelhuisje(w), x, z, { draai: Math.atan2(-x, -z) + w.tussen(-0.5, 0.5) });
    }

    w.plaats(D.regenboog(w), 32, 14, { draai: 0.6 });
    w.plaats(D.regenboog(w), -62, -20, { draai: 2 });
    w.plaats(D.regenboog(w), 18, 78, { draai: 1.2 });

    // kristalgrot
    const kristalKleuren = [0xb388ff, 0x80deea, 0xff80ab, 0xa7ffeb];
    w.verspreid((w) => D.kristal(w, w.kies(kristalKleuren)), 30, { regio: { x: -55, z: -62, r: 26 }, afstand: 0.8, schaal: [0.8, 1.8] });
    w.verspreid((w) => D.kristal(w, w.kies(kristalKleuren)), 14, { schaal: [0.8, 1.4] });

    w.verspreid((w) => D.toverboom(w), 75, { afstand: 2, schaal: [0.8, 1.3] });
    w.verspreid((w) => D.paddenstoel(w), 50, { afstand: 1.5, schaal: [0.7, 1.5] });
    w.verspreid((w) => D.struik(w, { bessen: w.kans(0.5) }), 120, { afstand: 0.6, schaal: [0.8, 1.4] });
    w.verspreid((w) => D.steen(w), 30, { afstand: 1 });
    w.verspreid(() => D.lantaarn(), 25, { afstand: 3 });

    D.bloemen(w, 1800, [0xff6fae, 0xffd166, 0xb388ff, 0x80deea, 0xffffff]);
    D.gras(w, 1500, 0x5cb85c);
    D.vuurvliegjes(w, 350, 0xfff59d);
    D.wolken(w, 14);
  },
};
