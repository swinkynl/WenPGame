import { bol, kegel, groep } from '../hulp/vormen.js';
import { chibi } from './chibi.js';

export default {
  id: 'wolf',
  naam: 'Wolfje Woef',
  emoji: '🐺',
  maak() {
    const grijs = 0xaab1c0, licht = 0xf1f3f7;
    const { g, kop } = chibi({ kleur: grijs, buik: licht, snuit: licht, dicht: true });
    for (const s of [-1, 1]) {
      const oor = kegel(grijs, 0.14, 0.3, [s * 0.25, 0.4, -0.03], 8);
      oor.rotation.z = -s * 0.25;
      kop.add(oor);
      const binnen = kegel(0xdcc8d2, 0.07, 0.17, [s * 0.25, 0.37, 0.04], 8);
      binnen.rotation.z = -s * 0.25;
      kop.add(binnen);
      // pluizige wangetjes
      const wang = kegel(grijs, 0.09, 0.22, [s * 0.47, -0.08, 0], 6);
      wang.rotation.z = -s * (Math.PI / 2 + 0.3);
      kop.add(wang);
    }
    const kuif = kegel(grijs, 0.07, 0.18, [0, 0.4, 0.12], 6);
    kuif.rotation.x = 0.5;
    kop.add(kuif);
    const staart = groep(0, 0.4, -0.3);
    staart.add(bol(grijs, 0.16, [0, 0.12, -0.1], [0.9, 1.4, 0.9]));
    staart.add(bol(licht, 0.12, [0, 0.33, -0.18]));
    staart.rotation.x = -0.6;
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
