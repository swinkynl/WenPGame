// Bibliotheek met decor voor de gebieden: bomen, struiken, gebouwen, ...
// Elke functie krijgt de wereld (w) en geeft een model terug dat met w.plaats() of
// w.verspreid() neergezet kan worden. Functies die zelf al dingen neerzetten
// (bloemen, maisveld, weide, ...) krijgen ook de wereld en geven niets terug.
import * as THREE from 'three';
import {
  bol, halfbol, doos, cilinder, kegel, torus, octa, steenvorm, schijf, groep,
  materiaal, bolGeometrie,
} from './hulp/vormen.js';

// Plekjes rondom een object, op afstand r
function rondom(r, n = 3, start = 0) {
  const lijst = [];
  for (let i = 0; i < n; i++) {
    const a = start + (i / n) * Math.PI * 2;
    lijst.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return lijst;
}

function info(g, botsers, verstop, ruimte, extra = {}) {
  Object.assign(g.userData, { botsers, verstop, ruimte, ...extra });
  return g;
}

// ======================= Natuur =======================

export function boom(w, { kroon = [0x5cb85c, 0x4caf50, 0x66bb6a] } = {}) {
  const g = groep();
  const h = w.tussen(1.8, 2.6);
  g.add(cilinder(0x8b5a2b, 0.22, 0.32, h, [0, h / 2, 0], 8));
  const k1 = w.kies(kroon), k2 = w.kies(kroon);
  g.add(bol(k1, 1.5, [0, h + 1.1, 0], [1, 0.9, 1]));
  g.add(bol(k2, 1.0, [0.9, h + 0.6, 0.3]));
  g.add(bol(k1, 1.1, [-0.7, h + 0.8, -0.5]));
  return info(g, [{ r: 0.45 }], rondom(1.4, 3, w.rng() * 6), 2);
}

export function appelboom(w) {
  const g = boom(w, { kroon: [0x4caf50, 0x43a047] });
  const h = g.children[0].scale.y;
  for (let i = 0; i < 8; i++) {
    const a = w.rng() * Math.PI * 2, e = w.tussen(-0.2, 0.9);
    g.add(bol(0xe53935, 0.13, [Math.cos(a) * Math.cos(e) * 1.5, h + 1.1 + Math.sin(e) * 1.35, Math.sin(a) * Math.cos(e) * 1.5]));
  }
  return g;
}

export function dennenboom(w) {
  const g = groep();
  const groen = w.kies([0x2e7d4f, 0x2f8a52, 0x276b44]);
  g.add(cilinder(0x6d4c41, 0.2, 0.28, 1.4, [0, 0.7, 0], 8));
  g.add(kegel(groen, 2.0, 2.4, [0, 2.2, 0], 9));
  g.add(kegel(groen, 1.6, 2.1, [0, 3.4, 0], 9));
  g.add(kegel(groen, 1.1, 1.8, [0, 4.5, 0], 9));
  return info(g, [{ r: 0.5 }], rondom(1.6, 3, w.rng() * 6), 2.2);
}

export function toverboom(w) {
  const g = groep();
  const stam = 0x8d6e9e;
  g.add(cilinder(stam, 0.25, 0.4, 1.4, [0, 0.7, 0], 8));
  const midden = cilinder(stam, 0.2, 0.25, 1.2, [0.15, 1.9, 0], 8);
  midden.rotation.z = -0.25;
  g.add(midden);
  const kleuren = [0xffb3de, 0xd7b3ff, 0xb3f0ff, 0xffe0a3, 0xc5f7c5];
  const k = w.kies(kleuren), k2 = w.kies(kleuren);
  g.add(bol(k, 1.6, [0.3, 3.4, 0], [1, 0.85, 1]));
  g.add(bol(k2, 1.0, [1.3, 3.0, 0.4]));
  g.add(bol(k, 1.1, [-0.8, 3.1, -0.4]));
  g.add(bol(k2, 0.8, [0.2, 4.3, 0.2]));
  for (let i = 0; i < 6; i++) {
    const a = w.rng() * Math.PI * 2;
    g.add(bol(w.kies([0xfff176, 0xff80ab, 0x80deea]), 0.14, [0.3 + Math.cos(a) * 1.5, w.tussen(2.6, 3.6), Math.sin(a) * 1.5], [1, 1, 1], { gloed: 0.8 }));
  }
  return info(g, [{ r: 0.55 }], rondom(1.5, 3, w.rng() * 6), 2.2);
}

export function struik(w, { kleuren = [0x4f9d4f, 0x5aad5a, 0x469446], bessen = false } = {}) {
  const g = groep();
  const k = w.kies(kleuren);
  g.add(bol(k, 0.85, [0, 0.6, 0], [1, 0.85, 1]));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + w.rng();
    g.add(bol(w.kies(kleuren), w.tussen(0.55, 0.75), [Math.cos(a) * 0.6, 0.5, Math.sin(a) * 0.6]));
  }
  if (bessen) {
    const bes = w.kies([0xff4081, 0xffeb3b, 0xb388ff, 0xffffff]);
    for (let i = 0; i < 7; i++) {
      const a = w.rng() * Math.PI * 2;
      g.add(bol(bes, 0.09, [Math.cos(a) * 0.95, w.tussen(0.5, 1.1), Math.sin(a) * 0.95]));
    }
  }
  // geen botsing: het hondje kan erdoorheen, en een vriendje kan erin zitten
  return info(g, [], [[0, 0]], 1.3);
}

