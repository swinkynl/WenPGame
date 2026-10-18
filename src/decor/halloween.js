// Halloween-decor: spookhuis, pompoenen, grafsteentjes, griezelbomen, heksenketels,
// vleermuizen, spookjes en een maan met sterren.
import * as THREE from 'three';
import { bol, halfbol, doos, cilinder, kegel, torus, schijf, groep, ogen, GEEN_LIJN } from '../hulp/vormen.js';
import { rondom, info, zadeldak } from '../decor.js';

const GLOEI_GEEL = 0xffe066;

export function pompoen(w, { groot = false } = {}) {
  const g = groep();
  const r = groot ? w.tussen(0.9, 1.3) : w.tussen(0.35, 0.6);
  const oranje = w.kies([0xff8a1f, 0xff9a33, 0xf57c00]);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.add(bol(oranje, r * 0.62, [Math.cos(a) * r * 0.38, r * 0.62, Math.sin(a) * r * 0.38], [0.8, 0.9, 0.8]));
  }
  g.add(cilinder(0x5d7a2a, r * 0.07, r * 0.1, r * 0.35, [0, r * 1.25, 0], 6));
  if (groot || w.kans(0.7)) {
    // kawaii-gloeigezichtje
    const gloei = { gloed: 1, rand: false };
    for (const s of [-1, 1]) g.add(bol(GLOEI_GEEL, r * 0.11, [s * r * 0.27, r * 0.7, r * 0.84], [1, 1.2, 0.4], gloei));
    const mond = torus(GLOEI_GEEL, r * 0.15, r * 0.035, [0, r * 0.5, r * 0.85], Math.PI, gloei);
    mond.rotation.z = Math.PI;
    g.add(mond);
  }
  return info(g, groot ? [{ r: r * 0.85 }] : [], groot ? rondom(r + 1, 3, w.rng() * 6) : [], r);
}

export function grafsteen(w) {
  const g = groep();
  const grijs = w.kies([0x9a9aae, 0x8a8aa0, 0xa8a8bb]);
  const steen = groep();
  steen.rotation.z = w.tussen(-0.12, 0.12);
  if (w.kans(0.7)) {
    steen.add(doos(grijs, [0.9, 0.9, 0.22], [0, 0.45, 0]));
    const top = cilinder(grijs, 0.45, 0.45, 0.22, [0, 0.9, 0], 14);
    top.rotation.x = Math.PI / 2;
    steen.add(top);
    steen.add(doos(0x6a6a80, [0.5, 0.08, 0.05], [0, 0.85, 0.12], { rand: false }));
  } else {
    steen.add(doos(grijs, [0.22, 1.4, 0.22], [0, 0.7, 0]));
    steen.add(doos(grijs, [0.8, 0.22, 0.22], [0, 1.0, 0]));
  }
  g.add(steen);
  g.add(bol(0x5a4a3a, 0.5, [0, 0.02, 0.75], [0.8, 0.2, 1.3]));
  return info(g, [{ b: 1.0, d: 0.35 }], [[0, -0.9]], 1.0);
}

export function kaleBoom(w) {
  const g = groep();
  const stam = 0x3e2f4a;
  const h = w.tussen(2.5, 3.5);
  g.add(cilinder(stam, 0.22, 0.38, h, [0, h / 2, 0], 7));
  for (let i = 0; i < 5; i++) {
    const tak = groep(0, h * w.tussen(0.55, 1.0), 0);
    tak.rotation.y = (i / 5) * Math.PI * 2 + w.rng();
    const th = w.tussen(0.6, 1.1), L = w.tussen(1, 1.8);
    const c = cilinder(stam, 0.05, 0.11, L, [Math.sin(th) * L / 2, Math.cos(th) * L / 2, 0], 5);
    c.rotation.z = -th;
    tak.add(c);
    const th2 = th - 0.6, L2 = L * 0.5, ex = Math.sin(th) * L, ey = Math.cos(th) * L;
    const c2 = cilinder(stam, 0.03, 0.05, L2, [ex + Math.sin(th2) * L2 / 2, ey + Math.cos(th2) * L2 / 2, 0], 5);
    c2.rotation.z = -th2;
    tak.add(c2);
    if (i === 0 && w.kans(0.4)) tak.add(bol(0xffb347, 0.15, [ex, ey - 0.35, 0], [1, 1.2, 1], { gloed: 1 }));
    g.add(tak);
  }
  return info(g, [{ r: 0.4 }], rondom(1.3, 3, w.rng() * 6), 1.8);
}

