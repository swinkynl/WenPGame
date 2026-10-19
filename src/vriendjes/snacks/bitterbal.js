import { bol, cilinder, doos, groep } from '../../hulp/vormen.js';
import { snackGezicht, kruimels, BRUINE_LIJN } from './gezicht.js';

// Bob Bitterbal, met een Nederlands vlaggetje op een prikker
export default {
  id: 'bitterbal',
  naam: 'Bob Bitterbal',
  emoji: '🇳🇱',
  maak() {
    const g = groep();
    g.userData.chibi = true;
    g.add(bol(0xc97a2c, 0.55, [0, 0.55, 0], [1, 0.97, 1], BRUINE_LIJN));
    kruimels(g, [0, 0.55, 0], [0.55, 0.53, 0.55], 70);
    snackGezicht(g, 0.6, 0.47, { afstand: 0.19, r: 0.11 });
    // prikker met vlaggetje
    const prikker = groep(-0.08, 1.0, 0);
    prikker.rotation.z = 0.12;
    prikker.add(cilinder(0xe8c88a, 0.015, 0.015, 1.0, [0, 0.45, 0], 6));
    const vlag = groep(0.02, 0.78, 0);
    vlag.userData.dynamisch = true;
    [0xae1c28, 0xffffff, 0x21468b].forEach((k, i) => vlag.add(doos(k, [0.5, 0.11, 0.02], [0.25, -i * 0.11, 0], { rand: false })));
    prikker.add(vlag);
    g.add(prikker);
    g.userData.staart = vlag; // vlaggetje wappert
    return g;
  },
};
