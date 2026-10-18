import * as THREE from 'three';
import { bol, kegel, torus, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'kogelvis',
  naam: 'Kogelvis Bolletje',
  emoji: '🐡',
  zweef: 0.5,
  maak() {
    const groen = 0xc8f08a, licht = 0xf6ffd9;
    const g = groep();
    g.userData.chibi = true;
    g.add(bol(groen, 0.5, [0, 0.9, 0]));
    g.add(bol(licht, 0.38, [0, 0.75, 0.2], [1, 0.8, 0.8]));
    // zachte stekeltjes rondom (niet op het gezicht)
    const omhoog = new THREE.Vector3(0, 1, 0), n = new THREE.Vector3();
    for (let e = -1.2; e <= 1.3; e += 0.4) {
      const ring = Math.max(1, Math.round(Math.cos(e) * 10));
      for (let i = 0; i < ring; i++) {
        const a = (i / ring) * Math.PI * 2 + e;
        n.set(Math.cos(e) * Math.cos(a), Math.sin(e), Math.cos(e) * Math.sin(a));
        if (n.z > 0.55) continue;
        const k = kegel(0xa6d86a, 0.04, 0.14, [n.x * 0.55, 0.9 + n.y * 0.55, n.z * 0.55], 5);
        k.quaternion.setFromUnitVectors(omhoog, n);
        g.add(k);
      }
    }
    ogen(g, 0.2, 0.98, 0.42, 0.13, 0x2a4a1a);
    g.add(torus(0xff8a8a, 0.05, 0.02, [0, 0.78, 0.49], Math.PI * 2, { rand: false }));
    const staart = groep(0, 0.9, -0.5);
    staart.add(bol(groen, 0.18, [0, 0, -0.1], [0.25, 1, 0.8]));
    g.add(staart);
    for (const s of [-1, 1]) g.add(bol(groen, 0.12, [s * 0.5, 0.85, 0.1], [0.3, 0.7, 1]));
    g.userData.staart = staart;
    return g;
  },
};
