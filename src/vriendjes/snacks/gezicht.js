// Hulpjes voor de kawaii snack-vriendjes
import { bol, ogen, glimlach } from '../../hulp/vormen.js';

export const BRUINE_LIJN = { lijnKleur: 0x5a2d16 };

// Kraaloogjes met sterretjes, blosjes en een glimlachje
export function snackGezicht(ouder, y, z, { afstand = 0.18, r = 0.1, mond = 0.07 } = {}) {
  ogen(ouder, afstand, y, z, r, 0, { stijl: 'kraal' });
  glimlach(ouder, y - r * 1.6, z + 0.02, mond, 0x3a1d12, { dikte: 0.016 });
}

// Krokante paneerkruimeltjes op een bol of ellips (midden, stralen rx/ry/rz)
export function kruimels(ouder, midden, [rx, ry, rz], aantal, kleuren = [0xe3a14f, 0xa85f20], { vrijVoor = 0.55 } = {}) {
  for (let i = 0; i < aantal; i++) {
    const a = Math.random() * Math.PI * 2, e = Math.asin(Math.random() * 2 - 1);
    const nx = Math.cos(e) * Math.cos(a), ny = Math.sin(e), nz = Math.cos(e) * Math.sin(a);
    if (nz > vrijVoor && Math.abs(ny) < 0.6) continue; // gezichtje vrijlaten
    ouder.add(bol(kleuren[i % kleuren.length], 0.035 + Math.random() * 0.03,
      [midden[0] + nx * rx, midden[1] + ny * ry, midden[2] + nz * rz], [1, 0.7, 1], { rand: false }));
  }
}
