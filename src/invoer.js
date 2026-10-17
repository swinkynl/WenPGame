// Besturing: toetsenbord + muis op de laptop, joystick + vegen op de iPad.
export class Invoer {
  constructor(element) {
    this.el = element;
    this.toetsen = new Set();
    this.joy = null;
    this.camId = null;
    this.camVorig = null;
    this.camDelta = { x: 0, y: 0 };
    this.zoom = 0;
    this.sprong = false;
    this.isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    this.joyEl = document.getElementById('joystick');
    this.joyKnop = document.getElementById('joystick-knop');

    addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      if (e.code === 'Space' && !e.repeat) this.sprong = true;
      this.toetsen.add(e.code);
    });
    addEventListener('keyup', (e) => this.toetsen.delete(e.code));
    addEventListener('blur', () => this.toetsen.clear());

    element.addEventListener('pointerdown', (e) => this.neer(e));
    element.addEventListener('pointermove', (e) => this.beweeg(e));
    element.addEventListener('pointerup', (e) => this.op(e));
    element.addEventListener('pointercancel', (e) => this.op(e));
    element.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoom += e.deltaY;
    }, { passive: false });
    element.addEventListener('contextmenu', (e) => e.preventDefault());

    document.getElementById('knop-spring').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.sprong = true;
    });
    document.addEventListener('gesturestart', (e) => e.preventDefault());
  }

  neer(e) {
    if (e.pointerType !== 'mouse' && !this.joy && e.clientX < innerWidth * 0.5) {
      // linkerkant van het scherm: joystick verschijnt waar de vinger is
      this.joy = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: 0, y: 0 };
      this.joyEl.style.left = e.clientX + 'px';
      this.joyEl.style.top = e.clientY + 'px';
      this.joyEl.classList.add('actief');
      this.zetKnop(0, 0);
    } else if (this.camId === null) {
      // rechterkant (of muis): rondkijken
      this.camId = e.pointerId;
      this.camVorig = { x: e.clientX, y: e.clientY };
    } else {
      return;
    }
    this.el.setPointerCapture?.(e.pointerId);
  }

  beweeg(e) {
    if (this.joy && e.pointerId === this.joy.id) {
      const max = 55;
      let dx = e.clientX - this.joy.x0, dy = e.clientY - this.joy.y0;
      const l = Math.hypot(dx, dy);
      if (l > max) {
        dx *= max / l;
        dy *= max / l;
      }
      this.joy.x = dx / max;
      this.joy.y = -dy / max;
      this.zetKnop(dx, dy);
    } else if (e.pointerId === this.camId) {
      this.camDelta.x += e.clientX - this.camVorig.x;
      this.camDelta.y += e.clientY - this.camVorig.y;
      this.camVorig = { x: e.clientX, y: e.clientY };
    }
  }

  op(e) {
    if (this.joy && e.pointerId === this.joy.id) {
      this.joy = null;
      this.joyEl.classList.remove('actief');
      this.joyEl.style.left = '';
      this.joyEl.style.top = '';
      this.zetKnop(0, 0);
    }
    if (e.pointerId === this.camId) this.camId = null;
  }

  zetKnop(dx, dy) {
    this.joyKnop.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  // {x, y}: x = links/rechts, y = vooruit/achteruit, lengte maximaal 1
  beweging() {
    const t = this.toetsen;
    let x = 0, y = 0;
    if (t.has('KeyW') || t.has('ArrowUp')) y += 1;
    if (t.has('KeyS') || t.has('ArrowDown')) y -= 1;
    if (t.has('KeyA') || t.has('ArrowLeft')) x -= 1;
    if (t.has('KeyD') || t.has('ArrowRight')) x += 1;
    if (x && y) {
      x *= Math.SQRT1_2;
      y *= Math.SQRT1_2;
    }
    if (this.joy) {
      let jx = this.joy.x, jy = this.joy.y;
      const l = Math.hypot(jx, jy);
      if (l < 0.15) {
        jx = jy = 0;
      } else {
        const s = Math.min(1, (l - 0.15) / 0.6) / l;
        jx *= s;
        jy *= s;
      }
      x += jx;
      y += jy;
    }
    return { x, y };
  }

  // draaien met toetsen Q/E (laptop)
  camToetsen() {
    return (this.toetsen.has('KeyQ') ? 1 : 0) - (this.toetsen.has('KeyE') ? 1 : 0);
  }

  neemCamDelta() {
    const d = { ...this.camDelta };
    this.camDelta.x = this.camDelta.y = 0;
    return d;
  }

  neemZoom() {
    const z = this.zoom;
    this.zoom = 0;
    return z;
  }

  neemSprong() {
    const s = this.sprong;
    this.sprong = false;
    return s;
  }

  reset() {
    this.sprong = false;
    this.zoom = 0;
    this.camDelta.x = this.camDelta.y = 0;
  }
}