export function heksenketel(w) {
  const g = groep();
  // vuurtje
  for (const a of [0, Math.PI / 2]) {
    const blok = cilinder(0x5a3e2b, 0.08, 0.08, 1.2, [0, 0.08, 0], 6);
    blok.rotation.set(Math.PI / 2, a, 0);
    g.add(blok);
  }
  g.add(kegel(0xff7a1a, 0.35, 0.6, [0, 0.35, 0], 8, { gloed: 1, rand: false }));
  g.add(kegel(GLOEI_GEEL, 0.18, 0.4, [0, 0.3, 0], 8, { gloed: 1, rand: false }));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    g.add(cilinder(0x2b2b33, 0.05, 0.05, 0.6, [Math.cos(a) * 0.55, 0.3, Math.sin(a) * 0.55], 5));
  }
  // ketel
  const pot = halfbol(0x2b2b33, 0.8, [0, 1.3, 0], [1, 1.1, 1]);
  pot.rotation.x = Math.PI;
  g.add(pot);
  const rand = torus(0x3a3a44, 0.8, 0.08, [0, 1.3, 0]);
  rand.rotation.x = Math.PI / 2;
  g.add(rand);
  g.add(schijf(0x7cff6b, 0.76, [0, 1.25, 0], { gloed: 0.8, vlak: false }));
  const bubbels = groep();
  bubbels.userData.dynamisch = true;
  for (let i = 0; i < 5; i++) bubbels.add(bol(0x9cff8f, 0.1, [0, 0, 0], [1, 1, 1], { gloed: 0.8, rand: false }));
  g.add(bubbels);
  return info(g, [{ r: 0.95 }], rondom(1.9, 3, w.rng() * 6), 1.5, {
    update: (dt, t) => bubbels.children.forEach((b, i) => {
      const p = (t * 0.5 + i / 5) % 1, a = i * 2.4;
      b.position.set(Math.cos(a) * 0.35, 1.3 + p * 0.8, Math.sin(a) * 0.35);
      b.scale.setScalar(0.1 * (1 - p));
    }),
  });
}

export function vogelverschrikker() {
  const g = groep();
  const hout = 0x7a5a3a;
  g.add(cilinder(hout, 0.07, 0.08, 2.4, [0, 1.2, 0], 6));
  const arm = cilinder(hout, 0.05, 0.05, 1.8, [0, 1.75, 0], 6);
  arm.rotation.z = Math.PI / 2;
  g.add(arm);
  g.add(doos(0x7e57c2, [0.9, 0.9, 0.4], [0, 1.6, 0]));
  for (const s of [-1, 1]) g.add(doos(0x7e57c2, [0.6, 0.25, 0.3], [s * 0.65, 1.75, 0]));
  g.add(bol(0xff8a1f, 0.38, [0, 2.4, 0], [1.1, 0.95, 1]));
  const gloei = { gloed: 1, rand: false };
  for (const s of [-1, 1]) g.add(bol(GLOEI_GEEL, 0.06, [s * 0.13, 2.45, 0.34], [1, 1.2, 0.4], gloei));
  const mond = torus(GLOEI_GEEL, 0.1, 0.02, [0, 2.32, 0.35], Math.PI, gloei);
  mond.rotation.z = Math.PI;
  g.add(mond);
  g.add(cilinder(0x3b2d52, 0.5, 0.5, 0.05, [0, 2.7, 0], 16));
  g.add(kegel(0x3b2d52, 0.28, 0.6, [0, 3.0, 0], 12));
  return info(g, [{ r: 0.3 }], rondom(1.2, 2, 0.8), 1.2);
}

