import { bol, torus, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'walvis',
  naam: 'Walvis Wolkje',
  emoji: '🐳',
  zweef: 0.6,
  maak() {
    const blauw = 0x6fb6f0, licht = 0xdff2ff;
    const g = groep();
    g.userData.chibi = true;
    g.add(bol(blauw, 0.8, [0, 0.9, 0], [1, 0.85, 1.2]));
    g.add(bol(licht, 0.62, [0, 0.66, 0.25], [1, 0.7, 1.15]));
    ogen(g, 0.32, 1.0, 0.84, 0.16, 0x1d3f7a);
    const mond = torus(0x1d3f7a, 0.12, 0.022, [0, 0.78, 0.92], Math.PI, { rand: false });
    mond.rotation.z = Math.PI;
    g.add(mond);
    for (const s of [-1, 1]) {
      const vin = bol(blauw, 0.3, [s * 0.75, 0.6, 0.2], [1, 0.25, 0.6]);
      vin.rotation.z = -s * 0.5;
      g.add(vin);
    }
    // waterfonteintje
    for (const [x, y] of [[0, 1.7], [-0.12, 1.85], [0.12, 1.85]]) g.add(bol(0x9be7ff, 0.08, [x, y, 0.1], [1, 1, 1], { rand: false, gloed: 0.3 }));
    const staart = groep(0, 1.0, -0.95);
    for (const s of [-1, 1]) {
      const vin = bol(blauw, 0.3, [s * 0.25, 0.15, -0.15], [1.4, 0.3, 0.8]);
      vin.rotation.z = s * 0.4;
      staart.add(vin);
    }
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
