import { chibi, katOren, windsels } from './chibi.js';

export default {
  id: 'mummiekat',
  naam: 'Mummie Mo',
  emoji: '🧻',
  maak() {
    const oranje = 0xf6b26b;
    const { g, kop } = chibi({ kleur: oranje, buik: 0xfff0dc, snuit: 0xfff0dc, neus: 0xff8fab, oogKleur: 0xb8860b });
    katOren(kop, oranje);
    // windsels om het koppie (boven en onder de ogen) en om het lijfje
    windsels(kop, [[0.22, 0.4, 0.08, 0.1], [-0.25, 0.375, -0.06, -0.08]]);
    windsels(g, [[0.3, 0.36, 0.05, -0.1], [0.52, 0.34, -0.05, 0.12]]);
    return g;
  },
};
