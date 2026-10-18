import { chibi, hondOren, cape } from './chibi.js';
import { bol, kegel } from '../hulp/vormen.js';

export default {
  id: 'vampierhond',
  naam: 'Graaf Woefula',
  emoji: '🧛',
  maak() {
    const bruin = 0x8a5a3c, licht = 0xe9c9a3;
    const { g, kop } = chibi({ kleur: bruin, buik: licht, snuit: licht });
    hondOren(kop, 0x5c3a26);
    cape(g);
    // tandjes
    for (const s of [-1, 1]) {
      const tand = kegel(0xffffff, 0.025, 0.07, [s * 0.05, -0.25, 0.36], 6, { rand: false });
      tand.rotation.x = Math.PI;
      kop.add(tand);
    }
    // vampierkuif
    kop.add(bol(0x2b2233, 0.2, [0, 0.3, 0.08], [1.4, 0.4, 1], { rand: false }));
    return g;
  },
};
