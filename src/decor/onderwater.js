// Onderwater-decor: koraal, anemonen, zeewier, scheepswrak, schatkisten, schelpen,
// scholen visjes, belletjes, lichtstralen en het wateroppervlak.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { bol, halfbol, doos, cilinder, steenvorm, groep, materiaal, GEEN_LIJN } from '../hulp/vormen.js';
import { rondom, info, instanties, rotsblok } from '../decor.js';

export function koraal(w) {
  const g = groep();
  const kleur = w.kies([0xff7fa6, 0xff9e6b, 0xc58bff, 0xffd166, 0x6be0d0]);
  const soort = w.rng();
  g.add(steenvorm(0xb8a58a, 0.5, [0, 0.15, 0], [1.2, 0.5, 1.2]));
  if (soort < 0.4) {
    // vertakt koraal
    for (let i = 0; i < 5; i++) {
      const tak = groep(0, 0.3, 0);
      tak.rotation.y = (i / 5) * Math.PI * 2 + w.rng();
      const th = w.tussen(0.15, 0.7), L = w.tussen(0.9, 1.7);
      const c = cilinder(kleur, 0.08, 0.12, L, [Math.sin(th) * L / 2, Math.cos(th) * L / 2, 0], 6);
      c.rotation.z = -th;
      tak.add(c);
      tak.add(bol(kleur, 0.13, [Math.sin(th) * L, Math.cos(th) * L, 0]));
      g.add(tak);
    }
  } else if (soort < 0.65) {
    // hersenkoraal
    g.add(bol(kleur, 0.8, [0, 0.5, 0], [1, 0.75, 1]));
    for (let i = 0; i < 7; i++) {
      const a = w.rng() * Math.PI * 2, e = w.tussen(0.3, 1.2);
      g.add(bol(kleur, 0.22, [Math.cos(e) * Math.cos(a) * 0.75, 0.5 + Math.sin(e) * 0.55, Math.cos(e) * Math.sin(a) * 0.75]));
    }
  } else if (soort < 0.85) {
    // waaierkoraal
    g.add(cilinder(kleur, 0.06, 0.1, 0.6, [0, 0.3, 0], 6));
    g.add(bol(kleur, 1.0, [0, 1.2, 0], [1, 0.9, 0.08]));
  } else {
    // buisjeskoraal
    for (let i = 0; i < 6; i++) {
      const h = w.tussen(0.6, 1.5), x = w.tussen(-0.4, 0.4), z = w.tussen(-0.4, 0.4);
      g.add(cilinder(kleur, 0.14, 0.16, h, [x, h / 2, z], 8));
      g.add(cilinder(0x5a2a4a, 0.1, 0.1, 0.02, [x, h + 0.005, z], 8));
    }
  }
  return info(g, [{ r: 0.6 }], rondom(1.4, 2, w.rng() * 6), 1.3);
}

export function anemoon(w) {
  const g = groep();
  const kleur = w.kies([0xff8fd1, 0xc58bff, 0xffa36b]);
  g.add(cilinder(kleur, 0.4, 0.5, 0.4, [0, 0.2, 0], 12));
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2, r = i % 2 ? 0.32 : 0.18;
    const arm = groep(Math.cos(a) * r, 0.35, Math.sin(a) * r);
    arm.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
    arm.add(cilinder(kleur, 0.04, 0.05, 0.7, [0, 0.35, 0], 5));
    arm.add(bol(0xfff0f8, 0.07, [0, 0.72, 0], [1, 1, 1], { rand: false }));
    g.add(arm);
  }
  // geen botsing: een vriendje kan zich tussen de armpjes verstoppen
  return info(g, [], [[0, 0]], 1.0);
}

export function schelp(w) {
  const g = groep();
  const kleur = w.kies([0xffc8dd, 0xffe0b2, 0xe1bee7]);
  g.add(halfbol(kleur, 0.6, [0, 0.02, 0], [1, 0.35, 1]));
  const deksel = halfbol(kleur, 0.6, [0, 0.12, -0.55], [1, 0.35, 1]);
  deksel.rotation.x = -1.2;
  g.add(deksel);
  g.add(bol(0xffffff, 0.16, [0, 0.25, 0], [1, 1, 1], { gloed: 0.3 }));
  return info(g, [], [], 0.8);
}

export function schatkist() {
  const g = groep();
  const hout = 0x8d5a2b, goud = 0xffc93c;
  g.add(doos(hout, [1.6, 0.9, 1.0], [0, 0.45, 0]));
  for (const x of [-0.55, 0.55]) g.add(doos(goud, [0.12, 0.95, 1.05], [x, 0.46, 0]));
  const deksel = groep(0, 0.9, -0.5);
  deksel.rotation.x = -1.0;
  deksel.add(doos(hout, [1.6, 0.14, 1.0], [0, 0, 0.5]));
  deksel.add(doos(goud, [1.65, 0.16, 0.12], [0, 0, 0.95]));
  g.add(deksel);
  for (let i = 0; i < 7; i++) g.add(bol(goud, 0.13, [-0.5 + (i % 4) * 0.33, 0.95 + Math.floor(i / 4) * 0.1, -0.2 + (i % 3) * 0.2], [1, 0.4, 1], { gloed: 0.5 }));
  g.add(bol(0xff5ac8, 0.12, [0.2, 1.05, 0.1], [1, 1, 1], { gloed: 0.6 }));
  return info(g, [{ b: 1.7, d: 1.1 }], rondom(1.9, 3, 0.4), 1.6);
}

