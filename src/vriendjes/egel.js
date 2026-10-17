import * as THREE from 'three';
import { bol, kegel } from '../hulp/vormen.js';
import { chibi } from './chibi.js';

// Zet stekels op de achterkant van een ellips (rx, ry, rz) rond het midden van 'ouder'
function stekels(ouder, [rx, ry, rz], midden, maxZ) {
  const omhoog = new THREE.Vector3(0, 1, 0), n = new THREE.Vector3();
  for (let e = -0.2; e <= 1.45; e += 0.28) {
    const ring = Math.max(1, Math.round(Math.cos(e) * 12));
    for (let i = 0; i < ring; i++) {
      const a = (i / ring) * Math.PI * 2 + e;
      const p = [rx * Math.cos(e) * Math.cos(a), ry * Math.sin(e), rz * Math.cos(e) * Math.sin(a)];
      if (p[2] > maxZ) continue;
      n.set(p[0] / (rx * rx), p[1] / (ry * ry), p[2] / (rz * rz)).normalize();
      const k = kegel(0x8a6a55, 0.07, 0.24, [midden[0] + p[0] + n.x * 0.07, midden[1] + p[1] + n.y * 0.07, midden[2] + p[2] + n.z * 0.07], 5);
      k.quaternion.setFromUnitVectors(omhoog, n);
      ouder.add(k);
    }
  }
}

export default {
  id: 'egel',
  naam: 'Egel Prikkie',
  emoji: '🦔',
  maak() {
    const huid = 0xf3dcc4;
    const { g, kop } = chibi({ kleur: huid, buik: 0xfff3e6, snuit: 0xfff3e6, neus: 0x2a1a14 });
    stekels(kop, [0.462, 0.4, 0.42], [0, 0, 0], 0.12);
    stekels(g, [0.36, 0.34, 0.32], [0, 0.4, 0], -0.05);
    for (const s of [-1, 1]) kop.add(bol(huid, 0.07, [s * 0.3, 0.26, 0.14]));
    return g;
  },
};