export function steen(w) {
  const g = groep();
  const r = w.tussen(0.5, 1.2);
  g.add(steenvorm(w.kies([0x9e9e9e, 0xa8a29a, 0x8f8f8f]), r, [0, r * 0.3, 0], [1, 0.65, 0.9]));
  return info(g, [{ r: r * 0.85 }], rondom(r + 0.9, 2, w.rng() * 6), r + 0.3);
}

export function paddenstoel(w, { kleuren = [0xe53935, 0xab47bc, 0xff7043, 0x42a5f5] } = {}) {
  const g = groep();
  const h = w.tussen(1.2, 2.2), R = w.tussen(1.0, 1.5);
  const kleur = w.kies(kleuren);
  g.add(cilinder(0xfff3e0, 0.25, 0.35, h, [0, h / 2, 0], 10));
  g.add(halfbol(kleur, R, [0, h - 0.05, 0], [1, 0.6, 1]));
  const onder = schijf(0xfff3e0, R * 0.98, [0, h - 0.05, 0], { vlak: false });
  onder.rotation.x = Math.PI / 2;
  g.add(onder);
  for (let i = 0; i < 7; i++) {
    const a = w.rng() * Math.PI * 2, e = w.tussen(0.35, 1.3);
    g.add(bol(0xffffff, R * 0.14, [Math.cos(e) * Math.cos(a) * R, h + Math.sin(e) * R * 0.6, Math.cos(e) * Math.sin(a) * R], [1, 0.5, 1]));
  }
  return info(g, [{ r: 0.38 }], rondom(1.3, 2, w.rng() * 6), R);
}

export function kristal(w, kleur = 0xb388ff) {
  const g = groep();
  const n = 3 + Math.floor(w.rng() * 3);
  for (let i = 0; i < n; i++) {
    const h = i === 0 ? w.tussen(1.0, 1.6) : w.tussen(0.5, 1.0);
    const a = (i / n) * Math.PI * 2, d = i === 0 ? 0 : 0.35;
    const k = octa(kleur, 1, [Math.cos(a) * d, h * 0.8, Math.sin(a) * d], [0.28 * h, h, 0.28 * h], { gloed: 0.45 });
    if (i) k.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4);
    g.add(k);
  }
  g.add(steenvorm(0x8e8aa8, 0.5, [0, 0.1, 0], [1.2, 0.4, 1.2]));
  return info(g, [{ r: 0.55 }], rondom(1.4, 2, w.rng() * 6), 1.2);
}

export function lantaarn() {
  const g = groep();
  g.add(cilinder(0x4a3b5c, 0.06, 0.08, 2.2, [0, 1.1, 0], 6));
  g.add(bol(0xfff1a8, 0.22, [0, 2.35, 0], [1, 1, 1], { gloed: 1 }));
  g.add(kegel(0x4a3b5c, 0.28, 0.25, [0, 2.65, 0], 6));
  return info(g, [{ r: 0.15 }], [], 0.6);
}

export function vijver(w, r = 6) {
  const g = groep();
  g.add(schijf(0xd9c48f, r + 0.7, [0, 0.03, 0]));
  g.add(schijf(0x5bb8f5, r, [0, 0.05, 0], { gloed: 0.15 }));
  for (let i = 0; i < 4; i++) {
    const a = w.rng() * Math.PI * 2, d = w.tussen(0.3, 0.7) * r;
    g.add(schijf(0x66bb6a, 0.45, [Math.cos(a) * d, 0.07, Math.sin(a) * d]));
    if (i % 2 === 0) g.add(bol(0xff80ab, 0.12, [Math.cos(a) * d, 0.12, Math.sin(a) * d]));
  }
  // riet
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + w.rng() * 0.3, d = r + w.tussen(-0.2, 0.4);
    const h = w.tussen(1.2, 1.9);
    g.add(cilinder(0x7cb342, 0.03, 0.04, h, [Math.cos(a) * d, h / 2, Math.sin(a) * d], 5));
    if (i % 2) g.add(cilinder(0x6d4c41, 0.07, 0.07, 0.3, [Math.cos(a) * d, h, Math.sin(a) * d], 6));
  }
  return info(g, [{ r: r - 0.3 }], rondom(r + 0.8, 5, w.rng() * 6), r + 1.5);
}

