import { bol, cilinder, kegel, torus, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'varken',
  naam: 'Biggetje Knor',
  emoji: '🐷',
  maak() {
    const roze = 0xffb3c6, donker = 0xf28aa8;
    const g = groep();
    g.add(bol(roze, 0.45, [0, 0.55, 0], [0.95, 0.85, 1.25]));
    for (const [x, z] of [[-0.2, 0.3], [0.2, 0.3], [-0.2, -0.3], [0.2, -0.3]]) {
      g.add(cilinder(roze, 0.09, 0.09, 0.32, [x, 0.16, z], 8));
      g.add(cilinder(0xc76b86, 0.095, 0.095, 0.06, [x, 0.03, z], 8));
    }
    const kop = groep(0, 0.72, 0.55);
    g.add(kop);
    kop.add(bol(roze, 0.33, [0, 0, 0], [1, 0.95, 0.95]));
    const snuit = cilinder(donker, 0.14, 0.15, 0.12, [0, -0.05, 0.32], 14);
    snuit.rotation.x = Math.PI / 2;
    kop.add(snuit);
    for (const s of [-1, 1]) {
      kop.add(bol(0x9c4a64, 0.03, [s * 0.05, -0.05, 0.385]));
      const oor = kegel(roze, 0.12, 0.22, [s * 0.2, 0.27, 0.05], 8);
      oor.rotation.set(0.6, 0, -s * 0.4);
      kop.add(oor);
    }
    ogen(kop, 0.14, 0.1, 0.26, 0.06);
    const staart = groep(0, 0.62, -0.56);
    const krul = torus(donker, 0.08, 0.025);
    krul.rotation.y = Math.PI / 2;
    staart.add(krul);
    g.add(staart);
    g.userData.kop = kop;
    g.userData.staart = staart;
    return g;
  },
};
