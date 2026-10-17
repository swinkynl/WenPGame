// Bouwstenen om modellen te maken uit simpele vormen.
// Alle vormen staan op een positie [x, y, z]; y is de hoogte.
// Voorkant van een model is altijd de +z richting.
import * as THREE from 'three';

const geometrieen = new Map();
const materialen = new Map();

export function gedeeldeGeometrie(sleutel, maak) {
  let g = geometrieen.get(sleutel);
  if (!g) {
    g = maak();
    g.userData.gedeeld = true;
    geometrieen.set(sleutel, g);
  }
  return g;
}

// Tekenfilm-stijl: licht in een paar vlakke banden in plaats van zacht verloop
let toonVerloop = null;
export function toonVerloopKaart() {
  if (!toonVerloop) {
    toonVerloop = new THREE.DataTexture(new Uint8Array([150, 205, 255]), 3, 1, THREE.RedFormat);
    toonVerloop.minFilter = toonVerloop.magFilter = THREE.NearestFilter;
    toonVerloop.generateMipmaps = false;
    toonVerloop.needsUpdate = true;
  }
  return toonVerloop;
}

// Omlijning in een donkere versie van de eigen kleur (zoals in een tekenfilm)
export function lijn(hex, dikte = 0.0035) {
  const c = new THREE.Color(hex), hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, Math.min(1, hsl.s * 0.8 + 0.2), hsl.l * 0.3);
  return { thickness: dikte, color: c.toArray(), alpha: 1, keepAlive: true };
}
export const GEEN_LIJN = { visible: false };

// gloed: laat iets licht geven (0..1), doorzichtig: 0..1, vlak: voor platte dingen op de grond,
// rand: false = geen omlijning (voor ogen, blosjes, gras, ...)
export function materiaal(hex, { gloed = 0, doorzichtig = 1, vlak = false, rand = true } = {}) {
  const sleutel = `${hex}|${gloed}|${doorzichtig}|${vlak}|${rand}`;
  let m = materialen.get(sleutel);
  if (!m) {
    m = new THREE.MeshToonMaterial({ color: hex, gradientMap: toonVerloopKaart() });
    m.userData.outlineParameters = rand && doorzichtig === 1 && !vlak ? lijn(hex) : GEEN_LIJN;
    if (gloed) {
      m.emissive.set(hex);
      m.emissiveIntensity = gloed;
    }
    if (doorzichtig < 1) {
      m.transparent = true;
      m.opacity = doorzichtig;
      m.depthWrite = false;
    }
    if (vlak) {
      m.polygonOffset = true;
      m.polygonOffsetFactor = -2;
      m.polygonOffsetUnits = -2;
    }
    m.userData.gedeeld = true;
    materialen.set(sleutel, m);
  }
  return m;
}

function maakMesh(geo, hex, pos, opties) {
  const m = new THREE.Mesh(geo, materiaal(hex, opties));
  if (pos) m.position.set(pos[0], pos[1], pos[2]);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export const bolGeometrie = () => gedeeldeGeometrie('bol', () => new THREE.SphereGeometry(1, 20, 14));

export function bol(hex, r, pos = [0, 0, 0], schaal = [1, 1, 1], opties) {
  const m = maakMesh(bolGeometrie(), hex, pos, opties);
  m.scale.set(r * schaal[0], r * schaal[1], r * schaal[2]);
  return m;
}

// Bovenste helft van een bol (voor paddenstoelhoeden en koepels)
export function halfbol(hex, r, pos = [0, 0, 0], schaal = [1, 1, 1], opties) {
  const geo = gedeeldeGeometrie('halfbol', () => new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2));
  const m = maakMesh(geo, hex, pos, opties);
  m.scale.set(r * schaal[0], r * schaal[1], r * schaal[2]);
  return m;
}

export function doos(hex, [b, h, d], pos = [0, 0, 0], opties) {
  const geo = gedeeldeGeometrie('doos', () => new THREE.BoxGeometry(1, 1, 1));
  const m = maakMesh(geo, hex, pos, opties);
  m.scale.set(b, h, d);
  return m;
}

export function cilinder(hex, rBoven, rOnder, h, pos = [0, 0, 0], segmenten = 14, opties) {
  const geo = gedeeldeGeometrie(`cil|${rBoven}|${rOnder}|${segmenten}`,
    () => new THREE.CylinderGeometry(rBoven, rOnder, 1, segmenten));
  const m = maakMesh(geo, hex, pos, opties);
  m.scale.y = h;
  return m;
}

export function kegel(hex, r, h, pos = [0, 0, 0], segmenten = 14, opties) {
  const geo = gedeeldeGeometrie(`kegel|${segmenten}`, () => new THREE.ConeGeometry(1, 1, segmenten));
  const m = maakMesh(geo, hex, pos, opties);
  m.scale.set(r, h, r);
  return m;
}

