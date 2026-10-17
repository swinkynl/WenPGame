import { bol, kegel, groep } from '../hulp/vormen.js';
import { chibi } from './chibi.js';

export default {
  id: 'vos',
  naam: 'Vosje Rosie',
  emoji: '🦊',
  maak() {
    const oranje = 0xf28c38, wit = 0xffffff, donker = 0x4a3328;
    const { g, kop } = chibi({ kleur: oranje, buik: wit, snuit: wit, oogKleur: 0x3b1f10 });
    for (const s of [-1, 1]) {
      const oor = kegel(oranje, 0.15, 0.32, [s * 0.24, 0.38, -0.03], 8);
      oor.rotation.z = -s * 0.3;
      kop.add(oor);
      const punt = kegel(donker, 0.07, 0.12, [s * 0.27, 0.48, -0.03], 8);
      punt.rotation.z = -s * 0.3;
      kop.add(punt);
      const binnen = kegel(wit, 0.08, 0.18, [s * 0.24, 0.36, 0.03], 8);
      binnen.rotation.z = -s * 0.3;
      kop.add(binnen);
      kop.add(bol(wit, 0.16, [s * 0.2, -0.13, 0.22], [1.2, 0.8, 0.8]));
      g.add(bol(donker, 0.09, [s * 0.16, 0.06, 0.24], [1, 0.6, 0.8], { rand: false }));
    }
    const staart = groep(0, 0.35, -0.3);
    staart.add(bol(oranje, 0.2, [0, 0.15, -0.12], [0.85, 1.3, 0.85]));
    staart.add(bol(wit, 0.13, [0, 0.4, -0.18]));
    staart.rotation.x = -0.7;
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
