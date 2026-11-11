// Getekend ("papieren") figuurtje: een tekening die altijd naar de camera draait.
// Met plaatjes van voren, opzij en van achteren laat het de kant zien die je zou moeten zien.
// Alleen een plaatje van voren mag ook: dan kijkt het figuurtje je altijd aan.
import * as THREE from 'three';
import { hoekVerschil } from './hulp/wiskunde.js';

const laden = new THREE.TextureLoader();
const cache = new Map();

function laadPlaatje(url) {
  if (!cache.has(url)) {
    const t = laden.load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    cache.set(url, t);
  }
  return cache.get(url);
}

export class PapierFiguur {
  // plaatjes: { voor: 'pad/voor.png', zij: '...', achter: '...' } (zij en achter mogen weg)
  // De zij-tekening moet naar links kijken.
  constructor(plaatjes, hoogte = 1.4, { schaduw = true } = {}) {
    this.hoogte = hoogte;
    this.beelden = {};
    for (const kant of ['voor', 'zij', 'achter']) if (plaatjes[kant]) this.beelden[kant] = laadPlaatje(plaatjes[kant]);
    this.groep = new THREE.Group();
    this.draaier = new THREE.Group();
    this.groep.add(this.draaier);

    const mat = new THREE.MeshBasicMaterial({ map: this.beelden.voor, alphaTest: 0.4, side: THREE.DoubleSide });
    mat.userData.outlineParameters = { visible: false }; // de tekening heeft zelf al lijnen
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.translate(0, 0.5, 0);
    this.kaart = new THREE.Mesh(geo, mat);
    this.draaier.add(this.kaart);

    if (schaduw) {
      const schaduwMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false });
      schaduwMat.userData.outlineParameters = { visible: false };
      this.schaduw = new THREE.Mesh(new THREE.CircleGeometry(hoogte * 0.38, 24), schaduwMat);
      this.schaduw.rotation.x = -Math.PI / 2;
      this.schaduw.position.y = 0.04;
      this.schaduw.scale.set(1, 0.7, 1);
      this.groep.add(this.schaduw);
    }
    this.spiegel = 1;
    this.zet();
  }

  // positie en kijkrichting (hoek) van het figuurtje in de wereld, en waar de camera staat
  kijkVanaf(positie, hoek, camera) {
    const c = Math.atan2(camera.x - positie.x, camera.z - positie.z);
    this.draaier.rotation.y = c - hoek; // kaartje recht naar de camera
    const verschil = hoekVerschil(hoek, c), a = Math.abs(verschil);
    let kant = 'zij';
    if (a < Math.PI * 0.3) kant = 'voor';
    else if (a > Math.PI * 0.7) kant = 'achter';
    if (!this.beelden[kant]) kant = 'voor';
    // de zij-tekening kijkt naar links; spiegelen als het figuurtje naar rechts kijkt
    this.spiegel = kant === 'zij' && verschil < 0 ? -1 : 1;
    this.kaart.material.map = this.beelden[kant];
    this.zet(this.hup, this.kantel, this.rek);
  }

  // hup: omhoog springen, kantel: wiebelen, rek: uitrekken (1 = normaal)
  zet(hup = 0, kantel = 0, rek = 1) {
    this.hup = hup;
    this.kantel = kantel;
    this.rek = rek;
    const plaatje = this.kaart.material.map?.image;
    const verhouding = plaatje && plaatje.width ? plaatje.width / plaatje.height : 0.85;
    this.kaart.position.y = hup;
    this.kaart.rotation.z = kantel;
    this.kaart.scale.set(this.hoogte * verhouding * this.spiegel / rek, this.hoogte * rek, 1);
  }
}
