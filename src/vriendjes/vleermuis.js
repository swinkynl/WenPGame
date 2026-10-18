import { bol, kegel, groep } from '../hulp/vormen.js';
import { chibi } from './chibi.js';

// Vleermuisje dat een beetje boven de grond fladdert
export default {
  id: 'vleermuis',
  naam: 'Vleermuisje Flap',
  emoji: '🦇',
  zweef: 1.0, // hangt in de lucht
  maak() {
    const paars = 0x6e5a8a, vleugel = 0x4b3d63;
    const { g, kop } = chibi({ kleur: paars, buik: 0xb9a6d6, snuit: 0xb9a6d6, oogKleur: 0x9b1b30 });
    for (const s of [-1, 1]) {
      const oor = kegel(paars, 0.16, 0.34, [s * 0.27, 0.38, -0.02], 8);
      oor.rotation.z = -s * 0.4;
      kop.add(oor);
    }
    // vleugels (draaien om de schouder)
    const vleugels = [];
    for (const s of [-1, 1]) {
      const v = groep(s * 0.3, 0.55, -0.05);
      v.add(bol(vleugel, 0.35, [s * 0.35, 0.05, 0], [1.1, 0.75, 0.12]));
      for (let i = 0; i < 3; i++) v.add(bol(vleugel, 0.13, [s * (0.12 + i * 0.22), -0.24, 0], [1, 0.6, 0.12]));
      g.add(v);
      vleugels.push(v);
    }
    g.userData.vleugels = vleugels;
    return g;
  },
};
