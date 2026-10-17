// Het Bos: heuvels vol dennen, berken, boomstammen en bosdiertjes.
import * as D from '../decor.js';

export default {
  id: 'bos',
  naam: 'Het Bos',
  emoji: '🌲',
  beschrijving: 'Heuvels, bomen en bosdiertjes',
  kaartKleuren: ['#4fae6a', '#a8d86e'],
  grootte: 220,
  zichtAfstand: 130,
  zaadje: 33,
  kleuren: {
    luchtBoven: 0x7fb8ff,
    luchtHorizon: 0xe2f4dc,
    mist: 0xe4f2dc,
    grond: 0x8ccc6c,
    grond2: 0x73b85e,
    hemelLicht: 0xf4fff0,
  },
  vriendjes: ['wasbeer', 'wolf', 'hert', 'bever', 'vos', 'egel', 'eekhoorn', 'beer', 'uil'],

  // Heuvels: hoogte van de grond op plek (x, z). Rond de start is het vlak.
  hoogte(x, z) {
    const vlak = Math.min(1, Math.max(0, (Math.hypot(x, z) - 10) / 25));
    const h = 3.5 * Math.sin(x * 0.028 + 0.5) * Math.cos(z * 0.031)
      + 2.2 * Math.sin(x * 0.061 + 2.1) * Math.sin(z * 0.054 + 1.3)
      + 1.0 * Math.cos((x + z) * 0.08);
    return (h + 3) * vlak * 1.4;
  },

  bouw(w) {
    D.omheining(w, 'bomen');

    const zand = 0xc9a77a;
    D.pad(w, [[0, 0], [6, 10], [11, 14]], 2.2, zand);
    D.pad(w, [[0, 0], [-15, -25], [-45, -45], [-55, -50]], 2.2, zand);
    D.pad(w, [[0, 0], [25, -10], [60, -5], [85, 20]], 2.2, zand);
    D.pad(w, [[0, 0], [-20, 20], [-40, 55]], 2.2, zand);

    w.plaats(D.blokhut(w), 15, 19, { draai: Math.atan2(-15, -19) });
    w.plaats(D.blokhut(w), -62, -57, { draai: Math.atan2(62, 57) });

    w.verspreid((w) => D.rotsblok(w), 14, { afstand: 2 });
    w.verspreid((w) => D.boomstam(w), 22, { afstand: 1.5 });
    w.verspreid((w) => D.boomstronk(w), 30, { afstand: 1 });
    w.verspreid((w) => D.dennenboom(w), 120, { afstand: 1.5, schaal: [0.9, 1.6] });
    w.verspreid((w) => D.boom(w, { kroon: [0x7cc46a, 0x8fd17a, 0x6db85e, 0xf2b84b, 0xf39a4b] }), 50, { afstand: 1.5, schaal: [0.9, 1.4] });
    w.verspreid((w) => D.berk(w), 35, { afstand: 1.2, schaal: [0.9, 1.3] });
    w.verspreid((w) => D.varen(w), 110, { afstand: 0.3, schaal: [0.8, 1.3] });
    w.verspreid((w) => D.struik(w, { bessen: w.kans(0.4) }), 50, { afstand: 0.6, schaal: [0.8, 1.4] });
    w.verspreid((w) => D.paddenstoeltjes(w), 50, { afstand: 0.3 });
    w.verspreid((w) => D.paddenstoel(w), 12, { afstand: 1, schaal: [0.6, 1] });
    w.verspreid((w) => D.steen(w), 30, { afstand: 1 });

    D.bloemen(w, 600, [0xffffff, 0xfff176, 0xb39ddb, 0xff8fab]);
    D.gras(w, 2000, 0x5aa84a);
    D.vuurvliegjes(w, 150, 0xfff59d);
    D.wolken(w, 12);
  },
};