export function fontein(w) {
  const g = groep();
  g.add(cilinder(0xcfd8dc, 2.4, 2.5, 0.6, [0, 0.3, 0], 20));
  g.add(cilinder(0x6ec6ff, 2.15, 2.15, 0.62, [0, 0.32, 0], 20, { gloed: 0.2 }));
  g.add(cilinder(0xcfd8dc, 0.3, 0.4, 1.8, [0, 1.2, 0], 10));
  g.add(cilinder(0xcfd8dc, 0.9, 0.4, 0.3, [0, 2.2, 0], 14));
  g.add(bol(0x9be7ff, 0.35, [0, 2.5, 0], [1, 1, 1], { gloed: 0.4 }));
  const druppels = groep();
  druppels.userData.dynamisch = true;
  for (let i = 0; i < 10; i++) druppels.add(bol(0x9be7ff, 0.1, [0, 0, 0], [1, 1, 1], { gloed: 0.5 }));
  g.add(druppels);
  return info(g, [{ r: 2.5 }], rondom(3.4, 4, w.rng() * 6), 3.6, {
    update: (dt, t) => {
      druppels.children.forEach((d, i) => {
        const p = (t * 0.6 + i / 10) % 1, a = (i / 10) * Math.PI * 2;
        d.position.set(Math.cos(a) * p * 1.7, 2.6 + Math.sin(p * Math.PI) * 0.9 - p * 1.9, Math.sin(a) * p * 1.7);
      });
    },
  });
}

export function regenboog() {
  const g = groep();
  const kleuren = [0xff5252, 0xffa726, 0xffee58, 0x66bb6a, 0x42a5f5, 0xab47bc];
  kleuren.forEach((k, i) => g.add(torus(k, 5 - i * 0.36, 0.18, [0, 0, 0], Math.PI, { gloed: 0.15 })));
  for (const s of [-1, 1]) {
    g.add(bol(0xffffff, 0.9, [s * 4.1, 0.3, 0]));
    g.add(bol(0xffffff, 0.7, [s * 4.9, 0.25, 0.4]));
    g.add(bol(0xffffff, 0.6, [s * 4.5, 0.6, -0.4]));
  }
  return info(g, [{ x: -4.5, r: 1.1 }, { x: 4.5, r: 1.1 }], [[-4.5, 1.8], [4.5, -1.8]], 5.5);
}

export function paddenstoelhuisje(w) {
  const g = groep();
  g.add(cilinder(0xfff3e0, 1.6, 1.9, 2.8, [0, 1.4, 0], 18));
  g.add(doos(0x8d5524, [0.9, 1.5, 0.2], [0, 0.75, 1.8]));
  g.add(bol(0xffd54f, 0.07, [0.28, 0.75, 1.92]));
  for (const s of [-1, 1]) {
    const raam = cilinder(0xfff59d, 0.3, 0.3, 0.1, [s * 0.86, 1.8, 1.49], 14, { gloed: 0.7 });
    raam.rotation.set(Math.PI / 2, 0, -s * 0.52);
    g.add(raam);
  }
  const kleur = w.kies([0xe53935, 0xab47bc, 0xff7043]);
  g.add(halfbol(kleur, 2.8, [0, 2.7, 0], [1, 0.65, 1]));
  const onder = schijf(0xfff3e0, 2.75, [0, 2.7, 0], { vlak: false });
  onder.rotation.x = Math.PI / 2;
  g.add(onder);
  for (let i = 0; i < 9; i++) {
    const a = w.rng() * Math.PI * 2, e = w.tussen(0.3, 1.3);
    g.add(bol(0xffffff, 0.35, [Math.cos(e) * Math.cos(a) * 2.8, 2.7 + Math.sin(e) * 1.82, Math.cos(e) * Math.sin(a) * 2.8], [1, 0.5, 1]));
  }
  return info(g, [{ r: 2.0 }], rondom(3.0, 4, 0.4), 3.4);
}

// ======================= Boerderij =======================

