// Simpele geluidjes, gemaakt met de Web Audio API (geen geluidsbestanden nodig).
let ctx = null;

export function activeer() {
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    ctx = null;
  }
}

function toon(freq, start, duur, { type = 'sine', volume = 0.15, glijNaar } = {}) {
  if (!ctx) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glijNaar) osc.frequency.exponentialRampToValueAtTime(glijNaar, t0 + duur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duur + 0.05);
}

export function gevonden() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => toon(f, i * 0.09, 0.35, { type: 'triangle', volume: 0.18 }));
}

export function spring() {
  toon(280, 0, 0.2, { glijNaar: 620, volume: 0.08 });
}

export function piep() {
  toon(1250, 0, 0.09, { type: 'triangle', volume: 0.07 });
  toon(1500, 0.12, 0.09, { type: 'triangle', volume: 0.07 });
}

export function gewonnen() {
  const melodie = [523.25, 659.25, 783.99, 659.25, 783.99, 1046.5, 1046.5];
  const tijden = [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1.0];
  melodie.forEach((f, i) => toon(f, tijden[i], i === melodie.length - 1 ? 0.7 : 0.25, { type: 'triangle', volume: 0.18 }));
}
