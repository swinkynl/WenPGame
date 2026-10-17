import { bol, cilinder, kegel, torus, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'kikker',
  naam: 'Kikker Prins',
  emoji: '🐸',
  maak() {
    const groen = 0x66bb6a, licht = 0xc5e1a5, goud = 0xffd54f;
    const g = groep();
    g.add(bol(groen, 0.42, [0, 0.33, 0], [1.1, 0.75, 1]));
    g.add(bol(licht, 0.3, [0, 0.27, 0.17], [1.1, 0.65, 0.9]));
    for (const s of [-1, 1]) {
      g.add(bol(groen, 0.2, [s * 0.36, 0.15, -0.1], [0.8, 0.6, 1.3]));
      g.add(bol(groen, 0.12, [s * 0.4, 0.03, 0.15], [1.2, 0.3, 1.4]));
      g.add(bol(groen, 0.08, [s * 0.2, 0.08, 0.32]));
    }
    const kop = groep();
    g.add(kop);
    for (const s of [-1, 1]) kop.add(bol(groen, 0.14, [s * 0.18, 0.6, 0.18]));
    ogen(kop, 0.18, 0.62, 0.25, 0.121);
    const mond = torus(0xb71c1c, 0.2, 0.02, [0, 0.4, 0.37], Math.PI);
    mond.rotation.z = Math.PI;
    kop.add(mond);
    // kroontje
    const kroon = groep(0, 0.7, 0.02);
    kroon.add(cilinder(goud, 0.13, 0.12, 0.1, [0, 0, 0], 12, { gloed: 0.2 }));
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      kroon.add(kegel(goud, 0.035, 0.1, [Math.cos(a) * 0.115, 0.09, Math.sin(a) * 0.115], 6, { gloed: 0.2 }));
    }
    kroon.add(bol(0xe91e63, 0.03, [0, 0.01, 0.125]));
    kop.add(kroon);
    return g;
  },
};
