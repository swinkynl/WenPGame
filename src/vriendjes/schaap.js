import { bol, cilinder, groep, ogen } from '../hulp/vormen.js';

export default {
  id: 'schaap',
  naam: 'Schaap Wollie',
  emoji: '🐑',
  maak() {
    const wol = 0xfaf6ee, donker = 0x4e4a4a;
    const g = groep();
    g.add(bol(wol, 0.4, [0, 0.72, 0], [1, 0.85, 1.2]));
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.add(bol(wol, 0.26, [Math.cos(a) * 0.3, 0.7 + (i % 2) * 0.12, Math.sin(a) * 0.42]));
    }
    g.add(bol(wol, 0.25, [0, 0.95, 0]));
    g.add(bol(wol, 0.12, [0, 0.8, -0.55]));
    for (const [x, z] of [[-0.18, 0.28], [0.18, 0.28], [-0.18, -0.28], [0.18, -0.28]]) {
      g.add(cilinder(donker, 0.06, 0.06, 0.45, [x, 0.22, z], 6));
    }
    const kop = groep(0, 0.85, 0.5);
    g.add(kop);
    kop.add(bol(donker, 0.21, [0, 0, 0], [0.85, 1, 1.15]));
    ogen(kop, 0.09, 0.05, 0.19, 0.074);
    for (const s of [-1, 1]) kop.add(bol(donker, 0.09, [s * 0.2, 0.03, -0.03], [1.6, 0.5, 0.8]));
    kop.add(bol(wol, 0.12, [0, 0.18, -0.02]));
    kop.add(bol(wol, 0.09, [0.08, 0.16, 0.05]));
    kop.add(bol(wol, 0.09, [-0.08, 0.16, 0.05]));
    g.userData.kop = kop;
    return g;
  },
};
