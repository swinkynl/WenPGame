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

// gloed: laat iets licht geven (0..1), doorzichtig: 0..1, vlak: voor platte dingen op de grond
export function materiaal(hex, { gloed = 0, doorzichtig = 1, vlak = false } = {}) {
  const sleutel = `${hex}|${gloed}|${doorzichtig}|${vlak}`;
  let m = materialen.get(sleutel);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color: hex });
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

// Twee ogen (wit + pupil + glimlichtje), links en rechts op afstand x
export function ogen(ouder, x, y, z, r = 0.08, irisKleur = 0x222222) {
  for (const s of [-1, 1]) {
    ouder.add(bol(0xffffff, r, [s * x, y, z]));
    ouder.add(bol(irisKleur, r * 0.62, [s * x, y, z + r * 0.55]));
    ouder.add(bol(0xffffff, r * 0.22, [s * x + r * 0.22, y + r * 0.28, z + r * 1.02]));
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
