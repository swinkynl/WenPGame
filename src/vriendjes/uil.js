import { bol, kegel, groep } from '../hulp/vormen.js';

export default {
  id: 'uil',
  naam: 'Uil Oehoe',
  emoji: '🦉',
  maak() {
    const bruin = 0x8d6e63, licht = 0xd7ccc8, oranje = 0xffa726, geel = 0xffd54f;
    const g = groep();
    g.add(bol(bruin, 0.4, [0, 0.55, 0], [1, 1.25, 0.95]));
    g.add(bol(licht, 0.3, [0, 0.45, 0.15], [0.9, 1.1, 0.8]));
    for (const s of [-1, 1]) {
      g.add(bol(0x795548, 0.2, [s * 0.38, 0.55, -0.02], [0.35, 1, 0.8]));
      g.add(bol(oranje, 0.06, [s * 0.1, 0.06, 0.2], [1.2, 0.5, 1.4]));
    }
    // de kop draait (zoals een echte uil)
    const kop = groep();
    g.add(kop);
    for (const s of [-1, 1]) {
      kop.add(bol(licht, 0.15, [s * 0.14, 0.82, 0.27], [1, 1, 0.5]));
      kop.add(bol(geel, 0.1, [s * 0.14, 0.82, 0.31]));
      kop.add(bol(0x222222, 0.06, [s * 0.14, 0.82, 0.38]));
      kop.add(bol(0xffffff, 0.02, [s * 0.14 + 0.02, 0.85, 0.44]));
      const pluim = kegel(bruin, 0.07, 0.22, [s * 0.2, 1.08, 0.05], 6);
      pluim.rotation.z = -s * 0.4;
      kop.add(pluim);
    }
    const snavel = kegel(oranje, 0.04, 0.12, [0, 0.72, 0.38], 6);
    snavel.rotation.x = Math.PI;
    kop.add(snavel);
    g.userData.kop = kop;
    return g;
  },
};
