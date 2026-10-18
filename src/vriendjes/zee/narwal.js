import { bol, kegel, torus, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'narwal',
  naam: 'Narwal Sprankel',
  emoji: '🦄',
  zweef: 0.6,
  maak() {
    const mint = 0x9ee6d0, licht = 0xeefcf6;
    const g = groep();
    g.userData.chibi = true;
    g.add(bol(mint, 0.62, [0, 0.85, 0], [1, 0.85, 1.25]));
    g.add(bol(licht, 0.5, [0, 0.65, 0.2], [1, 0.65, 1.15]));
    for (const [x, y, z] of [[-0.3, 1.25, -0.2], [0.25, 1.3, -0.35], [0.05, 1.32, 0.05], [0.45, 1.05, -0.1], [-0.5, 1.0, 0.1]]) {
      g.add(bol(0xffffff, 0.05, [x, y, z], [1, 0.5, 1], { rand: false }));
    }
    ogen(g, 0.26, 0.92, 0.66, 0.13, 0x1d5a5a);
    const mond = torus(0x1d5a5a, 0.09, 0.018, [0, 0.73, 0.72], Math.PI, { rand: false });
    mond.rotation.z = Math.PI;
    g.add(mond);
    // regenboog-hoorn
    const hoorn = groep(0, 1.2, 0.55);
    hoorn.rotation.x = 0.7;
    hoorn.add(kegel(0xfff3c4, 0.09, 0.6, [0, 0.3, 0], 10, { gloed: 0.3 }));
    [0xff8fab, 0xffd166, 0x74c0fc].forEach((k, i) => hoorn.add(torus(k, 0.075 - i * 0.02, 0.018, [0, 0.12 + i * 0.13, 0], Math.PI * 2, { rand: false })));
    hoorn.children.slice(1).forEach((r) => (r.rotation.x = Math.PI / 2));
    g.add(hoorn);
    for (const s of [-1, 1]) {
      const vin = bol(mint, 0.25, [s * 0.58, 0.55, 0.2], [1, 0.25, 0.6]);
      vin.rotation.z = -s * 0.5;
      g.add(vin);
    }
    const staart = groep(0, 0.9, -0.75);
    for (const s of [-1, 1]) {
      const vin = bol(mint, 0.25, [s * 0.22, 0.1, -0.12], [1.4, 0.3, 0.8]);
      vin.rotation.z = s * 0.4;
      staart.add(vin);
    }
    g.add(staart);
    g.userData.staart = staart;
    return g;
  },
};
