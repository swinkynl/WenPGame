import { bol, cilinder, kegel, doos, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'kip',
  naam: 'Kip Tok',
  emoji: '🐔',
  maak() {
    const wit = 0xffffff, rood = 0xe53935, geel = 0xffc107;
    const g = groep();
    g.add(bol(wit, 0.32, [0, 0.5, 0], [0.9, 0.95, 1.1]));
    const staart = groep(0, 0.7, -0.3);
    for (const [x, rz] of [[-0.07, 0.3], [0, 0], [0.07, -0.3]]) {
      const veer = bol(wit, 0.12, [x, 0.06, -0.03], [0.4, 1.2, 0.8]);
      veer.rotation.set(-0.4, 0, rz);
      staart.add(veer);
    }
    g.add(staart);
    for (const s of [-1, 1]) {
      g.add(bol(0xf2f2f2, 0.18, [s * 0.27, 0.5, -0.03], [0.35, 0.75, 1.1]));
      g.add(cilinder(geel, 0.025, 0.025, 0.25, [s * 0.1, 0.13, 0], 6));
      g.add(doos(geel, [0.12, 0.03, 0.14], [s * 0.1, 0.015, 0.05]));
    }
    const kop = groep(0, 0.88, 0.17);
    g.add(kop);
    kop.add(bol(wit, 0.19));
    for (let i = 0; i < 3; i++) kop.add(bol(rood, 0.06 + (i === 1 ? 0.015 : 0), [0, 0.19 + (i === 1 ? 0.02 : 0), -0.06 + i * 0.06]));
    const snavel = kegel(geel, 0.05, 0.12, [0, -0.02, 0.22], 6);
    snavel.rotation.x = Math.PI / 2;
    kop.add(snavel);
    kop.add(bol(rood, 0.04, [0, -0.1, 0.18], [0.8, 1.4, 0.8]));
    ogen(kop, 0.09, 0.05, 0.15, 0.061);
    g.userData.kop = kop;
    g.userData.staart = staart;
    return g;
  },
};
