// Camera die achter het hondje meeloopt.
import * as THREE from 'three';
import { draaiNaar, klem } from './hulp/wiskunde.js';

export class VolgCamera {
  constructor(camera) {
    this.camera = camera;
    this.yaw = Math.PI;
    this.pitch = 0.36;
    this.afstand = 8;
    this.doel = new THREE.Vector3();
    this.handmatigTot = 0;
    this.tmp = new THREE.Vector3();
  }

  reset(hond) {
    this.yaw = hond.hoek + Math.PI;
    this.pitch = 0.36;
    this.doel.copy(hond.positie);
    this.doel.y += 1.4;
  }

  update(dt, hond, invoer, beweging, { autoVolgen = true, extraDraai = 0 } = {}) {
    const d = invoer.neemCamDelta();
    const toets = invoer.camToetsen();
    if (d.x || d.y || toets) {
      this.yaw -= d.x * 0.006;
      this.pitch = klem(this.pitch + d.y * 0.004, 0.08, 1.1);
      this.yaw += toets * dt * 2.2;
      this.handmatigTot = performance.now() + 1500;
    }
    this.afstand = klem(this.afstand * (1 + invoer.neemZoom() * 0.001), 4, 15);
    this.yaw += extraDraai;

    // camera draait langzaam mee achter het hondje als het vooruit loopt
    const kracht = Math.hypot(beweging.x, beweging.y);
    if (autoVolgen && performance.now() > this.handmatigTot && kracht > 0.1 && beweging.y > -0.2) {
      this.yaw = draaiNaar(this.yaw, hond.hoek + Math.PI, dt * 1.6 * kracht);
    }

    const doel = this.tmp.copy(hond.positie);
    doel.y = hond.positie.y * 0.5 + 1.4;
    this.doel.lerp(doel, 1 - Math.exp(-dt * 10));

    const a = this.afstand, cp = Math.cos(this.pitch);
    this.camera.position.set(
      this.doel.x + Math.sin(this.yaw) * cp * a,
      this.doel.y + Math.sin(this.pitch) * a,
      this.doel.z + Math.cos(this.yaw) * cp * a,
    );
    if (this.camera.position.y < 0.6) this.camera.position.y = 0.6;
    this.camera.lookAt(this.doel);
  }
}