function zadeldak(b, d, hoogte, kleurGevel, kleurDak) {
  const g = groep();
  const vorm = new THREE.Shape();
  vorm.moveTo(-b / 2, 0);
  vorm.lineTo(b / 2, 0);
  vorm.lineTo(0, hoogte);
  vorm.closePath();
  const geo = new THREE.ExtrudeGeometry(vorm, { depth: d, bevelEnabled: false });
  geo.translate(0, 0, -d / 2);
  const gevel = new THREE.Mesh(geo, materiaal(kleurGevel));
  gevel.castShadow = gevel.receiveShadow = true;
  g.add(gevel);
  const hoek = Math.atan2(hoogte, b / 2), lengte = Math.hypot(b / 2, hoogte) + 0.6;
  for (const s of [-1, 1]) {
    const plaat = doos(kleurDak, [lengte, 0.22, d + 0.8], [s * (b / 4 + 0.05), hoogte / 2 + 0.12, 0]);
    plaat.rotation.z = -s * hoek;
    g.add(plaat);
  }
  return g;
}

export function schuur() {
  const g = groep();
  const b = 9, h = 5, d = 11, rood = 0xc0392b, wit = 0xf5f5f5;
  g.add(doos(rood, [b, h, d], [0, h / 2, 0]));
  const dak = zadeldak(b, d, 3.4, rood, 0x5d4037);
  dak.position.y = h;
  g.add(dak);
  // grote deur met kruis
  g.add(doos(wit, [3.8, 3.9, 0.15], [0, 1.95, d / 2 + 0.05]));
  g.add(doos(0xa93226, [3.3, 3.5, 0.18], [0, 1.8, d / 2 + 0.07]));
  for (const s of [-1, 1]) {
    const balk = doos(wit, [4.6, 0.18, 0.1], [0, 1.8, d / 2 + 0.17]);
    balk.rotation.z = s * Math.atan2(3.5, 3.3);
    g.add(balk);
  }
  // hooiluik
  g.add(doos(wit, [1.8, 1.4, 0.12], [0, h + 1.1, d / 2 + 0.05]));
  g.add(doos(0x4e342e, [1.4, 1.0, 0.14], [0, h + 1.1, d / 2 + 0.07]));
  // witte hoeken
  for (const x of [-b / 2, b / 2]) for (const z of [-d / 2, d / 2]) g.add(doos(wit, [0.3, h, 0.3], [x, h / 2, z]));
  const verstop = [
    [b / 2 + 1, d / 2 + 1], [-b / 2 - 1, d / 2 + 1], [b / 2 + 1, -d / 2 - 1], [-b / 2 - 1, -d / 2 - 1],
    [b / 2 + 1, 0], [-b / 2 - 1, 0], [0, -d / 2 - 1],
  ];
  return info(g, [{ b, d }], verstop, 7.5);
}

export function huis() {
  const g = groep();
  const b = 7, h = 3.4, d = 6, muur = 0xfaf3e0, wit = 0xffffff;
  g.add(doos(muur, [b, h, d], [0, h / 2, 0]));
  const dak = zadeldak(b, d, 2.8, muur, 0xb5452f);
  dak.position.y = h;
  g.add(dak);
  g.add(doos(0x2e7d32, [1.1, 2.1, 0.12], [0, 1.05, d / 2 + 0.03]));
  g.add(bol(0xffd54f, 0.07, [0.35, 1.05, d / 2 + 0.12]));
  for (const x of [-2.2, 2.2]) {
    g.add(doos(wit, [1.4, 1.25, 0.08], [x, 2.0, d / 2 + 0.02]));
    g.add(doos(0xbfe9ff, [1.15, 1.0, 0.1], [x, 2.0, d / 2 + 0.03]));
    g.add(doos(0xff8a65, [1.3, 0.25, 0.35], [x, 1.3, d / 2 + 0.15]));
    g.add(bol(0xff4081, 0.12, [x - 0.35, 1.5, d / 2 + 0.2]));
    g.add(bol(0xffeb3b, 0.12, [x + 0.3, 1.5, d / 2 + 0.2]));
  }
  for (const z of [-1.3, 1.3]) {
    g.add(doos(wit, [0.08, 1.25, 1.4], [b / 2 + 0.02, 2.0, z]));
    g.add(doos(0xbfe9ff, [0.1, 1.0, 1.15], [b / 2 + 0.03, 2.0, z]));
  }
  g.add(doos(0x8d6e63, [0.6, 1.8, 0.6], [1.8, h + 2.3, -1.2]));
  const verstop = [[b / 2 + 1, d / 2 + 1], [-b / 2 - 1, d / 2 + 1], [b / 2 + 1, -d / 2 - 1], [-b / 2 - 1, -d / 2 - 1], [0, -d / 2 - 1]];
  return info(g, [{ b, d }], verstop, 5.5);
}