// Ring; boog = Math.PI geeft een halve ring (boogje)
export function torus(hex, R, r, pos = [0, 0, 0], boog = Math.PI * 2, opties) {
  const dikte = (r / R).toFixed(3);
  const geo = gedeeldeGeometrie(`torus|${dikte}|${boog.toFixed(3)}`,
    () => new THREE.TorusGeometry(1, r / R, 10, 28, boog));
  const m = maakMesh(geo, hex, pos, opties);
  m.scale.setScalar(R);
  return m;
}

export function octa(hex, r, pos = [0, 0, 0], schaal = [1, 1, 1], opties) {
  const geo = gedeeldeGeometrie('octa', () => new THREE.OctahedronGeometry(1));
  const m = maakMesh(geo, hex, pos, opties);
  m.scale.set(r * schaal[0], r * schaal[1], r * schaal[2]);
  return m;
}

export function steenvorm(hex, r, pos = [0, 0, 0], schaal = [1, 1, 1], opties) {
  const geo = gedeeldeGeometrie('steen', () => new THREE.DodecahedronGeometry(1, 0));
  const m = maakMesh(geo, hex, pos, opties);
  m.scale.set(r * schaal[0], r * schaal[1], r * schaal[2]);
  return m;
}

// Platte cirkel die op de grond ligt
export function schijf(hex, r, pos = [0, 0, 0], opties = {}) {
  const geo = gedeeldeGeometrie('schijf', () => new THREE.CircleGeometry(1, 28));
  const m = maakMesh(geo, hex, pos, { vlak: true, ...opties });
  m.rotation.x = -Math.PI / 2;
  m.scale.set(r, r, 1);
  m.castShadow = false;
  return m;
}

export function groep(x = 0, y = 0, z = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  return g;
}

// Twee grote anime-ogen (iris, pupil, glimlichtjes, ooglid) met blosjes eronder.
// x: afstand van het midden, y/z: positie op het gezicht, r: grootte
// dicht: true geeft blije dichte oogjes (^^)
export function ogen(ouder, x, y, z, r = 0.08, irisKleur = 0x5a2d1a, { blos = true, dicht = false } = {}) {
  const geen = { rand: false };
  const glim = { rand: false, gloed: 0.6 };
  for (const s of [-1, 1]) {
    const oog = groep(s * x, y, z);
    oog.rotation.y = s * 0.28;
    if (dicht) {
      const boogje = torus(0x2b160c, r * 0.6, r * 0.14, [0, -r * 0.3, r * 0.3], Math.PI, geen);
      boogje.scale.set(r * 0.6, r * 0.75, r * 0.6);
      oog.add(boogje);
      if (blos) oog.add(bol(0xff8fab, r * 0.55, [s * r * 0.35, -r * 1.25, r * 0.1], [1.3, 0.65, 0.3], { rand: false, doorzichtig: 0.7 }));
      ouder.add(oog);
      continue;
    }
    oog.add(bol(0xffffff, r, [0, 0, 0], [0.85, 1.15, 0.5], geen));
    oog.add(bol(irisKleur, r * 0.78, [0, -r * 0.05, r * 0.18], [0.85, 1.12, 0.5], geen));
    oog.add(bol(0x1a0d08, r * 0.42, [0, -r * 0.08, r * 0.4], [0.9, 1.1, 0.5], geen));
    oog.add(bol(0xffffff, r * 0.3, [r * 0.24, r * 0.36, r * 0.6], [1, 1, 0.5], glim));
    oog.add(bol(0xffffff, r * 0.13, [-r * 0.22, -r * 0.38, r * 0.55], [1, 1, 0.5], glim));
    // ooglid met een wimper-krulletje aan de buitenkant
    const lid = torus(0x2b160c, r, r * 0.13, [0, r * 0.02, r * 0.15], Math.PI * 0.5, geen);
    lid.rotation.z = Math.PI * (0.25 - s * 0.21);
    lid.scale.set(r * 0.92, r * 1.2, r);
    oog.add(lid);
    if (blos) oog.add(bol(0xff8fab, r * 0.55, [s * r * 0.35, -r * 1.45, r * 0.1], [1.3, 0.65, 0.3], { rand: false, doorzichtig: 0.7 }));
    ouder.add(oog);
  }
}

// Ruimt een hele scene of model op (behalve gedeelde onderdelen)
export function opruimen(object) {
  object.traverse((o) => {
    if (o.geometry && !o.geometry.userData.gedeeld) o.geometry.dispose();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of mats) {
      if (m.userData.gedeeld) continue;
      m.map?.dispose();
      m.dispose();
    }
  });
}
