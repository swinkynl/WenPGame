"""Knipt een turnaround sheet (voor, zij, achter naast elkaar) in drie losse PNG's
met een doorzichtige achtergrond. Gebruik: python tools/knip_plaatje.py <plaatje> <uitvoermap>"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

bron, uit = sys.argv[1], sys.argv[2]
os.makedirs(uit, exist_ok=True)
img = Image.open(bron).convert('RGBA')
a = np.array(img).astype(np.int16)

if a[:, :, 3].min() < 20:
    figuur = a[:, :, 3] >= 20  # plaatje is al doorzichtig
else:
    licht = a[:, :, :3].min(axis=2) > 225  # witte achtergrond die aan de rand vastzit
    labels, _ = ndimage.label(licht)
    rand = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    figuur = ~np.isin(labels, list(rand))
    a[:, :, 3] = np.where(figuur, 255, 0)

# elk aanzicht is een los figuur; kleine losse stukjes horen bij het dichtstbijzijnde figuur
labels, n = ndimage.label(figuur, structure=np.ones((3, 3)))
groottes = ndimage.sum(figuur, labels, range(1, n + 1))
grootste = [int(i) + 1 for i in np.argsort(groottes)[-3:]]
midden = {l: ndimage.center_of_mass(figuur, labels, l) for l in range(1, n + 1)}
grootste.sort(key=lambda l: midden[l][1])  # van links naar rechts: voor, zij, achter
toewijzing = np.zeros_like(labels)
for l in range(1, n + 1):
    dichtst = min(grootste, key=lambda g: (midden[g][0] - midden[l][0]) ** 2 + (midden[g][1] - midden[l][1]) ** 2)
    toewijzing[labels == l] = dichtst

for naam, l in zip(['voor', 'zij', 'achter'], grootste):
    masker = toewijzing == l
    ys, xs = np.where(masker)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    stuk = a[y0:y1, x0:x1].copy()
    stuk[:, :, 3] = np.where(masker[y0:y1, x0:x1], stuk[:, :, 3], 0)
    beeld = Image.fromarray(stuk.astype(np.uint8), 'RGBA')
    beeld = beeld.resize((round(beeld.width * 512 / beeld.height), 512), Image.LANCZOS)
    rand = Image.new('RGBA', (beeld.width + 8, beeld.height + 8), (0, 0, 0, 0))
    rand.paste(beeld, (4, 4))
    rand.save(os.path.join(uit, f'{naam}.png'), optimize=True)
    print(naam, rand.size)
