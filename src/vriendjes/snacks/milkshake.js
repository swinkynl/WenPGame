import { bol, cilinder, groep } from '../../hulp/vormen.js';
import { snackGezicht, BRUINE_LIJN } from './gezicht.js';

export default {
  id: 'milkshake',
  naam: 'Sjors Shake',
  emoji: '🥤',
  maak() {
    const g = groep();
    g.userData.chibi = true;
    g.add(cilinder(0xffb3cf, 0.42, 0.32, 1.0, [0, 0.5, 0], 18, BRUINE_LIJN));
    g.add(cilinder(0xffffff, 0.425, 0.4, 0.14, [0, 0.82, 0], 18, BRUINE_LIJN));
    g.add(bol(0xfffbf2, 0.4, [0, 1.02, 0], [1, 0.5, 1], BRUINE_LIJN));
    g.add(bol(0xfffbf2, 0.22, [0, 1.18, 0], [1, 0.7, 1], BRUINE_LIJN));
    g.add(bol(0xe0233f, 0.1, [0, 1.36, 0], [1, 1, 1], BRUINE_LIJN));
    // gestreept rietje
    const rietje = groep(0.18, 1.05, -0.05);
    rietje.rotation.z = -0.3;
    for (let i = 0; i < 5; i++) rietje.add(cilinder(i % 2 ? 0xffffff : 0x4fb3ff, 0.04, 0.04, 0.16, [0, i * 0.16, 0], 8, { rand: false }));
    g.add(rietje);
    snackGezicht(g, 0.5, 0.37, { afstand: 0.15, r: 0.09 });
    return g;
  },
};
