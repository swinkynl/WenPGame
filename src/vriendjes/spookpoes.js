import { bol, kegel, groep, ogen } from '../hulp/vormen.js';

// Een poesje onder een spooklaken (de oortjes steken erdoor)
export default {
  id: 'spookpoes',
  naam: 'Spookje Boe',
  emoji: '👻',
  maak() {
    const laken = 0xfbfbff;
    const g = groep();
    g.userData.chibi = true;
    g.add(kegel(laken, 0.6, 1.0, [0, 0.5, 0], 18));
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      g.add(bol(laken, 0.16, [Math.cos(a) * 0.52, 0.06, Math.sin(a) * 0.52], [1, 0.6, 1]));
    }
    const kop = groep(0, 1.0, 0);
    g.add(kop);
    kop.add(bol(laken, 0.48, [0, 0, 0], [1, 1.05, 1]));
    for (const s of [-1, 1]) {
      const oor = kegel(laken, 0.13, 0.24, [s * 0.27, 0.42, 0], 8);
      oor.rotation.z = -s * 0.35;
      kop.add(oor);
    }
    ogen(kop, 0.17, 0.02, 0.42, 0.11, 0x1a1a2e);
    kop.add(bol(0x3a2a3a, 0.05, [0, -0.17, 0.46], [1.2, 0.8, 0.5], { rand: false }));
    // armpjes onder het laken
    for (const s of [-1, 1]) g.add(bol(laken, 0.13, [s * 0.5, 0.65, 0.12], [0.8, 1.3, 0.8]));
    g.userData.kop = kop;
    return g;
  },
};
