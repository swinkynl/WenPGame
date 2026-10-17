// Het gele hondje: de speler.
import * as THREE from 'three';
import { bol, cilinder, torus, groep, ogen } from './hulp/vormen.js';
import { draaiNaar } from './hulp/wiskunde.js';

const MAX_SNELHEID = 9;
const STRAAL = 0.6;
const ZWAARTEKRACHT = 22;

function maakModel() {
  const geel = 0xffcf33, lichtgeel = 0xfff1b8, oorkleur = 0xe8a317;
  const hond = new THREE.Group();

  const lijf = groep();
  hond.add(lijf);
  lijf.add(bol(geel, 0.5, [0, 0.82, 0], [0.95, 0.85, 1.3]));
  lijf.add(bol(lichtgeel, 0.36, [0, 0.7, 0.22], [0.9, 0.8, 1.2]));

  // halsband met penning
  const band = torus(0xe63946, 0.3, 0.06, [0, 1.08, 0.5]);
  band.rotation.x = Math.PI / 2 - 0.5;
  lijf.add(band);
  lijf.add(bol(0xffd700, 0.07, [0, 0.93, 0.74]));

  // kop
  const kop = groep(0, 1.38, 0.64);
  lijf.add(kop);
  kop.add(bol(geel, 0.42, [0, 0, 0], [1, 0.95, 1]));
  kop.add(bol(lichtgeel, 0.22, [0, -0.1, 0.33], [1.1, 0.85, 1.1]));
  kop.add(bol(0x2b2b2b, 0.08, [0, -0.02, 0.56], [1.25, 0.9, 1]));
  kop.add(bol(0xff7b9c, 0.08, [0, -0.25, 0.42], [1, 0.45, 1.2]));
  ogen(kop, 0.16, 0.1, 0.33, 0.075);

  const oren = [];
  for (const s of [-1, 1]) {
    const oor = groep(s * 0.32, 0.22, -0.02);
    oor.add(bol(oorkleur, 0.17, [0, -0.15, 0], [0.55, 1.25, 0.9]));
    oor.rotation.z = s * 0.35;
    kop.add(oor);
    oren.push(oor);
  }

  // pootjes (draaipunt bij de heup)
  const poten = [];
  for (const [x, z] of [[-0.25, 0.38], [0.25, 0.38], [-0.25, -0.36], [0.25, -0.36]]) {
    const poot = groep(x, 0.62, z);
    poot.add(cilinder(geel, 0.11, 0.1, 0.55, [0, -0.27, 0], 10));
    poot.add(bol(lichtgeel, 0.13, [0, -0.55, 0.04], [1, 0.65, 1.2]));
    hond.add(poot);
    poten.push(poot);
  }

  // kwispelstaart
  const staart = groep(0, 0.98, -0.6);
  staart.add(cilinder(geel, 0.05, 0.09, 0.5, [0, 0.25, 0], 8));
  staart.add(bol(lichtgeel, 0.09, [0, 0.5, 0]));
  staart.rotation.x = -0.6;
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
