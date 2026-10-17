// De wereld: grond, lucht, licht, en alles wat een gebied erin zet.
// Een gebied-bestand gebruikt de functies hieronder (plaats, verspreid, ...) om zich op te bouwen.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { maakRng, schud } from './hulp/wiskunde.js';
import { opruimen } from './hulp/vormen.js';

export class Wereld {
  constructor(gebied) {
    this.gebied = gebied;
    this.scene = new THREE.Scene();
    this.half = gebied.grootte / 2;
    this.zicht = gebied.zichtAfstand ?? 140;
    this.rng = maakRng(gebied.zaadje ?? 1234);
    this.botsers = [];
    this.bezet = [];
    this.verstopplekken = [];
    this.updaters = [];

    this.maakLuchtEnLicht();
    this.maakGrond();
    gebied.bouw(this);
    this.samenvoegen();
  }

  // ---------- willekeur (altijd hetzelfde per gebied) ----------
  tussen(a, b) { return a + (b - a) * this.rng(); }
  kies(lijst) { return lijst[Math.floor(this.rng() * lijst.length)]; }
  kans(p) { return this.rng() < p; }

  // ---------- dingen neerzetten ----------

  // Zet een model neer. Het model kan in userData vertellen:
  //   botsers: [{x, z, r}] of [{x, z, b, d}]  -> waar je niet doorheen kunt lopen
  //   verstop: [[x, z], ...]                    -> plekjes waar een vriendje zich kan verstoppen
  //   ruimte: getal                             -> hoeveel plek het inneemt
  //   update: (dt, tijd) => {}                  -> voor bewegende dingen (molenwieken)
  plaats(obj, x, z, { draai = this.rng() * Math.PI * 2, schaal = 1, y = 0 } = {}) {
    obj.position.set(x, y, z);
    obj.rotation.y = draai;
    obj.scale.setScalar(schaal);
    this.scene.add(obj);

    const cos = Math.cos(draai), sin = Math.sin(draai);
    const naarWereld = (lx, lz) => ({
      x: x + (lx * cos + lz * sin) * schaal,
      z: z + (-lx * sin + lz * cos) * schaal,
    });
    const ud = obj.userData;
    for (const b of ud.botsers ?? []) {
      const p = naarWereld(b.x ?? 0, b.z ?? 0);
      if (b.r != null) this.botsers.push({ x: p.x, z: p.z, r: b.r * schaal });
      else this.botsers.push({ x: p.x, z: p.z, hb: (b.b / 2) * schaal, hd: (b.d / 2) * schaal, rot: draai + (b.rot ?? 0) });
    }
    for (const [lx, lz] of ud.verstop ?? []) this.verstopplekken.push(naarWereld(lx, lz));
    this.bezet.push({ x, z, r: (ud.ruimte ?? 1) * schaal });
    if (ud.update) this.updaters.push(ud.update);
    return obj;
  }

  // Zet 'aantal' keer een model op een willekeurige vrije plek.
  // regio: {x, z, r} (cirkel) of {x, z, b, d} (rechthoek), anders het hele gebied
  verspreid(maker, aantal, { regio, afstand = 1, schaal = [1, 1] } = {}) {
    const geplaatst = [];
    for (let i = 0; i < aantal; i++) {
      const s = this.tussen(schaal[0], schaal[1]);
      const obj = maker(this);
      const r = (obj.userData.ruimte ?? 1) * s;
      const p = this.vrijePlek(r + afstand, regio);
      if (!p) {
        opruimen(obj);
        continue;
      }
      this.plaats(obj, p.x, p.z, { schaal: s });
      geplaatst.push(obj);
    }
    return geplaatst;
  }

  vrijePlek(r, regio, pogingen = 40) {
    for (let k = 0; k < pogingen; k++) {
      let x, z;
      if (regio?.r != null) {
        const a = this.rng() * Math.PI * 2, d = Math.sqrt(this.rng()) * regio.r;
        x = regio.x + Math.cos(a) * d;
        z = regio.z + Math.sin(a) * d;
      } else if (regio) {
        x = regio.x + (this.rng() - 0.5) * regio.b;
        z = regio.z + (this.rng() - 0.5) * regio.d;
      } else {
        const m = this.half - 4;
        x = (this.rng() * 2 - 1) * m;
        z = (this.rng() * 2 - 1) * m;
      }
      if (Math.abs(x) > this.half - 3 || Math.abs(z) > this.half - 3) continue;
      if (x * x + z * z < (8 + r) ** 2) continue; // startplek vrijhouden
      if (this.isBezet(x, z, r)) continue;
      return { x, z };
    }
    return null;
  }

