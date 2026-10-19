// Snackbar-decor: de grote snackbar (waar je in kunt), terrasjes, patatkraam, ijscokar,
// reuzensnacks, autootjes en ander stadsplein-spul.
import * as THREE from 'three';
import { bol, halfbol, doos, cilinder, kegel, torus, groep, toonVerloopKaart, GEEN_LIJN } from '../hulp/vormen.js';
import { rondom, info } from '../decor.js';

const ROOD = 0xe63946, WIT = 0xffffff, GLAS = 0xbfe9ff;

// Bordje met tekst (getekend op een canvas)
export function tekstBord(regels, b, h, { kleur = '#ffffff', achter = '#e63946', rand = '#ffffff' } = {}) {
  regels = [].concat(regels);
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = Math.max(64, Math.round((512 * h) / b));
  const ctx = c.getContext('2d');
  ctx.fillStyle = rand;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = achter;
  ctx.fillRect(8, 8, c.width - 16, c.height - 16);
  ctx.fillStyle = kleur;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const regelHoogte = (c.height - 16) / regels.length;
  ctx.font = `bold ${Math.round(regelHoogte * 0.62)}px Fredoka, "Arial Rounded MT Bold", Arial, sans-serif`;
  regels.forEach((r, i) => ctx.fillText(r, c.width / 2, 8 + regelHoogte * (i + 0.55)));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  mat.userData.outlineParameters = GEEN_LIJN;
  return new THREE.Mesh(new THREE.PlaneGeometry(b, h), mat);
}

