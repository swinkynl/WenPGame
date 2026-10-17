import { bol, cilinder, kegel, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'eenhoorn',
  naam: 'Eenhoorn Sterretje',
  emoji: '🦄',
  maak() {
    const wit = 0xffffff, roze = 0xffc1e3, goud = 0xffd54f;
    const manen = [0xff8fab, 0xffd166, 0x8ce99a, 0x74c0fc, 0xb197fc];
    const g = groep();
    g.add(bol(wit, 0.5, [0, 1.0, 0], [0.8, 0.75, 1.3]));
    for (const [x, z] of [[-0.2, 0.4], [0.2, 0.4], [-0.2, -0.4], [0.2, -0.4]]) {
      g.add(cilinder(wit, 0.09, 0.08, 0.8, [x, 0.42, z], 8));
      g.add(cilinder(0xd0bfff, 0.1, 0.1, 0.1, [x, 0.05, z], 8));
    }
    const nek = cilinder(wit, 0.17, 0.24, 0.6, [0, 1.35, 0.5], 10);
    nek.rotation.x = 0.6;
    g.add(nek);
    // manen langs de nek
    for (let i = 0; i < 6; i++) {
      const t = i / 5;
      g.add(bol(manen[i % 5], 0.14, [0, 1.1 + t * 0.5 + 0.15, 0.33 + t * 0.34 - 0.22]));
    }
    const kop = groep(0, 1.68, 0.68);
    g.add(kop);
    kop.add(bol(wit, 0.25, [0, 0, 0.05], [0.9, 0.95, 1.2]));
    kop.add(bol(roze, 0.15, [0, -0.08, 0.28], [1, 0.8, 0.9]));
    ogen(kop, 0.13, 0.05, 0.2, 0.081, 0x6a1b9a);
    const hoorn = kegel(goud, 0.06, 0.4, [0, 0.3, 0.15], 10, { gloed: 0.4 });
    hoorn.rotation.x = 0.4;
    kop.add(hoorn);
    for (const s of [-1, 1]) kop.add(kegel(wit, 0.06, 0.15, [s * 0.12, 0.25, -0.05], 6));
    const staart = groep(0, 1.1, -0.62);
    for (let i = 0; i < 5; i++) staart.add(bol(manen[i], 0.12, [0, -i * 0.12, -i * 0.05]));
    staart.rotation.x = -0.3;
    g.add(staart);
    g.userData.kop = kop;
    g.userData.staart = staart;
    return g;
  },
};