// Groot spookhuis waar je in kunt. Als het hondje binnen is, verdwijnen de bovenverdieping
// en het dak (zoals bij een poppenhuis), zodat je de kamers kunt zien.
export function spookhuis(w) {
  const g = groep();
  const muur = 0x8a7aaa, binnenmuur = 0xc3b2e0, rand = 0x4a3b63, dakKleur = 0x3b2d52, hout = 0x5a3a2a;
  const B = 16, D = 12, H = 3.6, T = 0.4;
  const botsers = [];
  const muurStuk = (x, z, b, d, kleur = muur, h = H) => {
    g.add(doos(kleur, [b, h, d], [x, h / 2, z]));
    botsers.push({ x, z, b, d });
  };
  // buitenmuren, met een deuropening voor
  muurStuk(-B / 2, 0, T, D);
  muurStuk(B / 2, 0, T, D);
  muurStuk(0, -D / 2, B, T);
  muurStuk(-4.6, D / 2, 6.8, T);
  muurStuk(4.6, D / 2, 6.8, T);
  g.add(doos(rand, [2.4, 0.6, T + 0.1], [0, H - 0.3, D / 2]));
  // lage binnenmuren (zodat je over ze heen de kamers in kijkt): hal voor, keuken links achter, slaapkamer rechts achter
  muurStuk(-6.5, 0, 3, T, binnenmuur, 2.2);
  muurStuk(0, 0, 6, T, binnenmuur, 2.2);
  muurStuk(6.5, 0, 3, T, binnenmuur, 2.2);
  muurStuk(0, -3, T, 6, binnenmuur, 2.2);
  g.add(doos(0x7a5a44, [B, 0.12, D], [0, 0.06, 0]));
  g.add(doos(0x4a3b2a, [3.2, 0.25, 1.4], [0, 0.12, D / 2 + 0.8]));
  // gloeiende ramen
  const raam = (x, y, z, b, d) => g.add(doos(GLOEI_GEEL, [b, 1.4, d], [x, y, z], { gloed: 0.8 }));
  for (const x of [-5.2, 5.2]) raam(x, 1.9, D / 2 + 0.22, 1.4, 0.06);
  for (const x of [-4, 4]) raam(x, 1.9, -D / 2 - 0.22, 1.4, 0.06);
  for (const z of [-3, 3]) {
    raam(-B / 2 - 0.22, 1.9, z, 0.06, 1.4);
    raam(B / 2 + 0.22, 1.9, z, 0.06, 1.4);
  }

  // ---- meubels ----
  g.add(schijf(0x9c4a8a, 2.2, [0, 0.13, 3]));
  for (const s of [-1, 1]) {
    const stoel = groep(s * 5.5, 0, 3.2);
    stoel.rotation.y = -s * Math.PI / 2;
    stoel.add(doos(0x8e3b6e, [1.2, 0.5, 1.1], [0, 0.35, 0]));
    stoel.add(doos(0x8e3b6e, [1.2, 1.1, 0.3], [0, 0.85, -0.45]));
    for (const a of [-1, 1]) stoel.add(doos(0x6e2a55, [0.25, 0.75, 1.1], [a * 0.6, 0.45, 0]));
    g.add(stoel);
    botsers.push({ x: s * 5.5, z: 3.2, r: 0.8 });
  }
  g.add(doos(hout, [0.8, 2.6, 0.5], [-7.4, 1.3, 1.5]));
  const wijzerplaat = cilinder(0xfff3c4, 0.25, 0.25, 0.05, [-6.98, 2.1, 1.5], 16);
  wijzerplaat.rotation.z = Math.PI / 2;
  g.add(wijzerplaat);
  botsers.push({ x: -7.4, z: 1.5, b: 0.8, d: 0.6 });
  // keuken: tafel, ketel, plank met toverdrankjes
  g.add(doos(0x7a5236, [2.4, 0.15, 1.4], [-4, 0.9, -3]));
  for (const x of [-5.05, -2.95]) for (const z of [-3.6, -2.4]) g.add(doos(0x5a3a2a, [0.12, 0.85, 0.12], [x, 0.43, z]));
  botsers.push({ x: -4, z: -3, b: 2.4, d: 1.4 });
  const ketel = heksenketel(w);
  ketel.position.set(-6.2, 0, -4.4);
  ketel.scale.setScalar(0.75);
  g.add(ketel);
  botsers.push({ x: -6.2, z: -4.4, r: 0.8 });
  g.add(doos(hout, [3, 0.12, 0.4], [-3.5, 1.8, -5.6]));
  [0xff5ac8, 0x7bdcff, 0x9cff8f, 0xffd166, 0xb388ff].forEach((k, i) => g.add(bol(k, 0.13, [-4.7 + i * 0.6, 2.0, -5.6], [1, 1.3, 1], { gloed: 0.7 })));
  // slaapkamer: bed, boekenkast, schatkist
  g.add(doos(hout, [2.2, 0.5, 3.2], [4.8, 0.35, -3.8]));
  g.add(doos(0x7e57c2, [2.1, 0.2, 2.3], [4.8, 0.7, -3.3]));
  g.add(bol(0xffffff, 0.4, [4.8, 0.85, -4.9], [1.4, 0.4, 0.8]));
  g.add(doos(hout, [2.2, 1.4, 0.2], [4.8, 0.8, -5.5]));
  botsers.push({ x: 4.8, z: -3.8, b: 2.3, d: 3.3 });
  g.add(doos(hout, [0.5, 2.6, 2.4], [7.5, 1.3, -2]));
  for (let rij = 0; rij < 3; rij++) {
    for (let i = 0; i < 6; i++) {
      g.add(doos(w.kies([0xe57373, 0x64b5f6, 0x81c784, 0xffd54f, 0xba68c8]), [0.08, 0.5, 0.3], [7.18, 0.5 + rij * 0.8, -2.9 + i * 0.36], { rand: false }));
    }
  }
  botsers.push({ x: 7.5, z: -2, b: 0.6, d: 2.4 });
  g.add(doos(0x8d5a2b, [1.2, 0.7, 0.7], [1.6, 0.35, -1.2]));
  g.add(doos(0xffc93c, [1.25, 0.1, 0.75], [1.6, 0.6, -1.2], { gloed: 0.3 }));
  botsers.push({ x: 1.6, z: -1.2, b: 1.2, d: 0.7 });

  // ---- bovenverdieping + dak (verdwijnt als je binnen bent) ----
  const boven = groep();
  boven.userData.dynamisch = true;
  boven.add(doos(rand, [B + 0.3, 0.3, D + 0.3], [0, H, 0]));
  boven.add(doos(muur, [B, 3, D], [0, H + 1.5, 0]));
  for (const z of [D / 2 + 0.02, -D / 2 - 0.02]) {
    for (const x of [-5, 5]) boven.add(doos(GLOEI_GEEL, [1.3, 1.5, 0.06], [x, H + 1.6, z], { gloed: 0.8 }));
    const rond = cilinder(GLOEI_GEEL, 0.6, 0.6, 0.06, [0, H + 1.8, z], 16, { gloed: 0.8 });
    rond.rotation.x = Math.PI / 2;
    boven.add(rond);
  }
  const dak = zadeldak(B + 0.8, D + 0.8, 4.5, muur, dakKleur);
  dak.position.y = H + 3;
  dak.rotation.z = 0.03;
  boven.add(dak);
  boven.add(doos(rand, [1, 3, 1], [4.5, H + 5.5, -2]));
  g.add(boven);

  // ---- torentje op de hoek ----
  const tx = B / 2 + 1.8, tz = D / 2 + 1.6;
  g.add(cilinder(muur, 1.7, 1.8, 10, [tx, 5, tz], 12));
  for (const y of [2.5, 5.5, 8.5]) g.add(doos(GLOEI_GEEL, [0.7, 1.0, 0.06], [tx, y, tz + 1.74], { gloed: 0.8 }));
  g.add(kegel(dakKleur, 2.3, 4, [tx, 12, tz], 12));
  g.add(bol(GLOEI_GEEL, 0.2, [tx, 14.1, tz], [1, 1, 1], { gloed: 1 }));
  botsers.push({ x: tx, z: tz, r: 1.9 });

  const verstop = [
    [-6.8, 5], [6.8, 5], [-5.5, 1.7], [5.5, 1.6], // hal
    [-1.2, -5], [-7, -1.2], [-4, -1.3], // keuken
    [2.5, -5.2], [7, -5], [1, -3.5], // slaapkamer
    [-B / 2 - 1.3, D / 2 + 1.3], [-B / 2 - 1.3, -D / 2 - 1.3], [B / 2 + 1.3, -D / 2 - 1.3], [0, -D / 2 - 1.3], [-B / 2 - 1.3, 0],
  ];
  return info(g, botsers, verstop, 12, { binnen: { b: B, d: D }, verberg: boven, update: ketel.userData.update });
}

