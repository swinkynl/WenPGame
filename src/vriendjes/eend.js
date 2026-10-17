import { bol, cilinder, kegel, doos, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'eend',
  naam: 'Eend Kwak',
  emoji: '🦆',
  maak() {
    const wit = 0xffffff, oranje = 0xff9f1c, grijs = 0xeeeeee;
    const g = groep();
    g.add(bol(wit, 0.38, [0, 0.45, 0], [0.9, 0.8, 1.15]));
    for (const s of [-1, 1]) {
      g.add(bol(grijs, 0.22, [s * 0.3, 0.5, -0.05], [0.35, 0.7, 1.1]));
      g.add(cilinder(oranje, 0.03, 0.03, 0.18, [s * 0.12, 0.1, 0.02], 6));
      g.add(doos(oranje, [0.16, 0.04, 0.22], [s * 0.12, 0.02, 0.1]));
    }
    const staart = groep(0, 0.6, -0.4);
    const punt = kegel(wit, 0.14, 0.3, [0, 0, 0], 8);
    punt.rotation.x = -0.9;
    staart.add(punt);
    g.add(staart);
    const kop = groep(0, 0.9, 0.25);
    g.add(kop);
    kop.add(bol(wit, 0.24));
    kop.add(bol(oranje, 0.13, [0, -0.04, 0.24], [0.9, 0.35, 1.2]));
    kop.add(bol(wit, 0.07, [0, 0.24, 0.02], [0.6, 1.4, 0.6]));
    ogen(kop, 0.1, 0.06, 0.19, 0.074);
    g.userData.kop = kop;
    g.userData.staart = staart;
    return g;
  },
};
