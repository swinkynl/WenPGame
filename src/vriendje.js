// Gedrag van een vriendje: verstopt zitten, blij springen als het gevonden is, en meelopen.
import * as THREE from 'three';
import { draaiNaar } from './hulp/wiskunde.js';
import { laadGLB } from './hulp/modellen.js';

export class Vriendje {
  constructor(def) {
    this.def = def;
    this.groep = new THREE.Group();
    this.model = def.maak ? def.maak() : new THREE.Group();
    this.groep.add(this.model);
    // chibi-stijl: grotere koppies
    const kop = this.model.userData.kop;
    if (kop && kop.position.y > 0) kop.scale.multiplyScalar(1.22);
    this.toestand = 'verstopt';
    this.fase = Math.random() * 10;
    this.timer = 0;
    this.hopTimer = 0;
    this.loopFase = 0;

    // Een vriendje kan ook een .glb-model gebruiken (zie README)
    if (def.model) {
      laadGLB(def.model).then((scene) => {
        scene.scale.setScalar(def.schaal ?? 1);
        this.model.clear();
        this.model.userData = {};
        this.model.add(scene);
      }).catch((e) => console.warn('Kon model niet laden:', def.model, e));
    }
  }

  get gevonden() {
    return this.toestand !== 'verstopt';
  }

  plaats(p) {
    this.groep.position.set(p.x, 0, p.z);
    this.groep.rotation.y = Math.random() * Math.PI * 2;
  }

  vind() {
    this.toestand = 'blij';
    this.timer = 0;
    this.model.scale.set(1, 1, 1);
  }

  hop() {
    if (this.toestand === 'verstopt') this.hopTimer = 0.5;
  }

  feest() {
    this.toestand = 'feest';
  }

  // doel: positie om naartoe te lopen, hond: positie van het hondje
  update(dt, t, doel, hond) {
    const m = this.model, ud = m.userData;
    if (ud.kop) ud.kop.rotation.y = Math.sin(t * 0.9 + this.fase) * 0.45;
    if (ud.staart) ud.staart.rotation.z = Math.sin(t * (this.toestand === 'verstopt' ? 3 : 10) + this.fase) * 0.35;

    if (this.toestand === 'verstopt') {
      m.scale.y = 1 + Math.sin(t * 2.2 + this.fase) * 0.035;
      if (this.hopTimer > 0) {
        this.hopTimer -= dt;
        m.position.y = Math.sin((1 - Math.max(0, this.hopTimer) / 0.5) * Math.PI) * 0.45;
      } else {
        m.position.y = 0;
      }
      return;
    }

    if (this.toestand === 'blij') {
      this.timer += dt;
      const p = Math.min(this.timer / 0.9, 1);
      m.position.y = Math.sin(p * Math.PI) * 1.6;
      m.rotation.y = p * Math.PI * 2;
      if (p >= 1) {
        this.toestand = 'volgen';
        m.rotation.y = 0;
        m.position.y = 0;
      }
      return;
    }

    // volgen of feest
    const pos = this.groep.position;
    const dx = doel.x - pos.x, dz = doel.z - pos.z, d = Math.hypot(dx, dz);
    const afstand = this.toestand === 'feest' ? 0.15 : 2.3;
    let v = 0;
    if (d > afstand) {
      v = Math.min((d - afstand) * 3.5, 13);
      pos.x += (dx / d) * v * dt;
      pos.z += (dz / d) * v * dt;
      this.groep.rotation.y = draaiNaar(this.groep.rotation.y, Math.atan2(dx, dz), dt * 10);
    }
    if (v > 0.4) {
      this.loopFase += dt * 13;
      m.position.y = Math.abs(Math.sin(this.loopFase)) * 0.3;
    } else if (this.toestand === 'feest') {
      m.position.y = Math.abs(Math.sin(t * 5 + this.fase)) * 0.9;
      this.groep.rotation.y = draaiNaar(this.groep.rotation.y, Math.atan2(hond.x - pos.x, hond.z - pos.z), dt * 8);
    } else {
      m.position.y = Math.max(0, m.position.y - dt * 3);
    }
  }
}
