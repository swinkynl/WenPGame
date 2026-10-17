import { bol, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'beer',
  naam: 'Beer Bruno',
  emoji: '🐻',
  maak() {
    const bruin = 0xa47148, licht = 0xe3c19b, donker = 0x3e2723, rood = 0xe53935;
    const g = groep();
    g.add(bol(bruin, 0.42, [0, 0.5, 0], [1, 1.05, 0.9]));
    g.add(bol(licht, 0.3, [0, 0.45, 0.17], [0.9, 0.95, 0.7]));
    for (const s of [-1, 1]) {
      const arm = bol(bruin, 0.13, [s * 0.38, 0.6, 0.12], [0.8, 1.5, 0.8]);
      arm.rotation.z = s * 0.3;
      g.add(arm);
      g.add(bol(bruin, 0.17, [s * 0.2, 0.17, 0.28], [0.9, 0.8, 1.2]));
      g.add(bol(licht, 0.1, [s * 0.2, 0.17, 0.46], [1, 1, 0.4]));
      g.add(bol(rood, 0.08, [s * 0.09, 0.8, 0.31], [1.2, 0.8, 0.5]));
    }
    g.add(bol(rood, 0.045, [0, 0.8, 0.33]));
    const kop = groep(0, 1.05, 0.05);
    g.add(kop);
    kop.add(bol(bruin, 0.33));
    kop.add(bol(licht, 0.14, [0, -0.08, 0.27], [1.2, 0.9, 0.9]));
    kop.add(bol(donker, 0.055, [0, -0.03, 0.39], [1.3, 0.9, 1]));
    ogen(kop, 0.13, 0.08, 0.27, 0.055);
    for (const s of [-1, 1]) {
      kop.add(bol(bruin, 0.12, [s * 0.24, 0.26, -0.02]));
      kop.add(bol(licht, 0.07, [s * 0.24, 0.26, 0.05], [1, 1, 0.5]));
    }
    g.userData.kop = kop;
    return g;
  },
};