// Zwart-witte (of rood-witte) tegelvloer
function tegelvloer(b, d, kleurA = '#ffffff', kleurB = '#e63946') {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = kleurA;
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = kleurB;
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillRect(32, 32, 32, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.repeat.set(b / 2, d / 2);
  const mat = new THREE.MeshToonMaterial({ map: tex, gradientMap: toonVerloopKaart() });
  mat.userData.outlineParameters = GEEN_LIJN;
  const vloer = new THREE.Mesh(new THREE.PlaneGeometry(b, d), mat);
  vloer.rotation.x = -Math.PI / 2;
  vloer.position.y = 0.13;
  vloer.receiveShadow = true;
  return vloer;
}

function luifel(g, breedte, y, z, stroken = 11) {
  const s = breedte / stroken;
  for (let i = 0; i < stroken; i++) {
    const strook = doos(i % 2 ? WIT : ROOD, [s, 0.08, 1.6], [-breedte / 2 + s * (i + 0.5), y, z]);
    strook.rotation.x = 0.35;
    g.add(strook);
  }
}

function frietjes(g, x, y, z, breedte, aantal, hoogte = 0.6) {
  for (let i = 0; i < aantal; i++) {
    const h = hoogte * (0.7 + Math.random() * 0.6);
    const friet = doos(i % 3 ? 0xffd35a : 0xf2b83c, [breedte * 0.16, h, breedte * 0.16], [x + (Math.random() - 0.5) * breedte * 0.8, y + h / 2, z + (Math.random() - 0.5) * breedte * 0.6]);
    friet.rotation.set((Math.random() - 0.5) * 0.4, Math.random(), (Math.random() - 0.5) * 0.4);
    g.add(friet);
  }
}

// Reuzenpatat als reclame (bijvoorbeeld op het dak)
export function reuzePatat() {
  const g = groep();
  const bak = cilinder(ROOD, 1.3, 0.9, 1.8, [0, 0.9, 0], 4);
  bak.rotation.y = Math.PI / 4;
  g.add(bak);
  frietjes(g, 0, 1.6, 0, 1.6, 22, 1.4);
  g.add(bol(0xfffbea, 0.45, [0.2, 2.9, 0.1], [1.3, 0.6, 1.3]));
  return info(g, [{ r: 1.2 }], rondom(2.2, 3, 0.3), 1.8);
}

export function reuzeIjsje() {
  const g = groep();
  g.add(cilinder(0x9e9e9e, 0.5, 0.6, 0.3, [0, 0.15, 0], 12));
  const hoorn = kegel(0xd9a35c, 0.9, 2.2, [0, 1.4, 0], 14);
  hoorn.rotation.x = Math.PI;
  g.add(hoorn);
  g.add(bol(0xfff3f6, 1.05, [0, 2.7, 0], [1, 0.6, 1]));
  g.add(bol(0xffc2d6, 0.82, [0, 3.35, 0], [1, 0.6, 1]));
  g.add(bol(0xfff3f6, 0.58, [0, 3.85, 0], [1, 0.65, 1]));
  g.add(kegel(0xffc2d6, 0.3, 0.5, [0, 4.3, 0], 10));
  g.add(bol(0xe0233f, 0.22, [0, 4.6, 0]));
  return info(g, [{ r: 1.0 }], rondom(2.0, 3, 0.6), 1.6);
}

export function parasolTafel(w) {
  const g = groep();
  const hout = 0xb5835a;
  g.add(doos(hout, [2.2, 0.1, 1.0], [0, 0.8, 0]));
  for (const z of [-0.85, 0.85]) g.add(doos(hout, [2.2, 0.08, 0.35], [0, 0.45, z]));
  for (const x of [-0.9, 0.9]) {
    const poot = doos(hout, [0.1, 0.9, 2.0], [x, 0.4, 0]);
    g.add(poot);
  }
  const kleur = w.kies([ROOD, 0x4fb3ff, 0xffb703, 0x8ce99a]);
  g.add(cilinder(0xdddddd, 0.04, 0.04, 2.6, [0, 1.3, 0], 6));
  g.add(kegel(kleur, 1.6, 0.7, [0, 2.6, 0], 10));
  g.add(kegel(WIT, 0.5, 0.3, [0, 2.88, 0], 10));
  g.add(bol(kleur, 0.08, [0, 3.05, 0]));
  g.add(cilinder(ROOD, 0.06, 0.06, 0.2, [0.4, 0.95, 0.1], 8));
  g.add(cilinder(0xfff3c4, 0.06, 0.06, 0.2, [0.55, 0.95, 0.1], 8));
  return info(g, [{ r: 1.2 }], rondom(2.0, 3, w.rng() * 6), 1.8);
}

export function patatkraam() {
  const g = groep();
  g.add(doos(0xffe066, [2.6, 2.4, 5], [0, 1.6, 0]));
  g.add(doos(0xffe066, [2.6, 1.4, 1.2], [0, 1.1, 3.1]));
  g.add(doos(GLAS, [2.4, 0.8, 0.05], [0, 1.6, 3.72]));
  g.add(doos(0x3a3a4a, [0.06, 1.0, 2.6], [1.31, 1.9, -0.4]));
  luifel(g, 2.8, 2.7, 0, 5);
  for (const z of [-1.6, 1.8]) {
    for (const s of [-1, 1]) {
      const wiel = cilinder(0x263238, 0.45, 0.45, 0.3, [s * 1.3, 0.45, z], 14);
      wiel.rotation.z = Math.PI / 2;
      g.add(wiel);
    }
  }
  const bord = tekstBord('PATAT', 2.4, 0.7);
  bord.position.set(1.34, 3.1, -0.4);
  bord.rotation.y = Math.PI / 2;
  g.add(bord);
  const dakFriet = groep(0, 2.8, -0.5);
  dakFriet.scale.setScalar(0.6);
  dakFriet.add(...reuzePatat().children);
  g.add(dakFriet);
  return info(g, [{ b: 2.8, d: 6.4, z: 0.4 }], [[2.6, -2], [-2.4, 0], [0, -3.4], [2.6, 2.8]], 3.5);
}

export function ijscokar(w) {
  const g = groep();
  g.add(doos(0xfff3f6, [1.6, 1.0, 1.0], [0, 0.85, 0]));
  g.add(doos(0x5ad1ff, [1.65, 0.15, 1.05], [0, 1.4, 0]));
  for (const s of [-1, 1]) {
    const wiel = cilinder(0x263238, 0.3, 0.3, 0.12, [s * 0.5, 0.3, 0.52], 12);
    wiel.rotation.x = Math.PI / 2;
    g.add(wiel);
  }
  g.add(cilinder(0xdddddd, 0.03, 0.03, 1.6, [0, 2.2, 0], 6));
  g.add(kegel(w.kies([0xff8fab, 0x5ad1ff]), 1.1, 0.5, [0, 3.0, 0], 10));
  const ijsje = groep(0.5, 1.45, 0);
  ijsje.add(...reuzeIjsje().children.slice(1));
  ijsje.scale.setScalar(0.18);
  g.add(ijsje);
  return info(g, [{ r: 0.9 }], rondom(1.8, 3, 0.5), 1.5);
}

export function bankje() {
  const g = groep();
  const hout = 0xb5835a;
  g.add(doos(hout, [2, 0.1, 0.5], [0, 0.5, 0]));
  g.add(doos(hout, [2, 0.5, 0.08], [0, 0.85, -0.25]));
  for (const x of [-0.85, 0.85]) g.add(doos(0x455a64, [0.08, 0.5, 0.5], [x, 0.25, 0]));
  return info(g, [{ b: 2, d: 0.6 }], [[0, -0.9]], 1.2);
}

export function plantenbak(w) {
  const g = groep();
  g.add(doos(0xb5835a, [1.6, 0.6, 1.6], [0, 0.3, 0]));
  g.add(bol(w.kies([0x5aad5a, 0x4f9d4f]), 0.7, [0, 0.8, 0], [1, 0.7, 1]));
  for (let i = 0; i < 5; i++) {
    const a = w.rng() * Math.PI * 2;
    g.add(bol(w.kies([0xff6fae, 0xffd166, 0xffffff]), 0.1, [Math.cos(a) * 0.6, 0.95, Math.sin(a) * 0.6], [1, 1, 1], { rand: false }));
  }
  return info(g, [{ b: 1.6, d: 1.6 }], rondom(1.7, 2, w.rng() * 6), 1.2);
}

export function prullenbak() {
  const g = groep();
  g.add(cilinder(0x4caf50, 0.32, 0.28, 0.9, [0, 0.45, 0], 12));
  g.add(cilinder(0x388e3c, 0.35, 0.35, 0.08, [0, 0.92, 0], 12));
  return info(g, [{ r: 0.35 }], [], 0.6);
}

export function autootje(w) {
  const g = groep();
  const kleur = w.kies([0xff8fab, 0x5ad1ff, 0xffd166, 0x8ce99a, 0xb388ff, 0xff9e6b]);
  g.add(bol(kleur, 1.2, [0, 0.75, 0], [0.75, 0.42, 1.5]));
  g.add(bol(kleur, 0.75, [0, 1.15, -0.2], [1, 0.75, 1.2]));
  g.add(bol(GLAS, 0.72, [0, 1.18, -0.15], [1.02, 0.6, 1.1], { rand: false }));
  for (const z of [-1.0, 1.0]) {
    for (const s of [-1, 1]) {
      const wiel = cilinder(0x263238, 0.38, 0.38, 0.3, [s * 0.82, 0.38, z], 14);
      wiel.rotation.z = Math.PI / 2;
      g.add(wiel);
      g.add(bol(0xfff7c2, 0.13, [s * 0.5, 0.85, 1.72], [1, 1, 0.5], { gloed: 0.6, rand: false }));
    }
  }
  return info(g, [{ b: 1.9, d: 3.6 }], [[1.6, 0], [-1.6, 0], [0, -2.5]], 2.2);
}

// De grote snackbar. Als het hondje binnen is, verdwijnen dak en bordjes (zoals bij een poppenhuis).
export function snackbar() {
  const g = groep();
  const muur = 0xfff4e0, B = 22, D = 14, H = 3.8, T = 0.4;
  const botsers = [];
  const muurStuk = (x, z, b, d) => {
    g.add(doos(muur, [b, H, d], [x, H / 2, z]));
    botsers.push({ x, z, b, d });
  };
  muurStuk(-B / 2, 0, T, D);
  muurStuk(B / 2, 0, T, D);
  muurStuk(0, -D / 2, B, T);
  muurStuk(-6.3, D / 2, 9.4, T);
  muurStuk(6.3, D / 2, 9.4, T);
  g.add(doos(ROOD, [3.2, 0.5, T + 0.1], [0, H - 0.25, D / 2]));
  g.add(tegelvloer(B - 0.4, D - 0.4));
  // grote ramen voor en opzij
  for (const x of [-6.3, 6.3]) g.add(doos(GLAS, [7, 2, 0.06], [x, 2.0, D / 2 + 0.22], { gloed: 0.15 }));
  for (const z of [-3, 3]) for (const s of [-1, 1]) g.add(doos(GLAS, [0.06, 1.8, 3.5], [s * (B / 2 + 0.22), 2.0, z], { gloed: 0.15 }));
  luifel(g, B, H + 0.15, D / 2 + 0.75, 13);

  // ---- toonbank met vitrine ----
  g.add(doos(ROOD, [14, 1.1, 1.0], [-2, 0.55, -2.5]));
  g.add(doos(WIT, [14.2, 0.1, 1.1], [-2, 1.15, -2.5]));
  g.add(doos(GLAS, [9, 0.55, 0.8], [-3.5, 1.48, -2.5], { doorzichtig: 0.4, rand: false }));
  for (let i = 0; i < 12; i++) {
    const x = -7.5 + i * 0.7;
    if (i % 2) g.add(bol(0xc97a2c, 0.14, [x, 1.36, -2.5]));
    else {
      const kroket = cilinder(0xc97a2c, 0.1, 0.1, 0.4, [x, 1.32, -2.5], 8);
      kroket.rotation.z = Math.PI / 2;
      g.add(kroket);
    }
  }
  g.add(doos(0x455a64, [0.7, 0.4, 0.5], [3.5, 1.4, -2.5]));
  g.add(doos(0x9be7a8, [0.5, 0.2, 0.05], [3.5, 1.5, -2.24], { gloed: 0.6 }));
  botsers.push({ x: -2, z: -2.5, b: 14, d: 1.0 });

  // ---- frituurpannen en menubord achter de toonbank ----
  for (const x of [-6, -4, -2]) {
    g.add(doos(0xb0bec5, [1.6, 1.0, 1.0], [x, 0.5, -6.2]));
    g.add(doos(0xffc93c, [1.3, 0.05, 0.7], [x, 1.02, -6.2], { gloed: 0.5 }));
    g.add(doos(0x78909c, [0.6, 0.35, 0.5], [x, 1.2, -6.1]));
    botsers.push({ x, z: -6.2, b: 1.6, d: 1.0 });
  }
  const menu = tekstBord(['MENU', 'Patat · Kroket', 'Frikandel · Bitterbal', 'Softijs · Milkshake'], 6, 3, { achter: '#2b2b3a', kleur: '#ffe066' });
  menu.position.set(3, 2.4, -6.77);
  g.add(menu);

  // ---- automatiek (snacks uit de muur) ----
  g.add(doos(0x90a4ae, [0.3, 2.3, 4.4], [-10.75, 1.45, 2]));
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 5; k++) {
      const z = 0.25 + k * 0.85, y = 0.75 + r * 0.7;
      g.add(doos(0xfff6d0, [0.05, 0.55, 0.7], [-10.58, y, z], { gloed: 0.5 }));
      g.add(bol(0xc97a2c, 0.12, [-10.62, y - 0.08, z], [1, 0.8, 1.6], { rand: false }));
    }
  }
  botsers.push({ x: -10.75, z: 2, b: 0.4, d: 4.4 });

  // ---- tafeltjes met stoeltjes ----
  for (const [x, z] of [[-7, 2.8], [-4, 5.2], [4, 5.2], [7.5, 2.8]]) {
    g.add(cilinder(WIT, 0.8, 0.8, 0.08, [x, 0.9, z], 16));
    g.add(cilinder(0x9e9e9e, 0.06, 0.06, 0.8, [x, 0.5, z], 6));
    g.add(cilinder(ROOD, 0.06, 0.06, 0.2, [x + 0.2, 1.04, z], 8));
    g.add(cilinder(0xfff3c4, 0.06, 0.06, 0.2, [x + 0.35, 1.04, z], 8));
    for (const s of [-1, 1]) {
      g.add(doos(ROOD, [0.5, 0.08, 0.5], [x + s * 1.05, 0.5, z]));
      g.add(doos(ROOD, [0.08, 0.6, 0.5], [x + s * 1.3, 0.8, z]));
      g.add(cilinder(0x9e9e9e, 0.04, 0.04, 0.45, [x + s * 1.05, 0.25, z], 5));
    }
    botsers.push({ x, z, b: 3.0, d: 1.2 });
  }

  // ---- dak, reclameborden en reuzenpatat (verdwijnen als je binnen bent) ----
  const boven = groep();
  boven.userData.dynamisch = true;
  boven.add(doos(0xf2e6d0, [B + 0.6, 0.45, D + 0.6], [0, H + 0.22, 0]));
  boven.add(doos(ROOD, [B + 0.7, 0.2, D + 0.7], [0, H + 0.5, 0]));
  const bord = tekstBord('SNACKBAR', 10, 1.8);
  bord.position.set(0, H + 1.6, D / 2 + 0.1);
  boven.add(bord);
  boven.add(doos(WIT, [10.3, 2.1, 0.15], [0, H + 1.6, D / 2 - 0.02]));
  const dakPatat = reuzePatat();
  dakPatat.position.set(7, H + 0.6, -1);
  boven.add(dakPatat);
  g.add(boven);

  const verstop = [
    [-8, -4.5], [-0.5, -4.5], [4.5, -5.2], [8.5, -4.5], // achter de toonbank
    [-9.8, 6], [9.8, 6], [-7, 4.6], [7.5, 4.6], [0, -1.2], [-10, 0.3], [9.5, 0], // in de zaak
    [-B / 2 - 1.3, D / 2 + 1.5], [B / 2 + 1.3, D / 2 + 1.5], [-B / 2 - 1.3, -D / 2 - 1.3], [B / 2 + 1.3, -D / 2 - 1.3], [0, -D / 2 - 1.3],
  ];
  return info(g, botsers, verstop, 15, { binnen: { b: B, d: D }, verberg: boven });
}
