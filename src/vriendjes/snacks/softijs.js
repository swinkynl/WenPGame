import { bol, kegel, doos, groep } from '../../hulp/vormen.js';
import { snackGezicht, BRUINE_LIJN } from './gezicht.js';

// Softijsje in een hoorntje met spikkels
export default {
  id: 'softijs',
  naam: 'IJsje Ilse',
  emoji: '🍦',
  maak() {
    const g = groep();
    g.userData.chibi = true;
    const hoorn = kegel(0xd9a35c, 0.36, 0.8, [0, 0.42, 0], 14, BRUINE_LIJN);
    hoorn.rotation.x = Math.PI;
    g.add(hoorn);
    const ijs = 0xfff3f6, roze = 0xffc2d6;
    g.add(bol(ijs, 0.42, [0, 0.95, 0], [1, 0.65, 1], BRUINE_LIJN));
    g.add(bol(roze, 0.33, [0, 1.22, 0], [1, 0.65, 1], BRUINE_LIJN));
    g.add(bol(ijs, 0.23, [0, 1.43, 0], [1, 0.7, 1], BRUINE_LIJN));
    g.add(kegel(roze, 0.12, 0.22, [0, 1.6, 0], 10, BRUINE_LIJN));
    const kleuren = [0xff5a8a, 0x5ad1ff, 0xffd166, 0x8ce99a, 0xb388ff];
    for (let i = 0; i < 18; i++) {
      const a = Math.random() * Math.PI * 2, laag = i % 3, r = [0.4, 0.31, 0.21][laag], y = [1.0, 1.27, 1.47][laag];
      if (Math.sin(a) > 0.6 && laag === 0) continue;
      const spikkel = doos(kleuren[i % 5], [0.07, 0.02, 0.02], [Math.cos(a) * r, y, Math.sin(a) * r], { rand: false });
      spikkel.rotation.set(Math.random(), Math.random() * 3, Math.random());
      g.add(spikkel);
    }
    snackGezicht(g, 0.98, 0.38, { afstand: 0.14, r: 0.085, mond: 0.06 });
    return g;
  },
};
