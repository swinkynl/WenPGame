import { bol, kegel, groep, ogen } from '../../hulp/vormen.js';

export default {
  id: 'zeepaardje',
  naam: 'Zeepaardje Krul',
  emoji: '🌊',
  zweef: 0.3,
  maak() {
    const geel = 0xffd86b, licht = 0xfff1c2;
    const g = groep();
    g.userData.chibi = true;
    g.add(bol(geel, 0.32, [0, 1.05, 0.08], [0.9, 1.25, 0.9]));
    g.add(bol(licht, 0.22, [0, 1.0, 0.22], [0.85, 1.1, 0.5]));
    // krulstaart
    const staart = groep(0, 0.75, 0);
    for (let i = 0; i < 8; i++) {
      const a = i * 0.55;
      staart.add(bol(geel, 0.15 - i * 0.012, [0, -Math.sin(Math.min(a, 1.6)) * 0.45 + (i > 4 ? (i - 4) * 0.06 : 0), -0.05 - Math.sin(a) * 0.18 + (i > 4 ? (i - 4) * 0.05 : 0)]));
    }
    g.add(staart);
    const kop = groep(0, 1.55, 0.05);
    g.add(kop);
    kop.add(bol(geel, 0.28));
    const snuit = kegel(geel, 0.08, 0.3, [0, -0.06, 0.32], 8);
    snuit.rotation.x = Math.PI / 2;
    kop.add(snuit);
    ogen(kop, 0.12, 0.04, 0.22, 0.1, 0x6a4a00);
    for (let i = 0; i < 3; i++) kop.add(kegel(0xffb84d, 0.05, 0.14, [0, 0.27 - i * 0.05, -0.12 - i * 0.08], 6));
    const vin = bol(0xffb84d, 0.15, [0, 1.05, -0.28], [0.15, 0.9, 0.7]);
    g.add(vin);
    g.userData.kop = kop;
    g.userData.staart = staart;
    return g;
  },
};
