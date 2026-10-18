// Basis voor kawaii-diertjes: mollig rond lijfje, groot koppie en korte pootjes,
// plus losse onderdelen (oren, hoedjes, capes) om diertjes mee aan te kleden.
import { bol, kegel, cilinder, torus, groep, ogen } from '../hulp/vormen.js';

// Alleen het koppie (gebruikt door chibi(), en los voor diertjes in een pompoen)
export function chibiKop(kop, { kleur, snuit = kleur, oogKleur = 0x2a1810, neus = 0x3a2420, dicht = false, kopBreed = 1.1 }) {
  kop.add(bol(kleur, 0.42, [0, 0, 0], [kopBreed, 0.95, 1]));
  kop.add(bol(snuit, 0.15, [0, -0.13, 0.33], [1.3, 0.85, 0.75]));
  kop.add(bol(neus, 0.05, [0, -0.07, 0.43], [1.3, 0.9, 0.8]));
  ogen(kop, 0.18, 0.02, 0.36, 0.11, oogKleur, { dicht });
}

export function chibi({ kleur, buik = kleur, snuit = buik, oogKleur, neus, dicht = false, kopBreed = 1.1 }) {
  const g = groep();
  g.userData.chibi = true; // koppie is al groot, niet nog eens vergroten
  g.add(bol(kleur, 0.36, [0, 0.4, 0], [1, 0.95, 0.9]));
  g.add(bol(buik, 0.25, [0, 0.36, 0.16], [0.95, 0.95, 0.6]));
  for (const s of [-1, 1]) {
    g.add(bol(kleur, 0.12, [s * 0.16, 0.08, 0.14], [1, 0.6, 1.3]));
    const arm = bol(kleur, 0.1, [s * 0.28, 0.45, 0.16], [0.8, 1.3, 0.8]);
    arm.rotation.z = s * 0.4;
    g.add(arm);
  }
  const kop = groep(0, 0.98, 0.04);
  g.add(kop);
  chibiKop(kop, { kleur, snuit, oogKleur, neus, dicht, kopBreed });
  g.userData.kop = kop;
  return { g, kop };
}

export function katOren(kop, kleur, binnen = 0xffb6c8) {
  for (const s of [-1, 1]) {
    const oor = kegel(kleur, 0.14, 0.28, [s * 0.26, 0.36, -0.02], 8);
    oor.rotation.z = -s * 0.35;
    kop.add(oor);
    const zacht = kegel(binnen, 0.08, 0.17, [s * 0.26, 0.34, 0.05], 8);
    zacht.rotation.z = -s * 0.35;
    kop.add(zacht);
  }
}

export function hondOren(kop, kleur) {
  for (const s of [-1, 1]) {
    const oor = bol(kleur, 0.17, [s * 0.4, 0.05, -0.02], [0.5, 1.2, 0.8]);
    oor.rotation.z = s * 0.25;
    kop.add(oor);
  }
}

export function heksenhoed(kop, kleur = 0x6a3d9a, band = 0xffb03b) {
  const hoed = groep(0, 0.3, -0.02);
  hoed.rotation.set(-0.15, 0, 0.15);
  hoed.add(cilinder(kleur, 0.46, 0.46, 0.05, [0, 0, 0], 20));
  hoed.add(cilinder(band, 0.27, 0.28, 0.08, [0, 0.07, 0], 16));
  const punt = kegel(kleur, 0.27, 0.65, [0, 0.4, 0], 16);
  punt.rotation.z = 0.15;
  hoed.add(punt);
  hoed.add(bol(0xfff176, 0.05, [0, 0.07, 0.27], [1, 1, 0.5], { gloed: 0.6 }));
  kop.add(hoed);
}

// Cape met hoge kraag (voor vampiertjes)
export function cape(g, kleur = 0x2b2233, voering = 0xc62839) {
  const achter = kegel(kleur, 0.5, 0.95, [0, 0.47, -0.15], 16);
  achter.scale.z = 0.25;
  g.add(achter);
  for (const s of [-1, 1]) {
    const kraag = bol(voering, 0.2, [s * 0.24, 0.75, -0.08], [0.9, 1.4, 0.25]);
    kraag.rotation.set(-0.3, s * 0.5, s * 0.3);
    g.add(kraag);
  }
  g.add(bol(0xffd54f, 0.05, [0, 0.72, 0.28], [1, 1, 0.6], { gloed: 0.4 }));
}

// Windsels (voor een mummie): strakke banden met hoogte y, straal r en een beetje scheef (tx, tz)
export function windsels(ouder, banden) {
  for (const [y, r, tx, tz] of banden) {
    const band = torus(0xf5f0e1, r, 0.045, [0, y, 0]);
    band.rotation.set(Math.PI / 2 + tx, 0, tz);
    band.scale.z = r * 1.8; // platte band in plaats van een dun touwtje
    ouder.add(band);
  }
}
