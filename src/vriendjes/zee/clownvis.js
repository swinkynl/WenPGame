import { bol, torus, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'clownvis',
  naam: 'Clownvisje Nemo',
  emoji: '🐠',
  zweef: 0.5,
  maak() {
    const oranje = 0xff8c2a, wit = 0xffffff;
    const g = groep();
    g.userData.chibi = true;
    g.add(bol(oranje, 0.45, [0, 0.9, 0], [0.7, 0.85, 1.15]));
    for (const z of [0.18, -0.25]) {
      const ring = torus(wit, 1, 0.09, [0, 0.9, z]);
      const f = Math.sqrt(1 - (z / 0.5175) ** 2);
      ring.scale.set(0.315 * f, 0.3825 * f, 0.3);
      g.add(ring);
    }
    ogen(g, 0.17, 0.98, 0.4, 0.11, 0x1a1a2e);
    g.add(bol(0xe0552a, 0.05, [0, 0.8, 0.48], [1.3, 0.7, 0.6], { rand: false }));
    const vin = bol(oranje, 0.18, [0, 1.3, -0.05], [0.25, 0.8, 1.2]);
    g.add(vin);
    for (const s of [-1, 1]) {
      const zij = bol(oranje, 0.12, [s * 0.3, 0.8, 0.1], [0.3, 0.6, 1]);
      zij.rotation.y = s * 0.5;
      g.add(zij);
    }
    const staart = groep(0, 0.9, -0.5);
    staart.add(bol(oranje, 0.22, [0, 0, -0.12], [0.25, 1, 0.8]));
    staart.add(bol(wit, 0.08, [0, 0, -0.3], [0.3, 1.6, 0.6]));
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
