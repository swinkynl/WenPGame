import { bol, cilinder, kegel, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'koe',
  naam: 'Koe Bella',
  emoji: '🐮',
  maak() {
    const wit = 0xfbfbfb, zwart = 0x2b2b2b, roze = 0xffc1cc;
    const g = groep();
    g.add(bol(wit, 0.5, [0, 0.95, 0], [1, 0.85, 1.5]));
    for (const [x, y, z, r] of [[0.42, 1.0, 0.2, 0.24], [-0.4, 0.95, -0.3, 0.26], [0.25, 1.25, -0.42, 0.22], [-0.28, 1.22, 0.38, 0.18]]) {
      g.add(bol(zwart, r, [x, y, z], [0.7, 1, 1]));
    }
    for (const [x, z] of [[-0.25, 0.45], [0.25, 0.45], [-0.25, -0.45], [0.25, -0.45]]) {
      g.add(cilinder(wit, 0.11, 0.1, 0.65, [x, 0.33, z], 8));
      g.add(cilinder(zwart, 0.11, 0.11, 0.1, [x, 0.05, z], 8));
    }
    g.add(bol(roze, 0.13, [0, 0.58, -0.25]));
    g.add(bol(0xffd54f, 0.09, [0, 1.0, 0.98]));

    const kop = groep(0, 1.3, 0.82);
    g.add(kop);
    kop.add(bol(wit, 0.3, [0, 0, 0], [1, 1, 1.1]));
    kop.add(bol(roze, 0.2, [0, -0.13, 0.26], [1.25, 0.85, 0.9]));
    ogen(kop, 0.14, 0.1, 0.25, 0.065);
    kop.add(bol(zwart, 0.1, [0, 0.27, 0.08], [1.2, 0.6, 1]));
    for (const s of [-1, 1]) {
      kop.add(bol(0xd88a9a, 0.035, [s * 0.08, -0.12, 0.43]));
      const hoorn = kegel(0xf3e5c0, 0.05, 0.2, [s * 0.17, 0.3, -0.02], 8);
      hoorn.rotation.z = -s * 0.5;
      kop.add(hoorn);
      kop.add(bol(zwart, 0.12, [s * 0.32, 0.08, -0.05], [1.4, 0.6, 0.8]));
    }
    const staart = groep(0, 1.2, -0.72);
    staart.add(cilinder(wit, 0.025, 0.025, 0.6, [0, -0.3, 0], 6));
    staart.add(bol(zwart, 0.07, [0, -0.62, 0]));
    staart.rotation.x = 0.3;
    g.add(staart);
    g.userData.kop = kop;
    g.userData.staart = staart;
    return g;
  },
};
