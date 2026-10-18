import { bol, cilinder, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'krab',
  naam: 'Krab Knijp',
  emoji: '🦀',
  maak() {
    const rood = 0xff7a6b, licht = 0xffc2b5;
    const g = groep();
    g.userData.chibi = true;
    g.add(bol(rood, 0.45, [0, 0.42, 0], [1.25, 0.65, 0.95]));
    g.add(bol(licht, 0.3, [0, 0.35, 0.2], [1.2, 0.5, 0.7]));
    // oogsteeltjes
    const kop = groep(0, 0.65, 0.2);
    g.add(kop);
    for (const s of [-1, 1]) kop.add(cilinder(rood, 0.04, 0.05, 0.3, [s * 0.18, 0.12, 0], 6));
    ogen(kop, 0.18, 0.32, 0.03, 0.12, 0x5a1a1a);
    for (const s of [-1, 1]) {
      // scharen
      const arm = groep(s * 0.5, 0.45, 0.25);
      arm.rotation.z = -s * 0.5;
      arm.add(cilinder(rood, 0.06, 0.07, 0.35, [0, 0.15, 0], 6));
      arm.add(bol(rood, 0.17, [0, 0.38, 0], [0.9, 1.1, 0.7]));
      arm.add(bol(rood, 0.09, [s * -0.08, 0.55, 0], [0.7, 1.2, 0.7]));
      g.add(arm);
      // pootjes
      for (let i = 0; i < 3; i++) {
        const poot = cilinder(rood, 0.03, 0.04, 0.42, [s * 0.55, 0.2, -0.15 + i * 0.15], 5);
        poot.rotation.z = s * 1.0;
        g.add(poot);
      }
    }
    g.userData.kop = kop;
    return g;
  },
};
