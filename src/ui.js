// Alles wat over het spel heen ligt: menu, teller, snuffelneus, meldingen, gewonnen-scherm.
const $ = (id) => document.getElementById(id);
const OPSLAG = 'vriendjes-instellingen';
const AANTALLEN = [3, 5, 8];

export function laadInstellingen() {
  try {
    return JSON.parse(localStorage.getItem(OPSLAG)) ?? {};
  } catch {
    return {};
  }
}

function bewaar(instellingen) {
  try {
    localStorage.setItem(OPSLAG, JSON.stringify(instellingen));
  } catch {
    // geen opslag beschikbaar, niet erg
  }
}

export function toonScherm(naam) {
  $('menu').classList.toggle('verborgen', naam !== 'menu');
  $('laden').classList.toggle('verborgen', naam !== 'laden');
  $('gewonnen').classList.toggle('verborgen', naam !== 'gewonnen');
  $('hud').classList.toggle('verborgen', naam !== 'spel');
}

export function bouwMenu(gebieden, opStart) {
  const inst = laadInstellingen();
  let gebied = gebieden.find((g) => g.id === inst.gebied)?.id ?? gebieden[0].id;
  let aantal = AANTALLEN.includes(inst.aantal) ? inst.aantal : 5;

  const kaarten = $('gebieden');
  kaarten.innerHTML = '';
  for (const g of gebieden) {
    const knop = document.createElement('button');
    knop.className = 'kaart';
    knop.dataset.id = g.id;
    knop.style.background = `linear-gradient(150deg, ${g.kaartKleuren[0]}, ${g.kaartKleuren[1]})`;
    knop.innerHTML = `<span class="emoji">${g.emoji}</span><span class="naam">${g.naam}</span><span class="uitleg">${g.beschrijving ?? ''}</span>`;
    knop.onclick = () => {
      gebied = g.id;
      markeer();
    };
    kaarten.append(knop);
  }

  const aantallen = $('aantallen');
  aantallen.innerHTML = '';
  for (const n of AANTALLEN) {
    const knop = document.createElement('button');
    knop.className = 'keuze';
    knop.dataset.n = n;
    knop.textContent = n;
    knop.onclick = () => {
      aantal = n;
      markeer();
    };
    aantallen.append(knop);
  }

  $('hulp-neus').checked = inst.hulpNeus ?? true;

  function markeer() {
    for (const k of kaarten.children) k.classList.toggle('gekozen', k.dataset.id === gebied);
    for (const k of aantallen.children) k.classList.toggle('gekozen', Number(k.dataset.n) === aantal);
  }
  markeer();

  $('knop-start').onclick = () => {
    const keuze = { gebied, aantal, hulpNeus: $('hulp-neus').checked };
    bewaar(keuze);
    opStart(keuze);
  };
}

let uitlegTimer = null;

export function toonHud(aantal, hulpNeus, isTouch) {
  const rij = $('teller-vriendjes');
  rij.innerHTML = '';
  for (let i = 0; i < aantal; i++) {
    const plek = document.createElement('div');
    plek.className = 'plekje';
    plek.textContent = '?';
    rij.append(plek);
  }
  $('teller-tekst').textContent = `0 / ${aantal}`;
  $('neus').classList.toggle('verborgen', !hulpNeus);
  vorigNiveau = -1;

  const uitleg = $('uitleg');
  uitleg.textContent = isTouch
    ? 'Links op het scherm: sleep om te lopen · Rechts: sleep om rond te kijken'
    : 'Pijltjes of WASD: lopen · Spatie: springen · Muis slepen: rondkijken';
  uitleg.classList.remove('weg');
  clearTimeout(uitlegTimer);
  uitlegTimer = setTimeout(() => uitleg.classList.add('weg'), 7000);
  toonScherm('spel');
}

export function vriendGevonden(index, def, gevonden, totaal) {
  const plek = $('teller-vriendjes').children[index];
  if (plek) {
    plek.textContent = def.emoji;
    plek.classList.add('gevonden');
  }
  $('teller-tekst').textContent = `${gevonden} / ${totaal}`;
}

let meldingTimer = null;

export function melding(tekst, duur = 2600) {
  const el = $('melding');
  el.textContent = tekst;
  el.classList.remove('zichtbaar');
  void el.offsetWidth; // animatie opnieuw starten
  el.classList.add('zichtbaar');
  clearTimeout(meldingTimer);
  meldingTimer = setTimeout(() => el.classList.remove('zichtbaar'), duur);
}

let vorigNiveau = -1;

// Snuffelneus: hoe dichter bij een verstopt vriendje, hoe warmer
export function neus(afstand) {
  const niveau = Math.max(0, Math.min(1, 1 - (afstand - 4) / 65));
  const afgerond = Math.round(niveau * 40) / 40;
  if (afgerond === vorigNiveau) return;
  vorigNiveau = afgerond;
  const vulling = $('neus-vulling');
  vulling.style.width = `${8 + afgerond * 92}%`;
  vulling.style.backgroundColor = `hsl(${220 - 220 * afgerond}, 90%, 55%)`;
  $('neus-tekst').textContent = afgerond < 0.3 ? 'koud' : afgerond < 0.6 ? 'lauw' : afgerond < 0.85 ? 'warm!' : 'heet!!';
  $('neus-icoon').style.setProperty('--tempo', `${2 - afgerond * 1.7}s`);
}

function tijdTekst(sec) {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  if (m === 0) return `${s} seconden`;
  return `${m} ${m === 1 ? 'minuut' : 'minuten'} en ${s} seconden`;
}

export function toonGewonnen({ aantal, seconden, emojis }) {
  $('gewonnen-tekst').textContent = `Je hebt alle ${aantal} vriendjes gevonden in ${tijdTekst(seconden)}!`;
  $('gewonnen-vriendjes').textContent = emojis.join(' ');
  toonScherm('gewonnen');
  confetti();
}

function confetti() {
  const kleuren = ['#ff6fae', '#ffd166', '#8e6cff', '#80deea', '#8ce99a', '#ff8a65'];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = kleuren[i % kleuren.length];
    c.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
    c.style.animationDelay = `${Math.random() * 1.2}s`;
    document.body.append(c);
    setTimeout(() => c.remove(), 6500);
  }
}
