import { bol, halfbol, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'schildpad',
  naam: 'Schildpad Sloom',
  emoji: '🐢',
  maak() {
    const schild = 0x5fbf7a, huid = 0xa8e6a1;
    const g = groep();
    g.userData.chibi = true;
    g.add(halfbol(schild, 0.6, [0, 0.3, -0.15], [1, 0.6, 1.1]));
    g.add(bol(0xe8f5c8, 0.58, [0, 0.3, -0.05], [1.02, 0.15, 1.12]));
    // zeshoekjes op het schild
    for (const [x, y, z] of [[0, 0.65, -0.15], [0.3, 0.55, 0.05], [-0.3, 0.55, 0.05], [0.3, 0.55, -0.38], [-0.3, 0.55, -0.38], [0, 0.52, 0.25], [0, 0.52, -0.56]]) {
      g.add(bol(0x8fd8a0, 0.13, [x, y, z], [1, 0.35, 1], { rand: false }));
    }
    const kop = groep(0, 0.62, 0.62);
    g.add(kop);
    kop.add(bol(huid, 0.36));
    ogen(kop, 0.15, 0.05, 0.29, 0.12, 0x1d4d2a);
    for (const [x, z, s] of [[-0.45, 0.3, -1], [0.45, 0.3, 1], [-0.4, -0.4, -1], [0.4, -0.4, 1]]) {
      const vin = bol(huid, 0.2, [x, 0.25, z], [1.3, 0.35, 0.8]);
      vin.rotation.y = s * 0.5;
      g.add(vin);
    }
    g.userData.kop = kop;
    return g;
  },
};
