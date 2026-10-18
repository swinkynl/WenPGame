import { bol, torus, groep } from '../hulp/vormen.js';
import { chibi, katOren } from './chibi.js';

// Zwart poesje met een pompoen-snoepemmertje
export default {
  id: 'zwartekat',
  naam: 'Poes Nachtje',
  emoji: '🐈‍⬛',
  maak() {
    const zwart = 0x3d3548;
    const { g, kop } = chibi({ kleur: zwart, buik: 0x564c63, snuit: 0x564c63, neus: 0xff8fab, oogKleur: 0x9a7b00 });
    katOren(kop, zwart, 0xff9ec0);
    // snoepemmer
    const emmer = groep(0, 0.32, 0.36);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      emmer.add(bol(0xff8a1f, 0.12, [Math.cos(a) * 0.08, 0, Math.sin(a) * 0.08], [0.8, 0.9, 0.8]));
    }
    emmer.add(bol(0xffe066, 0.025, [-0.05, 0.03, 0.17], [1, 1.2, 0.5], { gloed: 0.9, rand: false }));
    emmer.add(bol(0xffe066, 0.025, [0.05, 0.03, 0.17], [1, 1.2, 0.5], { gloed: 0.9, rand: false }));
    const hengsel = torus(0x2b2233, 0.15, 0.015, [0, 0.08, 0], Math.PI);
    emmer.add(hengsel);
    emmer.add(bol(0xff4f9a, 0.04, [0.03, 0.12, 0.02]));
    emmer.add(bol(0x7bdcff, 0.04, [-0.04, 0.12, -0.02]));
    g.add(emmer);
    const staart = groep(0, 0.3, -0.3);
    for (let i = 0; i < 6; i++) staart.add(bol(zwart, 0.07, [0, i * 0.09, -Math.sin(i * 0.5) * 0.15]));
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