export function scheepswrak() {
  const g = groep();
  const hout = 0x6d4c3a, donker = 0x4a3326;
  const schip = groep();
  schip.rotation.z = 0.22;
  g.add(schip);
  schip.add(doos(hout, [3.6, 2.4, 10], [0, 1.0, 0]));
  const boeg = bol(hout, 1.8, [0, 1.0, 5], [1, 0.67, 1.4]);
  schip.add(boeg);
  schip.add(doos(0x8a6448, [3.4, 0.15, 10.5], [0, 2.25, 0.2]));
  for (let i = 0; i < 4; i++) {
    for (const s of [-1, 1]) {
      const patrijspoort = cilinder(0x2b3a4a, 0.25, 0.25, 0.1, [s * 1.82, 1.3, -3 + i * 2], 12);
      patrijspoort.rotation.z = Math.PI / 2;
      schip.add(patrijspoort);
    }
  }
  const mast = cilinder(donker, 0.18, 0.24, 6, [0, 4.5, -1], 8);
  mast.rotation.z = 0.35;
  schip.add(mast);
  const zeil = doos(0xf5ecd7, [0.05, 2.2, 2.6], [0.8, 5, -1]);
  zeil.rotation.set(0.2, 0, 0.35);
  schip.add(zeil);
  schip.add(bol(0x5aa36a, 0.6, [-0.8, 2.4, 2], [1.4, 0.3, 1]));
  const verstop = [[2.8, -4], [2.8, 0], [2.8, 4], [-2.8, -3], [-2.8, 3], [0, -6.2], [0, 7.5]];
  return info(g, [{ b: 3.8, d: 10.4 }, { z: 5.2, r: 1.8 }], verstop, 7);
}

// Wiegend zeewier (kelp), veel tegelijk
export function kelpwoud(w, regio, aantal) {
  const SEG = 7;
  const geo = new THREE.SphereGeometry(1, 6, 4);
  geo.scale(0.28, 0.6, 0.08);
  const im = instanties(geo, materiaal(0xffffff, { rand: false }), aantal * SEG);
  const kleur = new THREE.Color();
  const stelen = [];
  for (let i = 0; i < aantal; i++) {
    const a = w.rng() * Math.PI * 2, d = Math.sqrt(w.rng()) * regio.r;
    const x = regio.x + Math.cos(a) * d, z = regio.z + Math.sin(a) * d;
    if (!w.isVrij(x, z, 0.4)) continue;
    stelen.push({ x, y: w.hoogte(x, z), z, fase: w.rng() * 6, hoog: w.tussen(0.8, 1.2), draai: w.rng() * 6 });
    if (stelen.length % 8 === 0) w.verstopplek(x, z);
  }
  stelen.forEach((s, i) => {
    for (let k = 0; k < SEG; k++) im.setColorAt(i * SEG + k, kleur.setHex(k % 2 ? 0x4caf50 : 0x6cc24a));
  });
  im.count = stelen.length * SEG;
  w.scene.add(im);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3();
  w.elkFrame((dt, t) => {
    stelen.forEach((s, i) => {
      for (let k = 0; k < SEG; k++) {
        const zwaai = Math.sin(t * 0.8 + s.fase + k * 0.4) * 0.12 * k;
        p.set(s.x + zwaai, s.y + (0.5 + k * 1.0) * s.hoog, s.z + Math.cos(t * 0.6 + s.fase + k * 0.3) * 0.08 * k);
        q.setFromEuler(e.set(0, s.draai + k * 0.5, zwaai * 0.3));
        sc.setScalar(s.hoog);
        m.compose(p, q, sc);
        im.setMatrixAt(i * SEG + k, m);
      }
    });
    im.instanceMatrix.needsUpdate = true;
  });
}

