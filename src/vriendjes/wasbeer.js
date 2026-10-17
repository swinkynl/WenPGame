import { bol, kegel, groep } from '../hulp/vormen.js';
import { chibi } from './chibi.js';

export default {
  id: 'wasbeer',
  naam: 'Wasbeer Wiebel',
  emoji: '🦝',
  maak() {
    const grijs = 0xa3a3ad, licht = 0xeeeef2, donker = 0x4b4b57;
    const { g, kop } = chibi({ kleur: grijs, buik: licht, snuit: 0xf4f4f7 });
    for (const s of [-1, 1]) {
      // maskertje rond de ogen
      kop.add(bol(donker, 0.15, [s * 0.18, 0.0, 0.34], [1.35, 0.85, 0.35], { rand: false }));
      const oor = kegel(grijs, 0.13, 0.2, [s * 0.27, 0.36, -0.02], 8);
      oor.rotation.z = -s * 0.4;
      kop.add(oor);
      const binnen = kegel(licht, 0.07, 0.12, [s * 0.27, 0.35, 0.04], 8);
      binnen.rotation.z = -s * 0.4;
      kop.add(binnen);
    }
    // gestreepte pluimstaart
    const staart = groep(0, 0.32, -0.32);
    for (let i = 0; i < 6; i++) staart.add(bol(i % 2 ? donker : grijs, 0.14 - i * 0.006, [0, i * 0.09, -0.06 - i * 0.07]));
    staart.rotation.x = -0.5;
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
