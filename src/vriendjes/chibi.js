// Basis voor een kawaii-diertje: mollig rond lijfje, groot koppie en korte pootjes.
// Elk bosdiertje begint hiermee en voegt daarna eigen oren, staart, enz. toe aan 'kop' en 'g'.
import { bol, groep, ogen } from '../hulp/vormen.js';

export function chibi({ kleur, buik = kleur, snuit = buik, oogKleur = 0x2a1810, neus = 0x3a2420, dicht = false, kopBreed = 1.1 }) {
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
  kop.add(bol(kleur, 0.42, [0, 0, 0], [kopBreed, 0.95, 1]));
  kop.add(bol(snuit, 0.15, [0, -0.13, 0.33], [1.3, 0.85, 0.75]));
  kop.add(bol(neus, 0.05, [0, -0.07, 0.43], [1.3, 0.9, 0.8]));
  ogen(kop, 0.18, 0.02, 0.36, 0.11, oogKleur, { dicht });
  g.userData.kop = kop;
  return { g, kop };
}