export function silo() {
  const g = groep();
  g.add(cilinder(0xb0bec5, 1.8, 1.8, 9, [0, 4.5, 0], 18));
  g.add(halfbol(0x90a4ae, 1.8, [0, 9, 0]));
  for (const y of [2, 4.5, 7]) g.add(cilinder(0x78909c, 1.85, 1.85, 0.15, [0, y, 0], 18));
  return info(g, [{ r: 1.9 }], rondom(2.9, 3, 0.5), 2.6);
}

export function hooibaal(w) {
  const g = groep();
  const rol = cilinder(0xe9c46a, 0.9, 0.9, 1.4, [0, 0.9, 0], 16);
  rol.rotation.z = Math.PI / 2;
  g.add(rol);
  for (const s of [-1, 1]) {
    const kant = cilinder(0xf4d58d, 0.6, 0.6, 0.02, [s * 0.71, 0.9, 0], 16);
    kant.rotation.z = Math.PI / 2;
    g.add(kant);
  }
  return info(g, [{ r: 1.0 }], rondom(1.9, 2, w.rng() * 6), 1.4);
}

export function hooistapel() {
  const g = groep();
  const geel = 0xe9c46a;
  for (const x of [-1.1, 0, 1.1]) g.add(doos(geel, [1.05, 0.75, 1.1], [x, 0.38, 0]));
  for (const x of [-0.55, 0.55]) g.add(doos(0xf0cd78, [1.05, 0.75, 1.1], [x, 1.13, 0]));
  g.add(doos(geel, [1.05, 0.75, 1.1], [0, 1.88, 0]));
  return info(g, [{ b: 3.4, d: 1.2 }], [[0, 1.6], [0, -1.6], [2.5, 0]], 2.2);
}

export function trekker() {
  const g = groep();
  const groen = 0x2e9e4f, geel = 0xffd54f, zwart = 0x263238;
  g.add(doos(groen, [1.3, 1.0, 2.8], [0, 1.15, 0.3]));
  g.add(doos(groen, [1.1, 0.7, 1.2], [0, 1.95, 1.0]));
  for (const x of [-0.65, 0.65]) for (const z of [-1.3, 0.1]) g.add(doos(zwart, [0.08, 1.3, 0.08], [x, 2.25, z]));
  g.add(doos(groen, [1.6, 0.12, 1.7], [0, 2.95, -0.6]));
  g.add(cilinder(0x546e7a, 0.07, 0.07, 1.2, [0.4, 2.4, 1.3], 6));
  for (const s of [-1, 1]) {
    const groot = cilinder(zwart, 0.9, 0.9, 0.5, [s * 0.95, 0.9, -0.6], 16);
    groot.rotation.z = Math.PI / 2;
    g.add(groot);
    const naaf = cilinder(geel, 0.4, 0.4, 0.52, [s * 0.95, 0.9, -0.6], 12);
    naaf.rotation.z = Math.PI / 2;
    g.add(naaf);
    const klein = cilinder(zwart, 0.5, 0.5, 0.35, [s * 0.8, 0.5, 1.3], 14);
    klein.rotation.z = Math.PI / 2;
    g.add(klein);
    const naafje = cilinder(geel, 0.22, 0.22, 0.37, [s * 0.8, 0.5, 1.3], 10);
    naafje.rotation.z = Math.PI / 2;
    g.add(naafje);
  }
  return info(g, [{ b: 2.4, d: 3.6 }], [[0, -2.6], [2.2, 0.6], [-2.2, 0.6]], 2.5);
}

export function kippenhok() {
  const g = groep();
  const hout = 0xa0522d;
  for (const x of [-0.8, 0.8]) for (const z of [-0.6, 0.6]) g.add(cilinder(0x6d4c41, 0.07, 0.07, 0.7, [x, 0.35, z], 6));
  g.add(doos(hout, [2, 1.3, 1.6], [0, 1.35, 0]));
  const dak = zadeldak(2.2, 1.9, 0.9, hout, 0x8d2f1f);
  dak.position.y = 2.0;
  g.add(dak);
  g.add(doos(0x3e2723, [0.5, 0.6, 0.05], [0, 1.15, 0.82]));
  const plank = doos(0xc68642, [0.5, 0.06, 1.3], [0, 0.4, 1.35]);
  plank.rotation.x = 0.55;
  g.add(plank);
  return info(g, [{ b: 2.2, d: 1.8 }], rondom(2.3, 3, 0.8), 2);
}

