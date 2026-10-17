// Het gele hondje: de speler.
import * as THREE from 'three';
import { bol, cilinder, kegel, groep, ogen } from './hulp/vormen.js';
import { draaiNaar } from './hulp/wiskunde.js';

const MAX_SNELHEID = 9;
const STRAAL = 0.6;
const ZWAARTEKRACHT = 22;

// Chibi-stijl: groot koppie, grote glimogen, flaporen, pluizige borst en staart
function maakModel() {
  const goud = 0xf6c25f, room = 0xfff0d2, glans = 0xffe2a6, oorkleur = 0xe7a043;
  const hond = new THREE.Group();

  const lijf = groep();
  hond.add(lijf);
  lijf.add(bol(goud, 0.42, [0, 0.72, -0.02], [0.95, 0.88, 1.15]));
  // pluizige borst
  for (const [x, y, z, r] of [[0, 0.82, 0.3, 0.22], [-0.13, 0.7, 0.3, 0.16], [0.13, 0.7, 0.3, 0.16], [0, 0.62, 0.3, 0.15]]) {
    lijf.add(bol(room, r, [x, y, z], [1, 1, 1], { rand: false }));
  }

  // kop
  const kop = groep(0, 1.42, 0.2);
  lijf.add(kop);
  kop.add(bol(goud, 0.55, [0, 0, 0], [1.08, 0.95, 0.95]));
  kop.add(bol(room, 0.2, [0, -0.15, 0.42], [1.3, 0.85, 0.8]));
  kop.add(bol(0x2a1a14, 0.075, [0, -0.06, 0.58], [1.3, 0.95, 0.9]));
  kop.add(bol(0xffffff, 0.022, [0.03, -0.03, 0.645], [1, 1, 1], { rand: false, gloed: 0.5 }));
  // open lachend mondje met tongetje
  kop.add(bol(0x7a2232, 0.1, [0, -0.25, 0.48], [1.15, 0.7, 0.5], { rand: false }));
  kop.add(bol(0xff7e98, 0.07, [0, -0.29, 0.52], [1.1, 0.55, 0.5], { rand: false }));
  // glansplekjes en plukje haar
  kop.add(bol(glans, 0.09, [-0.2, 0.3, 0.38], [1.2, 0.6, 0.4], { rand: false }));
  kop.add(bol(glans, 0.06, [0.24, 0.32, 0.36], [1.2, 0.6, 0.4], { rand: false }));
  for (const [x, rz] of [[-0.06, 0.35], [0.02, -0.1], [0.09, -0.5]]) {
    const pluk = kegel(goud, 0.07, 0.24, [x, 0.56, 0.05], 8);
    pluk.rotation.set(0.3, 0, rz);
    kop.add(pluk);
  }
  ogen(kop, 0.23, 0.06, 0.44, 0.16, 0x8b2e1f);

  const oren = [];
  for (const s of [-1, 1]) {
    const oor = groep(s * 0.5, 0.2, -0.02);
    oor.add(bol(oorkleur, 0.27, [0, -0.3, 0], [0.45, 1.25, 0.85]));
    oor.rotation.z = s * 0.15;
    kop.add(oor);
    oren.push(oor);
  }

  // korte pootjes (draaipunt bij de heup)
  const poten = [];
  for (const [x, z] of [[-0.2, 0.22], [0.2, 0.22], [-0.2, -0.26], [0.2, -0.26]]) {
    const poot = groep(x, 0.45, z);
    poot.add(cilinder(goud, 0.12, 0.11, 0.32, [0, -0.17, 0], 10));
    poot.add(bol(goud, 0.14, [0, -0.36, 0.04], [1, 0.7, 1.2]));
    hond.add(poot);
    poten.push(poot);
  }

  // pluizige krulstaart
  const staart = groep(0, 0.85, -0.42);
  [[0, 0.05, -0.05, 0.13], [0, 0.22, -0.14, 0.15], [0, 0.4, -0.16, 0.16], [0, 0.55, -0.08, 0.14]]
    .forEach(([x, y, z, r]) => staart.add(bol(goud, r, [x, y, z])));
  staart.add(bol(room, 0.12, [0, 0.66, 0.02]));
  staart.rotation.x = -0.35;
  lijf.add(staart);

  return { hond, lijf, kop, oren, poten, staart };
}

