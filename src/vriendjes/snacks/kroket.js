import { bol, cilinder, groep } from '../../hulp/vormen.js';
import { snackGezicht, kruimels, BRUINE_LIJN } from './gezicht.js';

export default {
  id: 'kroket',
  naam: 'Karel Kroket',
  emoji: '🥖',
  maak() {
    const kleur = 0xc97a2c;
    const g = groep();
    g.userData.chibi = true;
    g.add(cilinder(kleur, 0.33, 0.33, 0.8, [0, 0.73, 0], 18, BRUINE_LIJN));
    g.add(bol(kleur, 0.33, [0, 1.13, 0], [1, 0.8, 1], BRUINE_LIJN));
    g.add(bol(kleur, 0.33, [0, 0.33, 0], [1, 0.8, 1], BRUINE_LIJN));
    kruimels(g, [0, 0.75, 0], [0.34, 0.6, 0.34], 60);
    // klodder mosterd bovenop
    g.add(bol(0xffc72c, 0.16, [0, 1.38, 0.02], [1.2, 0.5, 1.1]));
    snackGezicht(g, 0.85, 0.32, { afstand: 0.13, r: 0.09, mond: 0.06 });
    return g;
  },
};
