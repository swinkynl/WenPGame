// Sterretjes die wegspatten als je een vriendje vindt.
import * as THREE from 'three';

const geo = new THREE.OctahedronGeometry(0.16);
geo.userData.gedeeld = true;
const mats = [0xffd54f, 0xff80ab, 0x80deea, 0xb388ff, 0xffffff].map((c) => {
  const m = new THREE.MeshBasicMaterial({ color: c });
  m.userData.gedeeld = true;
  m.userData.outlineParameters = { visible: false };
  return m;
});

const belGeo = new THREE.SphereGeometry(0.07, 8, 6);
belGeo.userData.gedeeld = true;
const belMat = new THREE.MeshBasicMaterial({ color: 0xe8fbff, transparent: true, opacity: 0.7 });
belMat.userData.gedeeld = true;
belMat.userData.outlineParameters = { visible: false };

export class Effecten {
  constructor(scene) {
    this.scene = scene;
    this.deeltjes = [];
    this.bellen = [];
  }

  sterren(pos) {
    for (let i = 0; i < 28; i++) {
      const d = new THREE.Mesh(geo, mats[i % mats.length]);
      d.position.copy(pos);
      d.position.y += 1;
      const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 3;
      d.userData.v = new THREE.Vector3(Math.cos(a) * s, 4 + Math.random() * 4, Math.sin(a) * s);
      d.userData.leeftijd = 0;
      this.scene.add(d);
      this.deeltjes.push(d);
    }
  }

  // belletjes (uit de snorkel)
  bel(pos) {
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const d = new THREE.Mesh(belGeo, belMat);
      d.position.copy(pos);
      d.position.x += (Math.random() - 0.5) * 0.15;
      const s = 0.6 + Math.random() * 0.8;
      d.scale.setScalar(s);
      d.userData.bel = { s, fase: Math.random() * 6, leeftijd: i * -0.15 };
      this.scene.add(d);
      this.bellen.push(d);
    }
  }

  update(dt) {
    for (let i = this.bellen.length - 1; i >= 0; i--) {
      const d = this.bellen[i], b = d.userData.bel;
      b.leeftijd += dt;
      d.position.y += dt * 1.6;
      d.position.x += Math.sin(b.leeftijd * 6 + b.fase) * dt * 0.3;
      if (b.leeftijd > 2.5) {
        this.scene.remove(d);
        this.bellen.splice(i, 1);
      }
    }
    for (let i = this.deeltjes.length - 1; i >= 0; i--) {
      const d = this.deeltjes[i];
      d.userData.v.y -= 9 * dt;
      d.position.addScaledVector(d.userData.v, dt);
      d.rotation.x += dt * 5;
      d.rotation.y += dt * 4;
      d.userData.leeftijd += dt;
      const s = Math.max(0, 1 - d.userData.leeftijd / 1.4);
      d.scale.setScalar(s);
      if (s <= 0) {
        this.scene.remove(d);
        this.deeltjes.splice(i, 1);
      }
    }
  }
}