export function windmolen() {
  const g = groep();
  g.add(cilinder(0x6d4c41, 1.8, 3.2, 9, [0, 4.5, 0], 8));
  g.add(cilinder(0x8d6e63, 3.6, 3.6, 0.2, [0, 3.2, 0], 16));
  g.add(kegel(0x3e2723, 2.1, 2.2, [0, 10.1, 0], 8));
  g.add(doos(0x2e7d32, [1, 1.8, 0.2], [0, 0.9, 2.95]));
  g.add(doos(0xffffff, [0.6, 0.8, 0.1], [0, 5.5, 2.45]));
  const wieken = groep(0, 8.6, 2.3);
  wieken.userData.dynamisch = true;
  wieken.add(bol(0x3e2723, 0.4));
  for (let i = 0; i < 4; i++) {
    const wiek = groep();
    wiek.rotation.z = (i * Math.PI) / 2;
    wiek.add(doos(0x4e342e, [0.22, 6.2, 0.12], [0, 3.1, 0]));
    wiek.add(doos(0xf5f0dc, [1.2, 4.8, 0.06], [0.7, 3.6, 0.05]));
    wieken.add(wiek);
  }
  g.add(wieken);
  return info(g, [{ r: 3.3 }], rondom(4.4, 4, 0.4), 5, {
    update: (dt) => { wieken.rotation.z -= dt * 0.6; },
  });
}

export function hekSegment(lengte = 3, kleur = 0xffffff) {
  const g = groep();
  for (const x of [-lengte / 2, lengte / 2]) g.add(doos(kleur, [0.16, 1.1, 0.16], [x, 0.55, 0]));
  g.add(doos(kleur, [lengte, 0.12, 0.08], [0, 0.45, 0]));
  g.add(doos(kleur, [lengte, 0.12, 0.08], [0, 0.85, 0]));
  return info(g, [{ b: lengte, d: 0.3 }], [], lengte / 2);
}

// Een omheinde wei. opening: welke kant een ingang heeft ('z+', 'z-', 'x+', 'x-')
export function weide(w, { x, z, b, d }, { opening = 'z+', kleur = 0xffffff } = {}) {
  w.reserveer({ x, z, b, d });
  const zijden = [
    { naam: 'z+', cx: x, cz: z + d / 2, lengte: b, draai: 0 },
    { naam: 'z-', cx: x, cz: z - d / 2, lengte: b, draai: 0 },
    { naam: 'x+', cx: x + b / 2, cz: z, lengte: d, draai: Math.PI / 2 },
    { naam: 'x-', cx: x - b / 2, cz: z, lengte: d, draai: Math.PI / 2 },
  ];
  for (const zijde of zijden) {
    const n = Math.max(1, Math.round(zijde.lengte / 3));
    const seg = zijde.lengte / n;
    for (let i = 0; i < n; i++) {
      if (zijde.naam === opening && (i === Math.floor(n / 2) || i === Math.floor((n - 1) / 2))) continue;
      const t = -zijde.lengte / 2 + seg * (i + 0.5);
      const px = zijde.draai ? zijde.cx : zijde.cx + t;
      const pz = zijde.draai ? zijde.cz - t : zijde.cz;
      w.plaats(hekSegment(seg, kleur), px, pz, { draai: zijde.draai });
    }
  }
}

// ======================= Velden en kleine dingen (veel tegelijk) =======================

function instanties(geo, mat, aantal, schaduw = false) {
  const im = new THREE.InstancedMesh(geo, mat, aantal);
  im.castShadow = schaduw;
  im.receiveShadow = true;
  im.frustumCulled = false;
  return im;
}

