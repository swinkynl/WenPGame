import { bol, halfbol, cilinder, torus, groep } from '../../hulp/vormen.js';
import { snackGezicht, BRUINE_LIJN } from './gezicht.js';

export default {
  id: 'hamburger',
  naam: 'Henk Hamburger',
  emoji: '🍔',
  maak() {
    const broodje = 0xe0a24e;
    const g = groep();
    g.userData.chibi = true;
    g.add(cilinder(broodje, 0.55, 0.5, 0.25, [0, 0.15, 0], 20, BRUINE_LIJN));
    g.add(cilinder(0x6b3a22, 0.58, 0.58, 0.18, [0, 0.36, 0], 20, BRUINE_LIJN));
    const kaas = cilinder(0xffd23f, 0.62, 0.62, 0.05, [0, 0.47, 0], 4, BRUINE_LIJN);
    kaas.rotation.y = Math.PI / 4;
    g.add(kaas);
    const sla = torus(0x7cc65a, 0.52, 0.07, [0, 0.52, 0], Math.PI * 2, BRUINE_LIJN);
    sla.rotation.x = Math.PI / 2;
    g.add(sla);
    g.add(cilinder(0xe5483a, 0.5, 0.5, 0.06, [0, 0.56, 0], 16, BRUINE_LIJN));
    g.add(halfbol(broodje, 0.58, [0, 0.58, 0], [1, 0.8, 1], BRUINE_LIJN));
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * Math.PI * 2, e = 0.5 + Math.random() * 0.9;
      if (Math.sin(a) > 0.5 && e < 0.9) continue;
      g.add(bol(0xfff4d6, 0.035, [Math.cos(e) * Math.cos(a) * 0.58, 0.58 + Math.sin(e) * 0.46, Math.cos(e) * Math.sin(a) * 0.58], [1.6, 0.6, 1], { rand: false }));
    }
    snackGezicht(g, 0.82, 0.43, { afstand: 0.17, r: 0.1 });
    return g;
  },
};