  // Houd een stuk vrij zodat 'verspreid' daar niets neerzet
  reserveer(regio) {
    this.bezet.push({ ...regio });
  }

  verstopplek(x, z) {
    this.verstopplekken.push({ x, z });
  }

  elkFrame(fn) {
    this.updaters.push(fn);
  }

  isBezet(x, z, r) {
    for (const b of this.bezet) {
      if (b.r != null) {
        const dx = x - b.x, dz = z - b.z, m = r + b.r;
        if (dx * dx + dz * dz < m * m) return true;
      } else {
        const qx = Math.max(b.x - b.b / 2, Math.min(x, b.x + b.b / 2));
        const qz = Math.max(b.z - b.d / 2, Math.min(z, b.z + b.d / 2));
        if ((x - qx) ** 2 + (z - qz) ** 2 < r * r) return true;
      }
    }
    return false;
  }

  // ---------- botsen ----------

  // Duwt een positie uit alle obstakels
  duwWeg(pos, r) {
    for (const c of this.botsers) {
      const dx = pos.x - c.x, dz = pos.z - c.z;
      if (Math.abs(dx) > 25 || Math.abs(dz) > 25) continue;
      if (c.r != null) {
        const min = c.r + r, d2 = dx * dx + dz * dz;
        if (d2 < min * min) {
          const d = Math.sqrt(d2) || 0.001;
          pos.x = c.x + (dx / d) * min;
          pos.z = c.z + (dz / d) * min;
        }
        continue;
      }
      const cos = Math.cos(c.rot), sin = Math.sin(c.rot);
      const lx = dx * cos - dz * sin, lz = dx * sin + dz * cos;
      const qx = Math.max(-c.hb, Math.min(lx, c.hb)), qz = Math.max(-c.hd, Math.min(lz, c.hd));
      const ox = lx - qx, oz = lz - qz, d2 = ox * ox + oz * oz;
      if (d2 >= r * r) continue;
      let nx, nz;
      if (d2 > 1e-6) {
        const d = Math.sqrt(d2);
        nx = qx + (ox / d) * r;
        nz = qz + (oz / d) * r;
      } else if (c.hb - Math.abs(lx) < c.hd - Math.abs(lz)) {
        nx = Math.sign(lx || 1) * (c.hb + r);
        nz = lz;
      } else {
        nx = lx;
        nz = Math.sign(lz || 1) * (c.hd + r);
      }
      pos.x = c.x + nx * cos + nz * sin;
      pos.z = c.z - nx * sin + nz * cos;
    }
  }

  isVrij(x, z, r) {
    const p = { x, z };
    this.duwWeg(p, r);
    return Math.abs(p.x - x) < 1e-4 && Math.abs(p.z - z) < 1e-4;
  }

  // Kies plekjes voor de vriendjes, zo ver mogelijk uit elkaar
  kiesVerstopplekken(aantal) {
    const kandidaten = schud(this.verstopplekken.filter((p) =>
      Math.abs(p.x) < this.half - 3 && Math.abs(p.z) < this.half - 3 &&
      p.x * p.x + p.z * p.z > 15 * 15 &&
      this.isVrij(p.x, p.z, 0.5)));
    let minAfstand = this.half * 0.4;
    while (minAfstand > 2) {
      const gekozen = [];
      for (const p of kandidaten) {
        if (gekozen.every((q) => Math.hypot(p.x - q.x, p.z - q.z) >= minAfstand)) gekozen.push(p);
        if (gekozen.length === aantal) return gekozen;
      }
      minAfstand *= 0.8;
    }
    return kandidaten.slice(0, aantal);
  }

  // ---------- elke frame ----------

  update(dt, tijd, volgPositie, camera) {
    for (const u of this.updaters) u(dt, tijd);
    this.zon.position.copy(volgPositie).add(this.zonRichting);
    this.zon.target.position.copy(volgPositie);
    this.koepel.position.copy(camera.position);
  }

  // ---------- opbouw ----------

