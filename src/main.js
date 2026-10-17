// Het spel: start, spelregels en de spellus.
import * as THREE from 'three';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { Wereld } from './wereld.js';
import { Hondje } from './hondje.js';
import { Invoer } from './invoer.js';
import { VolgCamera } from './camera.js';
import { Vriendje } from './vriendje.js';
import { Effecten } from './effecten.js';
import { GEBIEDEN } from './gebieden/index.js';
import { VRIENDJES } from './vriendjes/index.js';
import { opruimen } from './hulp/vormen.js';
import { schud } from './hulp/wiskunde.js';
import * as UI from './ui.js';
import * as Geluid from './geluid.js';

const VIND_AFSTAND = 3.2;   // hoe dichtbij het hondje moet komen om een vriendje te vinden
const HINT_AFSTAND = 16;    // binnen deze afstand piept een vriendje af en toe

const canvas = document.getElementById('spel');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// tekenfilm-omlijning om alles heen
const tekenaar = new OutlineEffect(renderer, { defaultThickness: 0.0035, defaultColor: [0.25, 0.14, 0.1], defaultKeepAlive: true });

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 220);
const invoer = new Invoer(canvas);
const volgCamera = new VolgCamera(camera);
if (invoer.isTouch) document.body.classList.add('touch');

let spel = null;
let laatsteKeuze = null;

