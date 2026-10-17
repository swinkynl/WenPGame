import { bol, doos, groep } from '../hulp/vormen.js';
import { chibi } from './chibi.js';

export default {
  id: 'bever',
  naam: 'Bever Bas',
  emoji: '🦫',
  maak() {
    const bruin = 0xa0714f, licht = 0xdcb48e;
    const { g, kop } = chibi({ kleur: bruin, buik: licht, snuit: 0xe8c9a6, dicht: true });
    for (const s of [-1, 1]) {
      kop.add(bol(bruin, 0.08, [s * 0.3, 0.3, 0]));
      kop.add(doos(0xffffff, [0.05, 0.08, 0.03], [s * 0.028, -0.27, 0.36], { rand: false }));
    }
    // platte staart
    const staart = groep(0, 0.1, -0.35);
    staart.add(bol(0x6b4a3a, 0.25, [0, 0, -0.15], [0.7, 0.18, 1.1]));
    for (const z of [-0.05, -0.15, -0.25]) staart.add(doos(0x523629, [0.28, 0.02, 0.02], [0, 0.045, z], { rand: false }));
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
