import { bol, groep } from '../../hulp/vormen.js';
import { snackGezicht, kruimels, BRUINE_LIJN } from './gezicht.js';

export default {
  id: 'kaassouffle',
  naam: 'Kees Kaassoufflé',
  emoji: '🧀',
  maak() {
    const g = groep();
    g.userData.chibi = true;
    g.add(bol(0xe0a94a, 0.6, [0, 0.4, 0], [1, 0.62, 0.75], BRUINE_LIJN));
    kruimels(g, [0, 0.4, 0], [0.6, 0.37, 0.45], 50, [0xf2c46b, 0xc98a32], { vrijVoor: 0.5 });
    // gesmolten kaas die eruit loopt
    g.add(bol(0xffd84a, 0.16, [0.42, 0.25, 0.25], [1, 0.6, 0.8]));
    g.add(bol(0xffd84a, 0.09, [0.48, 0.12, 0.3], [0.8, 1, 0.8]));
    snackGezicht(g, 0.45, 0.42, { afstand: 0.16, r: 0.09 });
    return g;
  },
};
