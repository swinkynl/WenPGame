import { bol, halfbol, kegel, groep } from '../hulp/vormen.js';
import { chibi } from './chibi.js';

export default {
  id: 'eekhoorn',
  naam: 'Eekhoorn Nootje',
  emoji: '🐿️',
  maak() {
    const oranje = 0xd8743a, room = 0xffe2c4;
    const { g, kop } = chibi({ kleur: oranje, buik: room, snuit: room });
    for (const s of [-1, 1]) {
      const oor = kegel(oranje, 0.09, 0.22, [s * 0.25, 0.38, 0], 8);
      oor.rotation.z = -s * 0.2;
      kop.add(oor);
      const pluimpje = kegel(0xa8532a, 0.04, 0.12, [s * 0.27, 0.52, 0], 6);
      pluimpje.rotation.z = -s * 0.2;
      kop.add(pluimpje);
    }
    // grote krulstaart
    const staart = groep(0, 0.28, -0.3);
    for (const [y, z, r] of [[0.05, -0.12, 0.16], [0.22, -0.28, 0.19], [0.42, -0.36, 0.21], [0.62, -0.34, 0.21], [0.8, -0.24, 0.19], [0.92, -0.08, 0.16], [0.9, 0.05, 0.13]]) {
      staart.add(bol(oranje, r, [0, y, z]));
    }
    g.add(staart);
    // eikeltje in de pootjes
    g.add(bol(0x9b6b3d, 0.07, [0, 0.5, 0.32], [1, 1.15, 1]));
    g.add(halfbol(0x6b4a2a, 0.075, [0, 0.54, 0.32]));
    g.userData.staart = staart;
    return g;
  },
};
