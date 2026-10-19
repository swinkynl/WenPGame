import { bol, cilinder, doos, groep } from '../../hulp/vormen.js';
import { snackGezicht, BRUINE_LIJN } from './gezicht.js';

// Frikandel speciaal: met mayonaise, curry en uitjes
export default {
  id: 'frikandel',
  naam: 'Frieda Frikandel',
  emoji: '🌭',
  maak() {
    const bruin = 0x9a5532;
    const g = groep();
    g.userData.chibi = true;
    g.add(cilinder(bruin, 0.22, 0.22, 1.2, [0, 0.82, 0], 14, BRUINE_LIJN));
    g.add(bol(bruin, 0.22, [0, 1.42, 0], [1, 0.9, 1], BRUINE_LIJN));
    g.add(bol(bruin, 0.22, [0, 0.22, 0], [1, 0.9, 1], BRUINE_LIJN));
    // speciaal: mayo, curry en uitjes over de bovenkant
    g.add(bol(0xfffbea, 0.17, [0, 1.55, 0.02], [1.2, 0.45, 1.2]));
    g.add(bol(0xd8342c, 0.12, [0.03, 1.62, 0.04], [1.1, 0.4, 1.1]));
    for (let i = 0; i < 6; i++) g.add(doos(0xffffff, [0.05, 0.04, 0.05], [Math.cos(i) * 0.1, 1.67, Math.sin(i) * 0.1], { rand: false }));
    snackGezicht(g, 1.0, 0.21, { afstand: 0.1, r: 0.075, mond: 0.05 });
    return g;
  },
};
