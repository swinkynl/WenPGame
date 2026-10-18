import { bol, kegel, groep } from '../hulp/vormen.js';
import { chibiKop } from './chibi.js';
import { pompoenBak } from './pompoenbak.js';

export default {
  id: 'pompoencorgi',
  naam: 'Corgi Pompoen',
  emoji: '🎃',
  maak() {
    const oranje = 0xf2a254, wit = 0xffffff;
    const g = groep();
    g.userData.chibi = true;
    pompoenBak(g);
    const kop = groep(0, 1.05, 0.02);
    g.add(kop);
    chibiKop(kop, { kleur: oranje, snuit: wit });
    kop.add(bol(wit, 0.12, [0, 0.12, 0.33], [0.8, 1.6, 0.5])); // witte bles
    for (const s of [-1, 1]) {
      const oor = kegel(oranje, 0.15, 0.32, [s * 0.27, 0.38, -0.02], 8);
      oor.rotation.z = -s * 0.3;
      kop.add(oor);
      g.add(bol(wit, 0.1, [s * 0.22, 0.8, 0.5], [1, 0.7, 1.1])); // pootjes op de rand
    }
    g.userData.kop = kop;
    return g;
  },
};