export class Hondje {
  constructor() {
    const m = maakModel();
    Object.assign(this, m);
    this.groep = m.hond;
    this.positie = this.groep.position;
    this.hoek = 0;
    this.snelheid = new THREE.Vector2();
    this.vy = 0;
    this.opGrond = true;
    this.fase = 0;
    this.tijd = 0;
    this.blijTimer = 0;
  }

  spring() {
    if (!this.opGrond) return false;
    this.vy = 7.5;
    this.opGrond = false;
    return true;
  }

  blij() {
    this.blijTimer = 1.6;
  }

  // beweging: {x, y} van joystick/toetsen, camYaw: draaiing van de camera
  update(dt, beweging, camYaw, wereld) {
    this.tijd += dt;

    // richting ten opzichte van de camera
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw);
    const rx = -fz, rz = fx;
    let mx = fx * beweging.y + rx * beweging.x;
    let mz = fz * beweging.y + rz * beweging.x;
    const sterkte = Math.min(1, Math.hypot(mx, mz));
    if (sterkte > 0) {
      const l = Math.hypot(mx, mz);
      mx /= l;
      mz /= l;
    }

    const f = 1 - Math.exp(-10 * dt);
    this.snelheid.x += (mx * MAX_SNELHEID * sterkte - this.snelheid.x) * f;
    this.snelheid.y += (mz * MAX_SNELHEID * sterkte - this.snelheid.y) * f;

    this.positie.x += this.snelheid.x * dt;
    this.positie.z += this.snelheid.y * dt;
    wereld.duwWeg(this.positie, STRAAL);
    const m = wereld.half - 1.9;
    this.positie.x = Math.max(-m, Math.min(m, this.positie.x));
    this.positie.z = Math.max(-m, Math.min(m, this.positie.z));

    const v = this.snelheid.length();
    if (v > 0.5) this.hoek = draaiNaar(this.hoek, Math.atan2(this.snelheid.x, this.snelheid.y), dt * 12);
    this.groep.rotation.y = this.hoek;

    // springen
    this.vy -= ZWAARTEKRACHT * dt;
    this.positie.y += this.vy * dt;
    if (this.positie.y <= 0) {
      this.positie.y = 0;
      this.vy = 0;
      this.opGrond = true;
    }

    this.animeer(dt, v);
  }

  animeer(dt, v) {
    const loop = Math.min(v / MAX_SNELHEID, 1);
    this.fase += dt * (4 + v * 1.6);
    const zwaai = Math.sin(this.fase) * 0.75 * loop;

    if (this.opGrond) {
      this.poten[0].rotation.x = zwaai;
      this.poten[3].rotation.x = zwaai;
      this.poten[1].rotation.x = -zwaai;
      this.poten[2].rotation.x = -zwaai;
    } else {
      this.poten[0].rotation.x = this.poten[1].rotation.x = -0.8;
      this.poten[2].rotation.x = this.poten[3].rotation.x = 0.8;
    }
    this.lijf.position.y = Math.abs(Math.sin(this.fase)) * 0.08 * loop;

    this.blijTimer = Math.max(0, this.blijTimer - dt);
    const blij = this.blijTimer > 0;
    this.staart.rotation.z = Math.sin(this.tijd * (blij ? 24 : 9)) * (blij ? 0.8 : 0.45);
    this.kop.rotation.z = blij ? Math.sin(this.tijd * 10) * 0.15 : 0;
    for (const [i, oor] of this.oren.entries()) {
      oor.rotation.x = -loop * 0.5 + Math.sin(this.fase * 2 + i) * 0.15 * loop;
    }
  }
}
