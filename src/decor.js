// Bibliotheek met decor voor de gebieden: bomen, struiken, gebouwen, ...
// Elke functie krijgt de wereld (w) en geeft een model terug dat met w.plaats() of
// w.verspreid() neergezet kan worden. Functies die zelf al dingen neerzetten
// (bloemen, maisveld, weide, ...) krijgen ook de wereld en geven niets terug.
import * as THREE from 'three';
import {
  bol, halfbol, doos, cilinder, kegel, torus, octa, steenvorm, schijf, groep,
  materiaal, bolGeometrie, toonVerloopKaart, lijn,
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
  const stelen = instanties(steelGeo, materiaal(0x7cb342, { rand: false }), n);
  const bladeren = instanties(bladGeo, materiaal(0xffffff, { rand: false }), n, true);
  const kolven = instanties(kolfGeo, materiaal(0xffd54f, { rand: false }), n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const as = new THREE.Vector3(0, 1, 0), kleur = new THREE.Color();
  let i = 0;
  for (let ix = 0; ix < nx; ix++) {
    for (let iz = 0; iz < nz; iz++) {
      p.set(x - b / 2 + (ix + 0.5) * stap + w.tussen(-0.3, 0.3), 0, z - d / 2 + (iz + 0.5) * stap + w.tussen(-0.3, 0.3));
      p.y = w.hoogte(p.x, p.z) - 0.1;
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
  const koppen = instanties(kopGeo, materiaal(0xffffff, { rand: false }), aantal);
  const stelen = instanties(steelGeo, materiaal(0x3d8b3d, { rand: false }), aantal);
  const m = new THREE.Matrix4(), kleur = new THREE.Color();
  let i = 0;
  for (let poging = 0; poging < aantal && i < aantal; poging++) {
    const cx = (w.rng() * 2 - 1) * (w.half - 3), cz = (w.rng() * 2 - 1) * (w.half - 3);
    const k = w.kies(kleuren);
    for (let j = 0; j < 12 && i < aantal; j++) {
      const x = cx + w.tussen(-2.5, 2.5), z = cz + w.tussen(-2.5, 2.5);
      if (!w.isVrij(x, z, 0.3) || w.isBinnen(x, z)) continue;
      const s = w.tussen(0.7, 1.4);
      m.makeScale(s, s, s).setPosition(x, w.hoogte(x, z) - 0.02, z);
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
  const im = instanties(geo, materiaal(0xffffff, { rand: false }), aantal);
  const m = new THREE.Matrix4(), c = new THREE.Color(kleur), k = new THREE.Color();
  for (let i = 0; i < aantal; i++) {
    const s = w.tussen(0.6, 1.4);
    const x = (w.rng() * 2 - 1) * (w.half - 2), z = (w.rng() * 2 - 1) * (w.half - 2);
    m.makeScale(s, s * w.tussen(0.8, 1.6), s).setPosition(x, w.hoogte(x, z) - (w.isBinnen(x, z) ? 5 : 0.05), z);
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
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), n = new THREE.Vector3(), p = new THREE.Vector3();
  const omhoog = new THREE.Vector3(0, 1, 0), een = new THREE.Vector3(1, 1, 1), e = 0.5;
  plekken.forEach(([x, z], i) => {
    n.set(w.hoogte(x - e, z) - w.hoogte(x + e, z), 2 * e, w.hoogte(x, z - e) - w.hoogte(x, z + e)).normalize();
    q.setFromUnitVectors(omhoog, n);
    m.compose(p.set(x, w.hoogte(x, z) + 0.03, z), q, een);
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
    const x = (w.rng() * 2 - 1) * w.half, z = (w.rng() * 2 - 1) * w.half;
    basis.push({ x, y: w.hoogte(x, z) + w.tussen(0.6, 3.5), z, f: w.rng() * 10 });
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

// Roze bloesemblaadjes die rond het hondje naar beneden dwarrelen
export function bloesem(w, aantal = 220, kleuren = [0xffb7c9, 0xff9eb8, 0xffd1dc, 0xffffff]) {
  const geo = new THREE.SphereGeometry(1, 6, 4);
  geo.scale(0.14, 0.025, 0.1);
  const im = instanties(geo, materiaal(0xffffff, { rand: false }), aantal);
  const BOX = 40, HOOG = 14;
  const blaadjes = [];
  const kleur = new THREE.Color();
  for (let i = 0; i < aantal; i++) {
    blaadjes.push({ x: w.rng() * BOX, y: w.rng() * HOOG, z: w.rng() * BOX, v: w.tussen(0.6, 1.3), f: w.rng() * 10, r1: w.tussen(0.5, 2), r2: w.tussen(0.5, 2) });
    im.setColorAt(i, kleur.setHex(w.kies(kleuren)));
  }
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1);
  const rond = (waarde, midden) => midden + ((((waarde - midden + BOX / 2) % BOX) + BOX) % BOX) - BOX / 2;
  w.scene.add(im);
  w.elkFrame((dt, t, speler) => {
    if (!speler) return;
    blaadjes.forEach((b, i) => {
      b.y -= b.v * dt;
      if (b.y < 0) b.y += HOOG;
      p.set(rond(b.x + Math.sin(t * 0.7 + b.f) * 1.5, speler.x), speler.y - 2 + b.y, rond(b.z + Math.cos(t * 0.5 + b.f) * 1.5, speler.z));
      q.setFromEuler(e.set(t * b.r1 + b.f, t * b.r2, Math.sin(t + b.f)));
      m.compose(p, q, s);
      im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
  });
}

export function wolken(w, aantal = 12) {
  const mat = new THREE.MeshToonMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.45, fog: false, gradientMap: toonVerloopKaart() });
  mat.userData.outlineParameters = lijn(0xb8c4ff, 0.002);
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

// Rand om het hele gebied: 'heg', 'hek' of 'bomen' (bomen werkt ook op heuvels)
export function omheining(w, soort = 'heg', kleur) {
  const h = w.half, L = w.gebied.grootte;
  const zijden = [[0, h, 0], [0, -h, 0], [h, 0, Math.PI / 2], [-h, 0, Math.PI / 2]];
  const m = new THREE.Matrix4();
  if (soort === 'bomen') {
    for (const [x, z, r] of zijden) {
      for (let t = -h; t <= h; t += 3.2) {
        w.plaats(dennenboom(w), (r ? x : t) + w.tussen(-0.8, 0.8), (r ? t : z) + w.tussen(-0.8, 0.8), { schaal: w.tussen(1.1, 1.6) });
      }
    }
  } else if (soort === 'heg') {
    const k = kleur ?? 0x3f8f4a;
    for (const [x, z, r] of zijden) {
      const heg = doos(k, [L + 2, 2.4, 1.8], [x, 1.2, z]);
      heg.rotation.y = r;
      w.scene.add(heg);
    }
    const per = Math.round(L / 1.6);
    const im = instanties(new THREE.SphereGeometry(1, 10, 8), materiaal(k, { rand: false }), per * 4, true);
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
    const palen = instanties(geo, materiaal(k, { rand: false }), per * 4 + 4, true);
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

// ======================= Japanse tuin =======================

export function sakura(w) {
  const g = groep();
  const stam = 0x6b4040;
  g.add(cilinder(stam, 0.25, 0.4, 1.6, [0, 0.8, 0], 8));
  const tak1 = cilinder(stam, 0.14, 0.22, 1.6, [0.35, 2.1, 0], 8);
  tak1.rotation.z = -0.45;
  g.add(tak1);
  const tak2 = cilinder(stam, 0.11, 0.19, 1.4, [-0.4, 2.0, 0.1], 8);
  tak2.rotation.z = 0.55;
  g.add(tak2);
  const roze = [0xffc4d8, 0xffb0cb, 0xffd9e6, 0xffe9f0];
  const wolkjes = [[0.9, 3.0, 0, 1.3], [-0.9, 2.9, 0.2, 1.2], [0, 3.6, 0, 1.4], [0.4, 3.1, 1, 1.0], [-0.3, 3.2, -1, 1.1], [1.7, 2.7, -0.4, 0.8], [-1.7, 2.6, 0.5, 0.8]];
  for (const [x, y, z, r] of wolkjes) g.add(bol(w.kies(roze), r, [x, y, z], [1, 0.8, 1]));
  g.add(schijf(0xffd3df, 2.5, [0, 0.03, 0])); // gevallen blaadjes
  return info(g, [{ r: 0.45 }], rondom(1.5, 3, w.rng() * 6), 2.4);
}

export function torii() {
  const g = groep();
  const rood = 0xe0402f, zwart = 0x2e2626;
  for (const s of [-1, 1]) {
    g.add(cilinder(rood, 0.22, 0.26, 4.2, [s * 2.4, 2.1, 0], 12));
    g.add(cilinder(zwart, 0.3, 0.3, 0.4, [s * 2.4, 0.2, 0], 12));
    const punt = doos(zwart, [0.9, 0.28, 0.7], [s * 3.85, 4.58, 0]);
    punt.rotation.z = s * 0.3;
    g.add(punt);
  }
  g.add(doos(rood, [5.6, 0.3, 0.35], [0, 3.3, 0]));
  g.add(doos(rood, [6.4, 0.35, 0.5], [0, 4.15, 0]));
  g.add(doos(zwart, [7.0, 0.3, 0.7], [0, 4.45, 0]));
  g.add(doos(rood, [0.3, 0.8, 0.3], [0, 3.75, 0]));
  return info(g, [{ x: -2.4, r: 0.35 }, { x: 2.4, r: 0.35 }], [[-3.3, 0.9], [3.3, -0.9]], 3.8);
}

export function steenlantaarn() {
  const g = groep();
  const steen = 0xbdb6ad;
  g.add(cilinder(steen, 0.45, 0.55, 0.3, [0, 0.15, 0], 6));
  g.add(cilinder(steen, 0.16, 0.2, 1.0, [0, 0.8, 0], 8));
  g.add(cilinder(steen, 0.42, 0.3, 0.2, [0, 1.38, 0], 6));
  g.add(doos(0xfff1a8, [0.42, 0.4, 0.42], [0, 1.68, 0], { gloed: 0.9 }));
  for (const x of [-0.24, 0.24]) for (const z of [-0.24, 0.24]) g.add(doos(steen, [0.09, 0.42, 0.09], [x, 1.68, z]));
  g.add(kegel(steen, 0.62, 0.45, [0, 2.1, 0], 6));
  g.add(bol(steen, 0.1, [0, 2.4, 0]));
  return info(g, [{ r: 0.5 }], rondom(1.3, 2, 0.5), 1.0);
}

export function bamboe(w) {
  const g = groep();
  const n = 7 + Math.floor(w.rng() * 5);
  for (let i = 0; i < n; i++) {
    const a = w.rng() * Math.PI * 2, d = w.rng() * 1.4, h = w.tussen(4, 6.5);
    const x = Math.cos(a) * d, z = Math.sin(a) * d;
    g.add(cilinder(w.kies([0x7cb342, 0x8bc34a, 0x689f38]), 0.09, 0.11, h, [x, h / 2, z], 7));
    for (let y = 1; y < h; y += 1.1) g.add(cilinder(0x558b2f, 0.125, 0.125, 0.06, [x, y, z], 7));
    g.add(kegel(0x7cb342, 0.55, 1.1, [x, h, z], 5));
  }
  // geen botsing: je kunt tussen de stengels door, en een vriendje kan erin zitten
  return info(g, [], [[0, 0]], 2);
}

export function pagode() {
  const g = groep();
  const rood = 0xd8483a, wit = 0xfaf3e6, dak = 0x3d3a4a;
  g.add(doos(0xb0aaa0, [7, 0.6, 7], [0, 0.3, 0]));
  let y = 0.6, b = 5;
  for (let i = 0; i < 3; i++) {
    const h = 2.4 - i * 0.3;
    g.add(doos(rood, [b, h, b], [0, y + h / 2, 0]));
    g.add(doos(wit, [b * 0.4, h * 0.45, 0.1], [0, y + h * 0.5, b / 2 + 0.02]));
    const kap = kegel(dak, b * 0.98, 1.4, [0, y + h + 0.5, 0], 4);
    kap.rotation.y = Math.PI / 4;
    g.add(kap);
    y += h + 0.9;
    b *= 0.75;
  }
  g.add(cilinder(0xd4af37, 0.08, 0.12, 1.8, [0, y + 0.4, 0], 8, { gloed: 0.3 }));
  return info(g, [{ b: 7, d: 7 }], [[4.6, 4.6], [-4.6, 4.6], [4.6, -4.6], [-4.6, -4.6], [0, -4.6]], 6);
}

// Vijver met zwemmende koi en een rood bruggetje erover
export function koivijver(w, r = 6) {
  const g = vijver(w, r);
  const rood = 0xe0402f;
  const n = 12, lengte = r * 2 + 2.4;
  for (let i = 0; i < n; i++) {
    const t0 = i / n - 0.5, t1 = (i + 1) / n - 0.5;
    const y0 = Math.cos(t0 * Math.PI) * 1.4, y1 = Math.cos(t1 * Math.PI) * 1.4;
    const x0 = t0 * lengte, x1 = t1 * lengte;
    const stuk = Math.hypot(x1 - x0, y1 - y0) + 0.05, hoek = Math.atan2(y1 - y0, x1 - x0);
    const plank = doos(0xc0392b, [stuk, 0.15, 1.6], [(x0 + x1) / 2, (y0 + y1) / 2 + 0.1, 0]);
    plank.rotation.z = hoek;
    g.add(plank);
    for (const z of [-0.8, 0.8]) {
      const leuning = doos(rood, [stuk, 0.1, 0.1], [(x0 + x1) / 2, (y0 + y1) / 2 + 0.85, z]);
      leuning.rotation.z = hoek;
      g.add(leuning);
      if (i % 2 === 0) g.add(cilinder(rood, 0.06, 0.06, 0.8, [x0, y0 + 0.5, z], 6));
    }
  }
  // koi
  const vissen = groep();
  vissen.userData.dynamisch = true;
  const koiData = [];
  for (let i = 0; i < 6; i++) {
    const koi = groep();
    const kleur = w.kies([0xff7a33, 0xffffff, 0xff9a52, 0xffd166]);
    koi.add(bol(kleur, 0.28, [0, 0, 0], [0.5, 0.28, 1], { rand: false }));
    koi.add(bol(0xffffff, 0.12, [0, 0.03, 0.08], [0.6, 0.3, 0.8], { rand: false }));
    const staart = kegel(kleur, 0.14, 0.25, [0, 0, -0.32], 4, { rand: false });
    staart.rotation.x = -Math.PI / 2;
    koi.add(staart);
    vissen.add(koi);
    koiData.push({ koi, straal: w.tussen(1.5, r - 1.5), snelheid: w.tussen(0.3, 0.6) * (w.kans(0.5) ? 1 : -1), fase: w.rng() * 6 });
  }
  g.add(vissen);
  g.userData.update = (dt, t) => {
    for (const k of koiData) {
      const a = t * k.snelheid + k.fase;
      k.koi.position.set(Math.cos(a) * k.straal, 0.05, Math.sin(a) * k.straal);
      // zwemrichting = afgeleide van de cirkel
      k.koi.rotation.y = Math.atan2(-Math.sin(a) * k.snelheid, Math.cos(a) * k.snelheid);
    }
  };
  return g;
}

// ======================= Bos =======================

export function berk(w) {
  const g = groep();
  const h = w.tussen(3, 4.2);
  g.add(cilinder(0xf4f1ea, 0.17, 0.22, h + 0.3, [0, h / 2 - 0.15, 0], 8));
  for (let i = 0; i < 6; i++) {
    const y = w.tussen(0.4, h - 0.3), a = w.rng() * Math.PI * 2;
    const vlek = doos(0x3a3a3a, [0.14, 0.05, 0.05], [Math.cos(a) * 0.19, y, Math.sin(a) * 0.19], { rand: false });
    vlek.rotation.y = -a;
    g.add(vlek);
  }
  const groen = [0xa5d66f, 0x8fcf5f, 0xc2e07a];
  g.add(bol(w.kies(groen), 1.1, [0, h + 0.6, 0], [0.9, 1.2, 0.9]));
  g.add(bol(w.kies(groen), 0.8, [0.5, h + 0.1, 0.3]));
  g.add(bol(w.kies(groen), 0.8, [-0.5, h + 0.3, -0.3]));
  return info(g, [{ r: 0.3 }], rondom(1.2, 2, w.rng() * 6), 1.6);
}

export function boomstronk(w) {
  const g = groep();
  const r = w.tussen(0.45, 0.7);
  g.add(cilinder(0x8d6e63, r, r * 1.15, 0.9, [0, 0.25, 0], 10));
  g.add(cilinder(0xe8cfa6, r * 0.9, r * 0.9, 0.03, [0, 0.71, 0], 10));
  g.add(bol(0xe53935, 0.12, [r * 0.9, 0.35, 0], [1, 0.5, 1]));
  return info(g, [{ r: r * 1.1 }], rondom(r + 0.9, 3, w.rng() * 6), r + 0.6);
}

export function boomstam(w) {
  const g = groep();
  const L = w.tussen(3.5, 5);
  const stam = cilinder(0x8d6e63, 0.45, 0.5, L, [0, 0.4, 0], 10);
  stam.rotation.z = Math.PI / 2;
  g.add(stam);
  for (const s of [-1, 1]) {
    const eind = cilinder(0xe8cfa6, 0.42, 0.42, 0.03, [s * L / 2, 0.4, 0], 10);
    eind.rotation.z = Math.PI / 2;
    g.add(eind);
  }
  g.add(bol(0x7cb342, 0.4, [-L * 0.15, 0.8, 0], [1.6, 0.35, 0.9]));
  const tak = cilinder(0x8d6e63, 0.08, 0.12, 0.7, [L * 0.2, 0.9, 0.1], 6);
  tak.rotation.z = -0.4;
  g.add(tak);
  return info(g, [{ b: L, d: 1.0 }], [[0, 1.2], [0, -1.2], [L / 2 + 0.8, 0]], L / 2);
}

export function varen(w) {
  const g = groep();
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + w.rng() * 0.3;
    const blad = kegel(w.kies([0x4caf50, 0x5cbf60, 0x43a047]), 0.2, 1.3, [Math.cos(a) * 0.5, 0.45, Math.sin(a) * 0.5], 4);
    blad.rotation.set(Math.sin(a) * 1.0, 0, -Math.cos(a) * 1.0);
    g.add(blad);
  }
  return info(g, [], [[0, 0]], 1.2);
}

export function paddenstoeltjes(w) {
  const g = groep();
  for (let i = 0; i < 3; i++) {
    const h = w.tussen(0.25, 0.45), r = w.tussen(0.15, 0.25);
    const x = w.tussen(-0.4, 0.4), z = w.tussen(-0.4, 0.4);
    g.add(cilinder(0xfff3e0, 0.06, 0.08, h, [x, h / 2, z], 6));
    g.add(halfbol(w.kies([0xe53935, 0xff7043, 0xb0763a]), r, [x, h, z], [1, 0.7, 1]));
    g.add(bol(0xffffff, r * 0.2, [x + r * 0.3, h + r * 0.45, z], [1, 0.5, 1], { rand: false }));
  }
  return info(g, [], [], 0.6);
}

export function rotsblok(w) {
  const g = groep();
  const r = w.tussen(1.4, 2.2);
  g.add(steenvorm(w.kies([0x9e9e9e, 0xa8a29a]), r, [0, r * 0.35, 0], [1, 0.75, 0.9]));
  g.add(bol(0x7cb342, r * 0.55, [0, r * 0.85, 0], [1.2, 0.3, 1]));
  return info(g, [{ r: r * 0.9 }], rondom(r + 0.9, 3, w.rng() * 6), r + 0.5);
}

export function blokhut() {
  const g = groep();
  const b = 6, h = 3, d = 5, hout = 0xb07a4f;
  g.add(doos(0x9e9e9e, [b + 0.8, 2, d + 0.8], [0, -0.75, 0]));
  g.add(doos(0x9a6640, [b - 0.2, h, d - 0.2], [0, h / 2, 0]));
  for (let y = 0.25; y < h; y += 0.5) {
    for (const s of [-1, 1]) {
      const voor = cilinder(hout, 0.25, 0.25, b + 0.5, [0, y, s * d / 2], 8);
      voor.rotation.z = Math.PI / 2;
      g.add(voor);
      const zij = cilinder(hout, 0.25, 0.25, d + 0.5, [s * b / 2, y, 0], 8);
      zij.rotation.x = Math.PI / 2;
      g.add(zij);
    }
  }
  const dak = zadeldak(b + 0.4, d + 0.8, 2.2, hout, 0x6d4c41);
  dak.position.y = h;
  g.add(dak);
  g.add(doos(0x5d4037, [1, 1.9, 0.15], [0, 0.95, d / 2 + 0.27]));
  for (const x of [-1.8, 1.8]) g.add(doos(0xfff1a8, [0.8, 0.7, 0.12], [x, 1.6, d / 2 + 0.27], { gloed: 0.5 }));
  g.add(doos(0x9e9e9e, [0.7, 2, 0.7], [1.8, h + 1.6, -1]));
  const verstop = [[b / 2 + 1.2, d / 2 + 1.2], [-b / 2 - 1.2, d / 2 + 1.2], [b / 2 + 1.2, -d / 2 - 1.2], [-b / 2 - 1.2, -d / 2 - 1.2], [0, -d / 2 - 1.2]];
  return info(g, [{ b: b + 0.5, d: d + 0.5 }], verstop, 5);
}

// Hulpjes voor de decor-bestanden in src/decor/
export { rondom, info, zadeldak, instanties };