export function maisveld(w, { x, z, b, d }) {
  const stap = 1.15, nx = Math.floor(b / stap), nz = Math.floor(d / stap), n = nx * nz;
  const steelGeo = new THREE.CylinderGeometry(0.05, 0.08, 2.3, 5);
  steelGeo.translate(0, 1.15, 0);
  const bladGeo = new THREE.ConeGeometry(0.55, 1.7, 5);
  bladGeo.translate(0, 1.45, 0);
  const kolfGeo = new THREE.CapsuleGeometry(0.09, 0.3, 3, 6);
  kolfGeo.translate(0.14, 1.6, 0);
  const stelen = instanties(steelGeo, materiaal(0x7cb342), n);
  const bladeren = instanties(bladGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }), n, true);
  const kolven = instanties(kolfGeo, materiaal(0xffd54f), n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const as = new THREE.Vector3(0, 1, 0), kleur = new THREE.Color();
  let i = 0;
  for (let ix = 0; ix < nx; ix++) {
    for (let iz = 0; iz < nz; iz++) {
      p.set(x - b / 2 + (ix + 0.5) * stap + w.tussen(-0.3, 0.3), 0, z - d / 2 + (iz + 0.5) * stap + w.tussen(-0.3, 0.3));
      q.setFromAxisAngle(as, w.rng() * Math.PI * 2);
      const sc = w.tussen(0.85, 1.15);
      s.set(sc, sc, sc);
      m.compose(p, q, s);
      stelen.setMatrixAt(i, m);
      bladeren.setMatrixAt(i, m);
      kolven.setMatrixAt(i, m);
      bladeren.setColorAt(i, kleur.setHex(w.kies([0x8bc34a, 0x9ccc65, 0x7cb342])));
      i++;
    }
  }
  w.scene.add(stelen, bladeren, kolven);
  w.reserveer({ x, z, b: b + 2, d: d + 2 });
  for (let k = 0; k < 7; k++) w.verstopplek(x + (w.rng() - 0.5) * (b - 3), z + (w.rng() - 0.5) * (d - 3));
}

export function bloemen(w, aantal, kleuren) {
  const kopGeo = new THREE.SphereGeometry(0.13, 8, 6);
  kopGeo.scale(1, 0.6, 1);
  kopGeo.translate(0, 0.42, 0);
  const steelGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 4);
  steelGeo.translate(0, 0.2, 0);
  const koppen = instanties(kopGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }), aantal);
  const stelen = instanties(steelGeo, materiaal(0x3d8b3d), aantal);
  const m = new THREE.Matrix4(), kleur = new THREE.Color();
  let i = 0;
  for (let poging = 0; poging < aantal && i < aantal; poging++) {
    const cx = (w.rng() * 2 - 1) * (w.half - 3), cz = (w.rng() * 2 - 1) * (w.half - 3);
    const k = w.kies(kleuren);
    for (let j = 0; j < 12 && i < aantal; j++) {
      const x = cx + w.tussen(-2.5, 2.5), z = cz + w.tussen(-2.5, 2.5);
      if (!w.isVrij(x, z, 0.3)) continue;
      const s = w.tussen(0.7, 1.4);
      m.makeScale(s, s, s).setPosition(x, 0, z);
      stelen.setMatrixAt(i, m);
      koppen.setMatrixAt(i, m);
      koppen.setColorAt(i, kleur.setHex(w.kies([k, k, w.kies(kleuren)])));
      i++;
    }
  }
  koppen.count = stelen.count = i;
  w.scene.add(koppen, stelen);
}

export function gras(w, aantal, kleur = 0x5cb85c) {
  const geo = new THREE.ConeGeometry(0.08, 0.5, 4);
  geo.translate(0, 0.25, 0);
  const im = instanties(geo, new THREE.MeshLambertMaterial({ color: 0xffffff }), aantal);
  const m = new THREE.Matrix4(), c = new THREE.Color(kleur), k = new THREE.Color();
  for (let i = 0; i < aantal; i++) {
    const s = w.tussen(0.6, 1.4);
    m.makeScale(s, s * w.tussen(0.8, 1.6), s).setPosition((w.rng() * 2 - 1) * (w.half - 2), 0, (w.rng() * 2 - 1) * (w.half - 2));
    im.setMatrixAt(i, m);
    im.setColorAt(i, k.copy(c).offsetHSL(0, 0, w.tussen(-0.08, 0.06)));
  }
  w.scene.add(im);
}

export function pad(w, punten, breedte = 2.5, kleur = 0xe8d3a2) {
  const plekken = [];
  for (let i = 0; i < punten.length - 1; i++) {
    const [x1, z1] = punten[i], [x2, z2] = punten[i + 1];
    const n = Math.ceil(Math.hypot(x2 - x1, z2 - z1) / 0.8);
    for (let k = 0; k <= n; k++) plekken.push([x1 + ((x2 - x1) * k) / n, z1 + ((z2 - z1) * k) / n]);
  }
  const geo = new THREE.CircleGeometry(breedte / 2, 16);
  geo.rotateX(-Math.PI / 2);
  const im = instanties(geo, materiaal(kleur, { vlak: true }), plekken.length);
  const m = new THREE.Matrix4();
  plekken.forEach(([x, z], i) => {
    m.makeTranslation(x, 0.02, z);
    im.setMatrixAt(i, m);
  });
  w.scene.add(im);
  for (let i = 0; i < plekken.length; i += 3) w.reserveer({ x: plekken[i][0], z: plekken[i][1], r: breedte / 2 + 0.3 });
}

