import { bol, cilinder, kegel, doos, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'kat',
  naam: 'Poes Minoes',
  emoji: '🐱',
  maak() {
    const oranje = 0xf4a259, licht = 0xfde4c3, roze = 0xff8fab;
    const g = groep();
    g.add(bol(oranje, 0.4, [0, 0.55, 0], [0.85, 0.8, 1.2]));
    g.add(bol(licht, 0.28, [0, 0.5, 0.18], [0.8, 0.75, 0.9]));
    for (const [x, z] of [[-0.17, 0.27], [0.17, 0.27], [-0.17, -0.27], [0.17, -0.27]]) {
      g.add(cilinder(oranje, 0.075, 0.075, 0.4, [x, 0.2, z], 8));
      g.add(bol(licht, 0.09, [x, 0.03, z + 0.03], [1, 0.6, 1.2]));
    }
    const kop = groep(0, 0.98, 0.36);
    g.add(kop);
    kop.add(bol(oranje, 0.33, [0, 0, 0], [1.05, 0.95, 1]));
    kop.add(bol(licht, 0.15, [0, -0.1, 0.24], [1.3, 0.8, 0.8]));
    kop.add(bol(roze, 0.045, [0, -0.04, 0.34]));
    ogen(kop, 0.13, 0.06, 0.27, 0.07, 0x2e7d32);
    for (const s of [-1, 1]) {
      const oor = kegel(oranje, 0.12, 0.26, [s * 0.18, 0.3, 0], 8);
      oor.rotation.z = -s * 0.35;
      kop.add(oor);
      const binnen = kegel(roze, 0.07, 0.16, [s * 0.18, 0.29, 0.05], 8);
      binnen.rotation.z = -s * 0.35;
      kop.add(binnen);
      for (const h of [-0.03, 0.03]) {
        const snor = doos(0xffffff, [0.3, 0.012, 0.012], [s * 0.25, -0.08 + h, 0.25]);
        snor.rotation.z = s * h * 4;
        kop.add(snor);
      }
    }
    const staart = groep(0, 0.55, -0.42);
    g.add(staart);
    for (let i = 0; i < 7; i++) staart.add(bol(i === 6 ? licht : oranje, 0.075, [0, i * 0.1, -Math.sin(i * 0.45) * 0.18]));
    g.userData.kop = kop;
    g.userData.staart = staart;
    return g;
  },
};
