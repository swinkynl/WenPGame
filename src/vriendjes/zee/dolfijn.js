import { bol, kegel, torus, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'dolfijn',
  naam: 'Dolfijn Spetter',
  emoji: '🐬',
  zweef: 0.7,
  maak() {
    const blauw = 0x5ec4e8, licht = 0xe4f8ff;
    const g = groep();
    g.userData.chibi = true;
    g.add(bol(blauw, 0.5, [0, 0.9, 0], [0.7, 0.75, 1.5]));
    g.add(bol(licht, 0.4, [0, 0.75, 0.2], [0.7, 0.6, 1.4]));
    g.add(bol(blauw, 0.15, [0, 0.78, 0.78], [0.9, 0.7, 1.4]));
    ogen(g, 0.2, 0.98, 0.56, 0.12, 0x12406a);
    const mond = torus(0x12406a, 0.1, 0.018, [0, 0.8, 0.72], Math.PI, { rand: false });
    mond.rotation.z = Math.PI;
    g.add(mond);
    const rugvin = kegel(blauw, 0.15, 0.4, [0, 1.35, -0.1], 8);
    rugvin.rotation.x = -0.5;
    rugvin.scale.x = 0.05;
    g.add(rugvin);
    for (const s of [-1, 1]) {
      const vin = bol(blauw, 0.2, [s * 0.36, 0.7, 0.25], [1, 0.25, 0.6]);
      vin.rotation.z = -s * 0.6;
      g.add(vin);
    }
    const staart = groep(0, 0.95, -0.75);
    for (const s of [-1, 1]) {
      const vin = bol(blauw, 0.22, [s * 0.18, 0, -0.1], [1.3, 0.25, 0.7]);
      vin.rotation.y = s * 0.4;
      staart.add(vin);
    }
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