// Scholen kleine visjes die rondjes zwemmen
export function visjes(w, scholen = 8) {
  const lijf = new THREE.SphereGeometry(0.18, 8, 6);
  lijf.scale(0.6, 0.8, 1.2);
  const staart = new THREE.ConeGeometry(0.12, 0.2, 4);
  staart.rotateX(-Math.PI / 2);
  staart.translate(0, 0, -0.28);
  const geo = mergeGeometries([lijf, staart]);
  const vissen = [];
  const kleur = new THREE.Color();
  const kleuren = [0xffd166, 0x7bdcff, 0xff8fab, 0xb388ff, 0xff9e6b];
  for (let s = 0; s < scholen; s++) {
    const x = (w.rng() * 2 - 1) * (w.half - 15), z = (w.rng() * 2 - 1) * (w.half - 15);
    const midden = { x, y: w.hoogte(x, z) + w.tussen(2, 6), z };
    const k = w.kies(kleuren), r = w.tussen(4, 10), snel = w.tussen(0.3, 0.6) * (w.kans(0.5) ? 1 : -1);
    const n = 10 + Math.floor(w.rng() * 6);
    for (let i = 0; i < n; i++) vissen.push({ midden, k, r: r + w.tussen(-1.5, 1.5), snel, fase: w.rng() * 6, hoog: w.tussen(-1, 1) });
  }
  const im = instanties(geo, materiaal(0xffffff, { rand: false }), vissen.length);
  vissen.forEach((v, i) => im.setColorAt(i, kleur.setHex(v.k)));
  w.scene.add(im);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), een = new THREE.Vector3(1, 1, 1);
  w.elkFrame((dt, t) => {
    vissen.forEach((v, i) => {
      const a = t * v.snel + v.fase * 0.3;
      p.set(v.midden.x + Math.cos(a) * v.r, v.midden.y + v.hoog + Math.sin(t * 2 + v.fase) * 0.3, v.midden.z + Math.sin(a) * v.r);
      q.setFromEuler(e.set(0, Math.atan2(-Math.sin(a) * v.snel, Math.cos(a) * v.snel), 0));
      m.compose(p, q, een);
      im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
  });
}

// Bronnetjes waar belletjes uit opstijgen
export function bubbelbronnen(w, aantal = 8) {
  const PER = 14;
  const im = instanties(new THREE.SphereGeometry(0.15, 8, 6), materiaal(0xe8fbff, { doorzichtig: 0.6, rand: false }), aantal * PER);
  const bronnen = [];
  for (let i = 0; i < aantal; i++) {
    const p = w.vrijePlek(1.5);
    if (!p) continue;
    const bron = groep();
    bron.add(steenvorm(0x8a8a8a, 0.6, [0, 0.15, 0], [1, 0.5, 1]));
    w.plaats(bron, p.x, p.z);
    bronnen.push({ x: p.x, y: w.hoogte(p.x, p.z), z: p.z });
  }
  im.count = bronnen.length * PER;
  const m = new THREE.Matrix4();
  w.elkFrame((dt, t) => {
    bronnen.forEach((b, i) => {
      for (let k = 0; k < PER; k++) {
        const h = ((t * 1.5 + k * 1.3 + i) % 18);
        const s = 0.6 + (k % 3) * 0.3;
        m.makeScale(s, s, s).setPosition(b.x + Math.sin(t * 3 + k) * 0.2, b.y + 0.4 + h, b.z + Math.cos(t * 2 + k) * 0.2);
        im.setMatrixAt(i * PER + k, m);
      }
    });
    im.instanceMatrix.needsUpdate = true;
  });
  w.scene.add(im);
}

// Lichtbundels die van het wateroppervlak naar beneden schijnen
export function lichtstralen(w, aantal = 25, hoogte = 22) {
  const geo = new THREE.CylinderGeometry(1.2, 3.2, hoogte + 4, 12, 1, true);
  const mat = new THREE.MeshBasicMaterial({ color: 0xe8fbff, transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  mat.userData.outlineParameters = GEEN_LIJN;
  for (let i = 0; i < aantal; i++) {
    const straal = new THREE.Mesh(geo, mat);
    const x = (w.rng() * 2 - 1) * w.half, z = (w.rng() * 2 - 1) * w.half;
    straal.position.set(x, hoogte / 2, z);
    straal.userData.dynamisch = true;
    const fase = w.rng() * 6;
    w.scene.add(straal);
    w.elkFrame((dt, t) => {
      straal.rotation.z = 0.25 + Math.sin(t * 0.2 + fase) * 0.06;
      straal.rotation.x = Math.cos(t * 0.15 + fase) * 0.06;
    });
  }
}

export function wateroppervlak(w, hoogte = 22) {
  const geo = new THREE.PlaneGeometry(w.gebied.grootte * 3, w.gebied.grootte * 3);
  geo.rotateX(Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: 0xbff4ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });
  mat.userData.outlineParameters = GEEN_LIJN;
  const water = new THREE.Mesh(geo, mat);
  water.position.y = hoogte;
  water.userData.dynamisch = true;
  w.scene.add(water);
}

// Rand van rotsen en koraal rond het hele gebied
export function rotsrand(w) {
  const h = w.half;
  for (const [x, z, r] of [[0, h, 0], [0, -h, 0], [h, 0, 1], [-h, 0, 1]]) {
    for (let t = -h; t <= h; t += 3.5) {
      const px = (r ? x : t) + w.tussen(-0.8, 0.8), pz = (r ? t : z) + w.tussen(-0.8, 0.8);
      w.plaats(w.kans(0.75) ? rotsblok(w) : koraal(w), px, pz, { schaal: w.tussen(1.2, 1.9) });
    }
  }
}
