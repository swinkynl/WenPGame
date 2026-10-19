import { bol, cilinder, doos, groep } from '../../hulp/vormen.js';
import { snackGezicht, BRUINE_LIJN } from './gezicht.js';

// Patatje met mayo in een rood-wit bakje
export default {
  id: 'patat',
  naam: 'Pietje Patat',
  emoji: '🍟',
  maak() {
    const g = groep();
    g.userData.chibi = true;
    const bak = cilinder(0xe63946, 0.5, 0.36, 0.75, [0, 0.38, 0], 4, BRUINE_LIJN);
    bak.rotation.y = Math.PI / 4;
    g.add(bak);
    const rand = cilinder(0xffffff, 0.51, 0.49, 0.12, [0, 0.7, 0], 4, BRUINE_LIJN);
    rand.rotation.y = Math.PI / 4;
    g.add(rand);
    // frietjes
    for (let i = 0; i < 16; i++) {
      const x = (Math.random() - 0.5) * 0.5, z = (Math.random() - 0.5) * 0.4 - 0.05, h = 0.5 + Math.random() * 0.35;
      const friet = doos(i % 3 ? 0xffd35a : 0xf2b83c, [0.08, h, 0.08], [x, 0.7 + h / 2 - 0.1, z], BRUINE_LIJN);
      friet.rotation.set((Math.random() - 0.5) * 0.4, Math.random(), (Math.random() - 0.5) * 0.4);
      g.add(friet);
    }
    // klodder mayo
    g.add(bol(0xfffbea, 0.18, [0.08, 1.2, 0.05], [1.2, 0.6, 1.2]));
    g.add(bol(0xfffbea, 0.11, [0.08, 1.32, 0.05]));
    snackGezicht(g, 0.42, 0.32, { afstand: 0.14, r: 0.09, mond: 0.06 });
    return g;
  },
};
