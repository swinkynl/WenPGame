import { bol, cilinder, kegel, groep } from '../../hulp/vormen.js';
import { snackGezicht, BRUINE_LIJN } from './gezicht.js';

// Knijpfles ketchup
export default {
  id: 'ketchup',
  naam: 'Kim Ketchup',
  emoji: '🍅',
  maak() {
    const rood = 0xe0302f;
    const g = groep();
    g.userData.chibi = true;
    g.add(cilinder(rood, 0.36, 0.38, 1.0, [0, 0.55, 0], 18, BRUINE_LIJN));
    g.add(bol(rood, 0.36, [0, 1.05, 0], [1, 0.55, 1], BRUINE_LIJN));
    g.add(cilinder(0xffffff, 0.16, 0.2, 0.2, [0, 1.3, 0], 14, BRUINE_LIJN));
    g.add(kegel(0xffffff, 0.08, 0.18, [0, 1.48, 0], 10, BRUINE_LIJN));
    // wit etiket met een tomaatje
    g.add(cilinder(0xfff8ee, 0.385, 0.385, 0.32, [0, 0.42, 0], 18, { rand: false }));
    g.add(bol(rood, 0.08, [0, 0.42, 0.37], [1, 1, 0.4], { rand: false }));
    g.add(bol(0x5aa83a, 0.035, [0, 0.5, 0.39], [1.5, 0.6, 0.6], { rand: false }));
    snackGezicht(g, 0.82, 0.35, { afstand: 0.14, r: 0.09 });
    return g;
  },
};
