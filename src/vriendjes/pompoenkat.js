import { bol, groep } from '../hulp/vormen.js';
import { chibiKop, katOren } from './chibi.js';
import { pompoenBak } from './pompoenbak.js';

// Lapjeskat die uit een pompoen piept
export default {
  id: 'pompoenkat',
  naam: 'Lapje',
  emoji: '🐈',
  maak() {
    const wit = 0xfffaf3, oranje = 0xf2994a, zwart = 0x3a3340;
    const g = groep();
    g.userData.chibi = true;
    pompoenBak(g, 0.58);
    const kop = groep(0, 0.98, 0.02);
    g.add(kop);
    chibiKop(kop, { kleur: wit, neus: 0xff8fab, oogKleur: 0x8a5a1c, dicht: true });
    katOren(kop, wit);
    // lapjes
    kop.add(bol(oranje, 0.2, [-0.24, 0.2, 0.18], [1, 0.8, 0.5], { rand: false }));
    kop.add(bol(zwart, 0.17, [0.26, 0.22, 0.12], [1, 0.8, 0.5], { rand: false }));
    for (const s of [-1, 1]) g.add(bol(wit, 0.09, [s * 0.2, 0.74, 0.46], [1, 0.7, 1.1]));
    g.userData.kop = kop;
    return g;
  },
};
