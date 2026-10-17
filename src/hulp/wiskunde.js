export const klem = (v, min, max) => Math.max(min, Math.min(max, v));

export function hoekVerschil(van, naar) {
  let d = (naar - van) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// Draai een hoek richting een doelhoek, maximaal 'max' radialen per stap
export function draaiNaar(huidig, doel, max) {
  return huidig + klem(hoekVerschil(huidig, doel), -max, max);
}

export function schud(lijst) {
  for (let i = lijst.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lijst[i], lijst[j]] = [lijst[j], lijst[i]];
  }
  return lijst;
}

// Willekeurige getallen die elke keer hetzelfde zijn voor hetzelfde zaadje,
// zodat een gebied er altijd hetzelfde uitziet.
export function maakRng(zaadje) {
  let a = zaadje >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