export function vuurvliegjes(w, aantal = 300, kleur = 0xfff59d) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const verloop = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  verloop.addColorStop(0, 'rgba(255,255,255,1)');
  verloop.addColorStop(0.3, 'rgba(255,255,255,0.8)');
  verloop.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = verloop;
  ctx.fillRect(0, 0, 64, 64);

  const pos = new Float32Array(aantal * 3), basis = [];
  for (let i = 0; i < aantal; i++) {
    basis.push({ x: (w.rng() * 2 - 1) * w.half, y: w.tussen(0.6, 3.5), z: (w.rng() * 2 - 1) * w.half, f: w.rng() * 10 });
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const punten = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.55, map: new THREE.CanvasTexture(canvas), color: kleur,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  punten.frustumCulled = false;
  w.scene.add(punten);
  w.elkFrame((dt, t) => {
    for (let i = 0; i < aantal; i++) {
      const b = basis[i];
      pos[i * 3] = b.x + Math.sin(t * 0.5 + b.f * 2) * 0.9;
      pos[i * 3 + 1] = b.y + Math.sin(t * 1.3 + b.f) * 0.4;
      pos[i * 3 + 2] = b.z + Math.cos(t * 0.4 + b.f) * 0.9;
    }
    geo.attributes.position.needsUpdate = true;
  });
}

export function wolken(w, aantal = 12) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.45, fog: false });
  const rand = w.zicht;
  for (let i = 0; i < aantal; i++) {
    const wolk = groep((w.rng() * 2 - 1) * rand, w.tussen(40, 60), (w.rng() * 2 - 1) * rand);
    wolk.userData.dynamisch = true;
    const n = 4 + Math.floor(w.rng() * 3);
    for (let j = 0; j < n; j++) {
      const deel = new THREE.Mesh(bolGeometrie(), mat);
      const r = w.tussen(3, 6);
      deel.scale.set(r * 1.3, r * 0.75, r);
      deel.position.set((j - n / 2) * 4 + w.tussen(-1, 1), w.tussen(-1, 1.5), w.tussen(-2, 2));
      wolk.add(deel);
    }
    w.scene.add(wolk);
    w.elkFrame((dt) => {
      wolk.position.x += dt * 1.5;
      if (wolk.position.x > rand) wolk.position.x = -rand;
    });
  }
}

// Rand om het hele gebied: 'heg' of 'hek'
export function omheining(w, soort = 'heg', kleur) {
  const h = w.half, L = w.gebied.grootte;
  const zijden = [[0, h, 0], [0, -h, 0], [h, 0, Math.PI / 2], [-h, 0, Math.PI / 2]];
  const m = new THREE.Matrix4();
  if (soort === 'heg') {
    const k = kleur ?? 0x3f8f4a;
    for (const [x, z, r] of zijden) {
      const heg = doos(k, [L + 2, 2.4, 1.8], [x, 1.2, z]);
      heg.rotation.y = r;
      w.scene.add(heg);
    }
    const per = Math.round(L / 1.6);
    const im = instanties(new THREE.SphereGeometry(1, 10, 8), materiaal(k), per * 4, true);
    let i = 0;
    for (const [x, z, r] of zijden) {
      for (let j = 0; j < per; j++) {
        const t = -L / 2 + (j + 0.5) * (L / per), s = w.tussen(0.9, 1.3);
        m.makeScale(s, s * 0.8, s).setPosition(r ? x : t, 2.4, r ? t : z);
        im.setMatrixAt(i++, m);
      }
    }
    w.scene.add(im);
  } else {
    const k = kleur ?? 0x8d6e63;
    const per = Math.round(L / 2.5);
    const geo = new THREE.BoxGeometry(0.22, 1.4, 0.22);
    geo.translate(0, 0.7, 0);
    const palen = instanties(geo, materiaal(k), per * 4 + 4, true);
    let i = 0;
    for (const [x, z, r] of zijden) {
      for (let j = 0; j <= per; j++) {
        const t = -L / 2 + j * (L / per);
        m.makeTranslation(r ? x : t, 0, r ? t : z);
        palen.setMatrixAt(i++, m);
      }
      for (const y of [0.55, 1.05]) {
        const plank = doos(k, [L, 0.16, 0.1], [x, y, z]);
        plank.rotation.y = r;
        w.scene.add(plank);
      }
    }
    palen.count = i;
    w.scene.add(palen);
  }
}