// Lieve spookjes die rondzweven
export function spookjes(w, aantal, midden, straal) {
  for (let i = 0; i < aantal; i++) {
    const spook = groep();
    spook.userData.dynamisch = true;
    spook.add(bol(0xfbfbff, 0.4, [0, 0.4, 0], [1, 1.1, 1]));
    spook.add(kegel(0xfbfbff, 0.42, 0.6, [0, -0.05, 0], 14));
    ogen(spook, 0.14, 0.42, 0.33, 0.09, 0x1a1a2e);
    w.scene.add(spook);
    const fase = w.rng() * 6, r = w.tussen(straal * 0.3, straal), snel = w.tussen(0.08, 0.18) * (w.kans(0.5) ? 1 : -1);
    w.elkFrame((dt, t) => {
      const a = t * snel + fase;
      const x = midden.x + Math.cos(a) * r, z = midden.z + Math.sin(a) * r;
      spook.position.set(x, w.hoogte(x, z) + 2.5 + Math.sin(t * 1.5 + fase) * 0.5, z);
      spook.rotation.y = Math.atan2(-Math.sin(a) * snel, Math.cos(a) * snel);
    });
  }
}

// Vleermuizen die rond een plek fladderen
export function vleermuizen(w, aantal, midden) {
  for (let i = 0; i < aantal; i++) {
    const vm = groep();
    vm.userData.dynamisch = true;
    vm.add(bol(0x2b2233, 0.22, [0, 0, 0], [0.8, 0.8, 1]));
    for (const s of [-1, 1]) vm.add(kegel(0x2b2233, 0.07, 0.18, [s * 0.1, 0.2, 0.05], 5));
    const vleugels = [];
    for (const s of [-1, 1]) {
      const v = groep(s * 0.12, 0, 0);
      v.add(bol(0x3b2d4a, 0.3, [s * 0.3, 0, 0], [1, 0.12, 0.6]));
      vm.add(v);
      vleugels.push(v);
    }
    w.scene.add(vm);
    const fase = w.rng() * 6, r = w.tussen(6, 16), h = w.tussen(6, 13), snel = w.tussen(0.4, 0.8);
    w.elkFrame((dt, t) => {
      const a = t * snel + fase;
      vm.position.set(midden.x + Math.cos(a) * r, h + Math.sin(t * 2 + fase) * 0.8, midden.z + Math.sin(a) * r);
      vm.rotation.y = Math.atan2(-Math.sin(a), Math.cos(a));
      vleugels.forEach((v, k) => (v.rotation.z = (k ? -1 : 1) * Math.sin(t * 14 + fase) * 0.7));
    });
  }
}

// Grote maan en sterretjes aan de nachtlucht
export function maanEnSterren(w) {
  const R = w.koepel.geometry.parameters.radius;
  const maan = new THREE.Mesh(new THREE.SphereGeometry(R * 0.06, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff3c4, fog: false }));
  maan.material.userData.outlineParameters = GEEN_LIJN;
  maan.position.set(0.35, 0.45, -0.82).normalize().multiplyScalar(R * 0.85);
  const gloed = new THREE.Mesh(new THREE.SphereGeometry(R * 0.09, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffe9a8, fog: false, transparent: true, opacity: 0.25, depthWrite: false }));
  gloed.material.userData.outlineParameters = GEEN_LIJN;
  gloed.position.copy(maan.position);
  w.koepel.add(maan, gloed);
  const pos = [];
  for (let i = 0; i < 400; i++) {
    const a = w.rng() * Math.PI * 2, e = w.tussen(0.15, 1.5);
    pos.push(Math.cos(e) * Math.cos(a) * R * 0.95, Math.sin(e) * R * 0.95, Math.cos(e) * Math.sin(a) * R * 0.95);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  w.koepel.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, fog: false })));
}