function pasFormaatAan() {
  const b = window.innerWidth, h = window.innerHeight;
  renderer.setSize(b, h, false);
  camera.aspect = b / h;
  camera.fov = b < h ? 75 : 60;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', pasFormaatAan);
pasFormaatAan();

function stopSpel() {
  if (!spel) return;
  opruimen(spel.wereld.scene);
  spel = null;
}

function startSpel(keuze) {
  laatsteKeuze = keuze;
  Geluid.activeer();
  UI.toonScherm('laden');
  // even wachten zodat het laadscherm getekend wordt
  setTimeout(() => {
    stopSpel();
    const gebied = GEBIEDEN.find((g) => g.id === keuze.gebied) ?? GEBIEDEN[0];
    const wereld = new Wereld(gebied);
    camera.far = wereld.zicht + 80;
    camera.updateProjectionMatrix();

    const hond = new Hondje();
    wereld.scene.add(hond.groep);

    const ids = gebied.vriendjes ?? VRIENDJES.map((v) => v.id);
    let gekozen = schud(ids.map((id) => VRIENDJES.find((v) => v.id === id)).filter(Boolean)).slice(0, keuze.aantal);
    const plekken = wereld.kiesVerstopplekken(gekozen.length);
    gekozen = gekozen.slice(0, plekken.length);
    const vriendjes = gekozen.map((def, i) => {
      const v = new Vriendje(def);
      v.plaats({ ...plekken[i], y: wereld.hoogte(plekken[i].x, plekken[i].z) });
      wereld.scene.add(v.groep);
      return v;
    });

    spel = {
      gebied, wereld, hond, vriendjes,
      volgers: [],
      fase: 'zoeken',
      starttijd: performance.now(),
      eindtijd: 0,
      feestTimer: 0,
      hulpNeus: keuze.hulpNeus,
      hintTimer: 3,
      effecten: new Effecten(wereld.scene),
      tijd: 0,
    };
    volgCamera.reset(hond);
    invoer.reset();
    UI.toonHud(vriendjes.length, keuze.hulpNeus, invoer.isTouch);
    UI.melding(`Zoek ${vriendjes.length} vriendjes! 🔍`);
  }, 60);
}

function naarMenu() {
  stopSpel();
  UI.toonScherm('menu');
}

function vind(v) {
  v.vind();
  spel.volgers.push(v);
  const n = spel.volgers.length, totaal = spel.vriendjes.length;
  Geluid.gevonden();
  spel.effecten.sterren(v.groep.position);
  spel.hond.blij();
  UI.vriendGevonden(n - 1, v.def, n, totaal);
  if (n === totaal) {
    spel.fase = 'feest';
    spel.feestTimer = 0;
    spel.eindtijd = performance.now();
    UI.melding('Hoera! Alle vriendjes gevonden! 🎉', 3000);
  } else {
    UI.melding(`${v.def.emoji} ${v.def.naam} gevonden!`);
  }
}

const tmp = new THREE.Vector3();
let vorige = performance.now();

function lus(nu) {
  requestAnimationFrame(lus);
  const dt = Math.min((nu - vorige) / 1000, 0.05);
  vorige = nu;
  if (!spel) return;

  spel.tijd += dt;
  const t = spel.tijd;
  const { wereld, hond } = spel;
  const hoogte = (x, z) => wereld.hoogte(x, z);
  const zoeken = spel.fase === 'zoeken';

  const beweging = zoeken ? invoer.beweging() : { x: 0, y: 0 };
  if (invoer.neemSprong() && zoeken && hond.spring()) Geluid.spring();
  hond.update(dt, beweging, volgCamera.yaw, wereld);

  // verstopte vriendjes: gevonden?
  let dichtsbij = Infinity, dichtsteVriendje = null;
  for (const v of spel.vriendjes) {
    if (v.gevonden) continue;
    const d = Math.hypot(v.groep.position.x - hond.positie.x, v.groep.position.z - hond.positie.z);
    if (zoeken && d < VIND_AFSTAND) {
      vind(v);
    } else if (d < dichtsbij) {
      dichtsbij = d;
      dichtsteVriendje = v;
    }
  }

  // af en toe een piepje als je dichtbij bent
  spel.hintTimer -= dt;
  if (zoeken && spel.hulpNeus && dichtsteVriendje && dichtsbij < HINT_AFSTAND && spel.hintTimer <= 0) {
    dichtsteVriendje.hop();
    Geluid.piep();
    spel.hintTimer = 5;
  }

  // vriendjes bewegen
  for (const v of spel.vriendjes) if (!v.gevonden) v.update(dt, t, null, hond.positie);
  spel.volgers.forEach((v, i) => {
    if (spel.fase === 'feest') {
      if (v.toestand === 'volgen') v.feest();
      const a = (i / spel.volgers.length) * Math.PI * 2;
      tmp.set(hond.positie.x + Math.sin(a) * 3, 0, hond.positie.z + Math.cos(a) * 3);
      v.update(dt, t, tmp, hond.positie, hoogte);
    } else {
      v.update(dt, t, i === 0 ? hond.positie : spel.volgers[i - 1].groep.position, hond.positie, hoogte);
    }
  });

  if (spel.fase === 'feest') {
    spel.feestTimer += dt;
    if (spel.feestTimer > 3.2 && !spel.gewonnenGetoond) {
      spel.gewonnenGetoond = true;
      Geluid.gewonnen();
      UI.toonGewonnen({
        aantal: spel.vriendjes.length,
        seconden: (spel.eindtijd - spel.starttijd) / 1000,
        emojis: spel.vriendjes.map((v) => v.def.emoji),
      });
    }
  }

  spel.effecten.update(dt);
  volgCamera.update(dt, hond, invoer, beweging, {
    autoVolgen: zoeken,
    extraDraai: spel.fase === 'feest' ? dt * 0.35 : 0,
    hoogte,
  });
  wereld.update(dt, t, hond.positie, camera);
  if (spel.hulpNeus) UI.neus(dichtsbij);

  tekenaar.render(wereld.scene, camera);
}

document.getElementById('knop-huis').addEventListener('click', naarMenu);
document.getElementById('knop-menu').addEventListener('click', naarMenu);
document.getElementById('knop-opnieuw').addEventListener('click', () => startSpel(laatsteKeuze));

UI.bouwMenu(GEBIEDEN, startSpel);
UI.toonScherm('menu');
requestAnimationFrame(lus);

// voor testen in de console
window.spel = () => spel;
window.debug = { renderer, tekenaar, camera, volgCamera, invoer, lus };
