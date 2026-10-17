import { bol, cilinder, groep } from '../hulp/vormen.js';
import { chibi } from './chibi.js';

export default {
  id: 'hert',
  naam: 'Hertje Stip',
  emoji: '🦌',
  maak() {
    const bruin = 0xd98a4e, room = 0xfff1dd, gewei = 0x6b3f2a;
    const { g, kop } = chibi({ kleur: bruin, buik: room, snuit: room });
    // witte stippen op het koppie en de rug
    const stip = { rand: false };
    for (const [a, e] of [[1.9, 0.9], [1.2, 0.95], [1.55, 1.25], [0.6, 0.5], [2.5, 0.5], [3.4, 0.7], [-0.3, 0.6], [4.4, 1.0]]) {
      kop.add(bol(0xffffff, 0.04, [0.462 * Math.cos(e) * Math.cos(a), 0.4 * Math.sin(e), -0.42 * Math.cos(e) * Math.sin(a) * 0.6 - 0.05], [1, 0.6, 1], stip));
    }
    for (const [x, z] of [[-0.15, -0.15], [0.12, -0.2], [0, -0.05], [0.2, 0.0], [-0.22, 0.02]]) {
      g.add(bol(0xffffff, 0.045, [x, 0.7, z], [1, 0.5, 1], stip));
    }
    for (const s of [-1, 1]) {
      // grote oortjes opzij
      const oor = bol(bruin, 0.12, [s * 0.44, 0.16, -0.02], [1.7, 0.6, 0.8]);
      oor.rotation.z = s * 0.35;
      kop.add(oor);
      const binnen = bol(0xffc9c0, 0.08, [s * 0.46, 0.17, 0.03], [1.6, 0.5, 0.4], { rand: false });
      binnen.rotation.z = s * 0.35;
      kop.add(binnen);
      // geweitje
      const stam = groep(s * 0.15, 0.34, -0.02);
      const hoofd = cilinder(gewei, 0.03, 0.045, 0.32, [0, 0.15, 0], 6);
      hoofd.rotation.z = -s * 0.3;
      stam.add(hoofd);
      const tak1 = cilinder(gewei, 0.022, 0.03, 0.16, [s * 0.1, 0.18, 0], 6);
      tak1.rotation.z = -s * 1.0;
      stam.add(tak1);
      const tak2 = cilinder(gewei, 0.022, 0.03, 0.14, [s * 0.06, 0.32, 0], 6);
      tak2.rotation.z = s * 0.5;
      stam.add(tak2);
      kop.add(stam);
    }
    g.add(bol(room, 0.08, [0, 0.45, -0.33]));
    return g;
  },
};
