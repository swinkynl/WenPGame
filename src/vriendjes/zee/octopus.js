import { bol, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'octopus',
  naam: 'Octopus Krul',
  emoji: '🐙',
  maak() {
    const roze = 0xff9ecb, licht = 0xffd1e6;
    const g = groep();
    g.userData.chibi = true;
    const kop = groep(0, 0.95, 0);
    g.add(kop);
    kop.add(bol(roze, 0.5, [0, 0, 0], [1, 1.05, 0.95]));
    for (const [x, y, z] of [[-0.25, 0.3, 0.2], [0.2, 0.38, 0.1], [0.32, 0.12, -0.25], [-0.35, 0.05, -0.2]]) {
      kop.add(bol(licht, 0.06, [x, y, z], [1, 1, 0.5], { rand: false }));
    }
    ogen(kop, 0.2, -0.02, 0.4, 0.13, 0x6a1b4d);
    // acht krullende armpjes
    const armen = groep(0, 0.32, 0);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      for (let k = 0; k < 6; k++) {
        const d = 0.38 + k * 0.13, y = -0.07 * k + Math.max(0, k - 3) * 0.12;
        armen.add(bol(roze, 0.12 - k * 0.012, [Math.cos(a) * d, y, Math.sin(a) * d]));
      }
    }
    g.add(armen);
    g.userData.kop = kop;
    return g;
  },
};
