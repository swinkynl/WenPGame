import { bol, doos, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'konijn',
  naam: 'Konijn Flappie',
  emoji: '🐰',
  maak() {
    const wit = 0xf7f3ee, roze = 0xffb6c8;
    const g = groep();
    g.add(bol(wit, 0.38, [0, 0.42, 0], [0.95, 0.95, 1.1]));
    g.add(bol(0xffffff, 0.13, [0, 0.42, -0.42]));
    for (const s of [-1, 1]) {
      g.add(bol(wit, 0.13, [s * 0.22, 0.1, 0.1], [0.9, 0.6, 1.6]));
      g.add(bol(wit, 0.08, [s * 0.12, 0.12, 0.33]));
    }
    const kop = groep(0, 0.88, 0.22);
    g.add(kop);
    kop.add(bol(wit, 0.29));
    kop.add(bol(0xffffff, 0.12, [0, -0.09, 0.22], [1.4, 0.8, 0.8]));
    kop.add(bol(roze, 0.04, [0, -0.04, 0.3]));
    kop.add(doos(0xffffff, [0.07, 0.06, 0.02], [0, -0.17, 0.27]));
    ogen(kop, 0.12, 0.05, 0.23, 0.088);
    for (const s of [-1, 1]) {
      const oor = groep(s * 0.1, 0.22, -0.02);
      oor.add(bol(wit, 0.1, [0, 0.26, 0], [0.75, 2.7, 0.45]));
      oor.add(bol(roze, 0.07, [0, 0.26, 0.03], [0.6, 2.4, 0.3]));
      oor.rotation.z = -s * 0.15;
      oor.rotation.x = -0.15;
      kop.add(oor);
    }
    g.userData.kop = kop;
    return g;
  },
};
