// Uitgeholde pompoen met gezichtje, waar een diertje in kan zitten
import { bol, cilinder, torus, schijf, groep } from '../hulp/vormen.js';

export function pompoenBak(g, r = 0.62) {
  const oranje = 0xff8a1f, geel = 0xffe066;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    g.add(bol(oranje, r * 0.62, [Math.cos(a) * r * 0.38, r * 0.72, Math.sin(a) * r * 0.38], [0.8, 0.9, 0.8]));
  }
  // donkere opening bovenin
  const gat = schijf(0x3b1d0a, r * 0.62, [0, r * 1.27, 0], { vlak: false });
  g.add(gat);
  // kawaii-gezichtje op de pompoen
  const gloei = { gloed: 0.9, rand: false };
  for (const s of [-1, 1]) g.add(bol(geel, r * 0.11, [s * r * 0.28, r * 0.82, r * 0.86], [1, 1.2, 0.4], gloei));
  const mond = torus(geel, r * 0.15, r * 0.035, [0, r * 0.6, r * 0.87], Math.PI, gloei);
  mond.rotation.z = Math.PI;
  g.add(mond);
  const steel = groep();
  steel.add(cilinder(0x5d7a2a, 0.04, 0.05, 0.2, [r * 0.55, r * 1.25, -r * 0.3], 6));
  g.add(steel);
}
