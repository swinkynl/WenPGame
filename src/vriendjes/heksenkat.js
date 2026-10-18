import { chibi, katOren, heksenhoed } from './chibi.js';
import { bol, groep } from '../hulp/vormen.js';

export default {
  id: 'heksenkat',
  naam: 'Heksje Mimi',
  emoji: '🧙',
  maak() {
    const wit = 0xfaf7f2;
    const { g, kop } = chibi({ kleur: wit, buik: 0xffffff, snuit: 0xffffff, neus: 0xff8fab, oogKleur: 0x2e7d32 });
    katOren(kop, wit);
    heksenhoed(kop);
    const staart = groep(0, 0.3, -0.3);
    for (let i = 0; i < 6; i++) staart.add(bol(wit, 0.07, [0, i * 0.09, -Math.sin(i * 0.5) * 0.15]));
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
