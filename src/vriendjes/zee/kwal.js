import { bol, halfbol, schijf, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'kwal',
  naam: 'Kwalletje Glim',
  emoji: '🪼',
  zweef: 1.0,
  maak() {
    const lila = 0xe1b8ff, roze = 0xffc6ee;
    const g = groep();
    g.userData.chibi = true;
    g.add(halfbol(lila, 0.55, [0, 1.5, 0], [1, 1.1, 1], { gloed: 0.25 }));
    const onder = schijf(roze, 0.54, [0, 1.5, 0], { vlak: false });
    onder.rotation.x = Math.PI / 2;
    g.add(onder);
    ogen(g, 0.2, 1.7, 0.43, 0.12, 0x5a2a8a);
    // tentakels
    const tentakels = groep(0, 1.5, 0);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      for (let k = 0; k < 6; k++) {
        tentakels.add(bol(k % 2 ? lila : roze, 0.06 - k * 0.005, [Math.cos(a) * 0.32 + Math.sin(k * 0.9 + i) * 0.05, -0.1 - k * 0.13, Math.sin(a) * 0.32], [1, 1, 1], { gloed: 0.2 }));
      }
    }
    g.add(tentakels);
    g.userData.staart = tentakels;
    return g;
  },
};