  maakLuchtEnLicht() {
    const k = this.gebied.kleuren;
    this.scene.background = new THREE.Color(k.luchtHorizon);
    this.scene.fog = new THREE.Fog(k.mist ?? k.luchtHorizon, this.zicht * 0.3, this.zicht);

    const straal = this.zicht + 40;
    const geo = new THREE.SphereGeometry(straal, 32, 16);
    const boven = new THREE.Color(k.luchtBoven), horizon = new THREE.Color(k.luchtHorizon);
    const pos = geo.attributes.position, kleuren = [];
    for (let i = 0; i < pos.count; i++) {
      const t = Math.pow(Math.max(0, pos.getY(i) / straal), 0.6);
      const c = horizon.clone().lerp(boven, t);
      kleuren.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(kleuren, 3));
    this.koepel = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false,
    }));
    this.koepel.renderOrder = -1;
    this.koepel.userData.dynamisch = true;
    this.scene.add(this.koepel);

    this.scene.add(new THREE.HemisphereLight(k.hemelLicht ?? 0xffffff, k.grond, k.lichtSterkte ?? 1.6));
    this.zon = new THREE.DirectionalLight(k.zon ?? 0xfff2dc, k.zonSterkte ?? 2.2);
    this.zonRichting = new THREE.Vector3(30, 50, 20);
    this.zon.castShadow = true;
    this.zon.shadow.mapSize.set(1024, 1024);
    const s = this.zon.shadow.camera;
    s.left = s.bottom = -32;
    s.right = s.top = 32;
    s.near = 1;
    s.far = 130;
    this.zon.shadow.bias = -0.0005;
    this.zon.shadow.normalBias = 0.03;
    this.scene.add(this.zon, this.zon.target);
  }

  maakGrond() {
    const k = this.gebied.kleuren;
    const maat = this.gebied.grootte + 2 * (this.zicht + 20);
    const geo = new THREE.PlaneGeometry(maat, maat, 150, 150);
    geo.rotateX(-Math.PI / 2);
    const c1 = new THREE.Color(k.grond), c2 = new THREE.Color(k.grond2 ?? k.grond), c = new THREE.Color();
    const pos = geo.attributes.position, kleuren = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const n = (Math.sin(x * 0.05 + 1.3) * Math.cos(z * 0.045) + Math.sin(x * 0.13 + z * 0.11) * 0.5 + 1.5) / 3;
      c.copy(c1).lerp(c2, Math.max(0, Math.min(1, n)));
      kleuren.push(c.r, c.g, c.b);
      // heuvels buiten de rand
      const buiten = Math.max(Math.abs(x), Math.abs(z)) - (this.half + 8);
      if (buiten > 0) pos.setY(i, buiten * 0.3 * (1 + Math.sin(x * 0.08) * Math.cos(z * 0.07) * 0.6));
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(kleuren, 3));
    geo.computeVertexNormals();
    const grond = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
    grond.receiveShadow = true;
    grond.userData.dynamisch = true;
    this.scene.add(grond);
  }

  // Voegt alle stilstaande onderdelen per vak samen tot een paar grote stukken.
  // Dat maakt het spel veel sneller (belangrijk op de iPad).
  samenvoegen() {
    const VAK = 50;
    const bakjes = new Map();
    const wereldPos = new THREE.Vector3();
    this.scene.updateMatrixWorld(true);

    const loop = (obj, dynamisch) => {
      dynamisch ||= obj.userData.dynamisch;
      for (const kind of [...obj.children]) loop(kind, dynamisch);
      if (dynamisch || !obj.isMesh || obj.isInstancedMesh) return;
      const mat = obj.material;
      if (Array.isArray(mat) || mat.transparent) return;
      obj.getWorldPosition(wereldPos);
      const vak = `${Math.floor(wereldPos.x / VAK)},${Math.floor(wereldPos.z / VAK)}`;
      const sleutel = `${vak}|${mat.uuid}|${obj.castShadow}|${obj.geometry.index ? 'i' : 'n'}`;
      let bakje = bakjes.get(sleutel);
      if (!bakje) bakjes.set(sleutel, bakje = { mat, schaduw: obj.castShadow, geos: [] });
      const g = obj.geometry.clone();
      g.applyMatrix4(obj.matrixWorld);
      for (const naam of Object.keys(g.attributes)) {
        if (!['position', 'normal', 'uv'].includes(naam)) g.deleteAttribute(naam);
      }
      bakje.geos.push(g);
      if (!obj.geometry.userData.gedeeld) obj.geometry.dispose();
      obj.removeFromParent();
    };
    loop(this.scene, false);

    for (const { mat, schaduw, geos } of bakjes.values()) {
      const samen = mergeGeometries(geos, false);
      for (const g of geos) g.dispose();
      if (!samen) continue;
      const mesh = new THREE.Mesh(samen, mat);
      mesh.castShadow = schaduw;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
  }
}
