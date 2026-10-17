# Waar zijn de vriendjes? 🐶

Een 3D-verstoppertje. Je bent een geel hondje en zoekt verstopte vriendjes.
Kom je dicht genoeg bij een vriendje, dan is het gevonden: het springt van blijdschap en loopt met je mee.
Heb je ze allemaal gevonden, dan is er feest. 🎉

## Spelen

**Op de laptop:** dubbelklik op `start.bat`. De browser opent het spel op http://localhost:8080.
(Python moet geïnstalleerd zijn, en dat is hier zo.)

**Op de iPad:** start het spel op de laptop met `start.bat`. Het zwarte venster laat een adres zien zoals
`http://192.168.1.23:8080`. Open dat adres in Safari op de iPad (laptop en iPad op dezelfde wifi).
Vraagt Windows om toegang voor Python tot het netwerk? Klik dan op *Toestaan* (privénetwerk).
Tip: kies in Safari *Deel → Zet op beginscherm*, dan opent het spel straks schermvullend als een app.

| | Laptop | iPad |
|---|---|---|
| Lopen | pijltjes of WASD | linkerkant van het scherm vasthouden en slepen |
| Rondkijken | muis slepen, Q/E | rechterkant van het scherm slepen |
| Springen | spatie | knop *Hop!* |
| In- en uitzoomen | scrollwiel | |

De **snuffelneus** rechtsboven laat zien hoe dicht je bij een verstopt vriendje bent (koud → heet).
Ben je dichtbij, dan piept het vriendje af en toe en maakt het een sprongetje. Je kunt de neus uitzetten in het menu.

## Hoe het in elkaar zit

```
index.html, style.css       menu en knoppen
src/main.js                 spelregels en spellus
src/hondje.js               het hondje (model + lopen)
src/vriendje.js             gedrag van vriendjes (verstoppen, meelopen, feest)
src/wereld.js               grond, lucht, botsen, verstopplekken
src/decor.js                bomen, paddenstoelen, schuur, molen, maisveld, ...
src/gebieden/               één bestand per gebied  (+ index.js met de lijst)
src/vriendjes/              één bestand per vriendje (+ index.js met de lijst)
```

Alles wordt gebouwd uit simpele vormen (bollen, dozen, kegels), dus er zijn geen plaatjes of modelbestanden nodig.
Three.js wordt van internet geladen, dus het spel heeft internet nodig.

## Een nieuw vriendje toevoegen

1. Kopieer bijvoorbeeld `src/vriendjes/kat.js` naar `src/vriendjes/hond.js`.
2. Pas `id`, `naam` en `emoji` aan, en bouw het model in `maak()` met `bol`, `doos`, `kegel`, enzovoort.
   Het dier staat op de grond (y = 0) en kijkt naar voren (+z). Ongeveer 1 meter hoog is goed.
   Zet `g.userData.kop` en `g.userData.staart`, dan bewegen die vanzelf.
3. Zet het in `src/vriendjes/index.js` en zet de `id` in de `vriendjes`-lijst van een gebied.

Heb je een 3D-model als `.glb`-bestand (bijvoorbeeld uit Blender)? Zet het in een map `modellen/` en gebruik:

```js
export default { id: 'draak', naam: 'Draakje Vuur', emoji: '🐉', model: 'modellen/draak.glb', schaal: 1 };
```

## Een nieuw gebied toevoegen

1. Kopieer `src/gebieden/tovertuin.js` naar bijvoorbeeld `src/gebieden/strand.js`.
2. Pas naam, emoji, kleuren en `vriendjes` aan, en vul `bouw(w)` met decor:
   - `w.plaats(D.schuur(w), x, z)`: één ding op een vaste plek
   - `w.verspreid((w) => D.boom(w), 40)`: veertig keer op willekeurige plekken
   - `D.pad(...)`, `D.maisveld(...)`, `D.weide(...)`, `D.bloemen(...)`: zie `src/decor.js`
3. Zet het in `src/gebieden/index.js`. Het verschijnt dan vanzelf in het menu.

Vriendjes verstoppen zich op plekjes die het decor zelf aangeeft (`userData.verstop`): achter bomen,
in struiken, naast gebouwen en in maisvelden. Elk spel kiest willekeurig andere plekjes en andere vriendjes.

Nieuw decor maak je in `src/decor.js`, op dezelfde manier als een vriendje. Met `userData` geef je aan:
- `botsers: [{ r: 0.5 }]` of `[{ b: 4, d: 2 }]`: waar het hondje niet doorheen kan lopen
- `verstop: [[x, z], ...]`: plekjes waar een vriendje kan zitten
- `ruimte: 2`: hoeveel plek het inneemt

## Ontwerpen met Claude Design

Ontwerp een vriendje of gebied in Claude Design (een plaatje of schets is genoeg) en geef het aan Claude Code
met de vraag: *"Maak hier een vriendje/gebied van voor het spel."* Claude bouwt het dan na in de stijl van het spel.
