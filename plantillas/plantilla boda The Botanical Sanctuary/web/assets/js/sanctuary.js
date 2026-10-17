/* =========================================================
   The Botanical Sanctuary · motor del recorrido
   Vanilla JS, sin dependencias. Ver references/scrub-pipeline.md
   ========================================================= */
(() => {
  'use strict';

  const CFG = Object.assign({
    video: null, videoBytes: 0, stills: [], stillsPortrait: [], details: [],
    chapterTimes: [0, .25, .5, .75, 1], weddingDate: null, rsvpEndpoint: null, rsvpEmail: null
  }, window.SANCTUARY || {});
  const GATES = window.SANCTUARY_GATES;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const smooth = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const rng = seed => { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const pick = (r, list) => list[Math.floor(r() * list.length)];
  const f1 = v => v.toFixed(1);
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;

  const hero = $('.hero');
  const stage = $('#stage');
  const video = $('#hero');
  const procEl = $('#proc');
  const stillsEl = $('#stills');
  const candlesEl = $('#candles');
  const leavesEl = $('#leaves');
  const duskEls = [$('.dusk', stage), $('.vignette', stage)];
  const hudItems = $$('.hud li');
  const hudFill = $('.hud-line i');
  const ring = $('.ring', stage);
  const STOPS = [0, .25, .55, .80, 1];   // fronteras de las cuatro láminas en progreso de scroll

  /* ---------------------------------------------------------
     1. Texto partido en palabras o letras (una sola vez)
     --------------------------------------------------------- */
  function splitText() {
    $$('[data-split]').forEach((el, idx) => {
      const mode = el.dataset.split;
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      const band = el.closest('.band');
      const fx = band ? [...band.classList].find(c => c.startsWith('fx-')) : '';
      const spread = parseFloat(el.dataset.spread || (band && band.dataset.spread) || '0.42');
      const delay = parseFloat(el.dataset.delay || '0');
      const r = rng(1000 + idx * 97);
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = text;
      const vis = document.createElement('span');
      vis.className = 'split-vis';
      vis.setAttribute('aria-hidden', 'true');
      const words = text.split(' ');
      const total = text.replace(/ /g, '').length;
      let ci = 0;
      words.forEach((word, wi) => {
        const w = document.createElement('span');
        w.className = 'w';
        if (mode === 'words') {
          w.textContent = word;
          const th = Math.min(.5, delay + wi / Math.max(1, words.length - 1) * spread * .9 + r() * .04);
          w.style.cssText = `--th:${th.toFixed(3)};--jr:${f1((r() - .5) * 10)}deg`;
        } else {
          for (const ch of word) {
            const c = document.createElement('span');
            c.className = 'c';
            c.textContent = ch;
            const th = Math.min(.58, delay + ci / total * spread + r() * .06);
            let jx, jy, jr;
            if (fx === 'fx-breeze') { jx = -(30 + r() * 90); jy = (r() - .5) * 64; jr = (r() - .5) * 130; }
            else { jx = 40 + r() * 120; jy = 0; jr = 0; }
            c.style.cssText = `--th:${th.toFixed(3)};--jx:${f1(jx)}px;--jy:${f1(jy)}px;--jr:${f1(jr)}deg`;
            w.appendChild(c);
            ci++;
          }
        }
        vis.appendChild(w);
        if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '));
      });
      el.textContent = '';
      el.append(sr, vis);
    });
  }

  /* ---------------------------------------------------------
     2. Escenas dibujadas (respaldo sin imágenes ni vídeo)
     --------------------------------------------------------- */
  const svgWrap = s => `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${s}</svg>`;
  const blurDef = (id, n) => `<filter id="${id}b${n}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${n}"/></filter>`;

  /* Follaje: hojas de eucalipto, hojas de olivo, rosas y espigas. Nada de círculos con brillo (parecen globos). */
  const PAL_DAY = { leaf: ['#7F8E7B', '#9FAE98', '#6D7756', '#5E6748', '#8A9A86', '#B2BDA8'], lit: ['#C7CFAE', '#B9C49E', '#D6D2A8'], rose: ['#C9A39A', '#D9B3A8', '#BF8F86', '#E3C4BA'], cream: ['#EFE4D1', '#E4D6BE'], line: '#5A4B3C', grass: '#CDB487' };
  const PAL_NIGHT = { leaf: ['#1B261F', '#222E25', '#28352B', '#2F3A2E'], lit: ['#4A3A2A', '#55402C', '#3E3426'], rose: ['#35302D', '#3D3532', '#3A322E'], cream: ['#3C362E', '#433B31'], line: '#140F0C', grass: '#3A3226' };
  function foliage(r, x, y, R, n, P, sunX) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = r() * 6.283, d = Math.sqrt(r()) * R, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * .82;
      const sunny = sunX !== undefined && (px - x) * Math.sign(sunX - x) > R * .25;
      const kind = r(), rot = f1(r() * 180);
      if (kind < .4) {
        const rr = R * (.11 + r() * .09);
        s += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(rr)}" ry="${f1(rr * .82)}" transform="rotate(${rot} ${f1(px)} ${f1(py)})" fill="${pick(r, sunny ? P.lit : P.leaf)}"/>`;
      } else if (kind < .72) {
        const ry = R * (.18 + r() * .12);
        s += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(ry * .2)}" ry="${f1(ry)}" transform="rotate(${rot} ${f1(px)} ${f1(py)})" fill="${pick(r, sunny ? P.lit : P.leaf)}"/>`;
      } else if (kind < .9) {
        const rr = R * (.14 + r() * .08), col = r() < .7 ? pick(r, P.rose) : pick(r, P.cream);
        s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(rr)}" fill="${col}"/><path d="M${f1(px - rr * .55)} ${f1(py + rr * .1)}a${f1(rr * .5)} ${f1(rr * .45)} 0 1 1 ${f1(rr * .6)} ${f1(rr * .35)}M${f1(px - rr * .2)} ${f1(py - rr * .05)}a${f1(rr * .22)} ${f1(rr * .2)} 0 1 1 ${f1(rr * .25)} ${f1(rr * .2)}" fill="none" stroke="${P.line}" stroke-opacity=".28" stroke-width="${f1(Math.max(.6, rr * .09))}"/>`;
      } else {
        const L = R * (.5 + r() * .5), an = a + (r() - .5) * .6;
        s += `<path d="M${f1(px)} ${f1(py)}q${f1(Math.cos(an) * L * .5)} ${f1(Math.sin(an) * L * .5 - L * .15)} ${f1(Math.cos(an) * L)} ${f1(Math.sin(an) * L)}" fill="none" stroke="${P.grass}" stroke-width="${f1(Math.max(.6, R * .025))}" stroke-linecap="round" opacity=".8"/>`;
      }
    }
    return s;
  }

  function sceneUmbral(id) {
    const r = rng(11), VX = 800, VY = 432;
    const hwAt = y => 26 + (600 - 26) * ((y - VY) / 468);
    let s = `<defs>
      <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ECD5A2"/><stop offset=".4" stop-color="#CDB988"/><stop offset=".49" stop-color="#A9A27A"/><stop offset="1" stop-color="#3A4232"/></linearGradient>
      <linearGradient id="${id}ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E8F6C"/><stop offset=".18" stop-color="#676C51"/><stop offset="1" stop-color="#3B4234"/></linearGradient>
      <linearGradient id="${id}haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3DDAE" stop-opacity="0"/><stop offset=".5" stop-color="#F3DDAE" stop-opacity=".55"/><stop offset="1" stop-color="#F3DDAE" stop-opacity="0"/></linearGradient>
      <radialGradient id="${id}sun"><stop offset="0" stop-color="#FFF3D4" stop-opacity=".95"/><stop offset=".35" stop-color="#F7D69A" stop-opacity=".5"/><stop offset="1" stop-color="#F7D69A" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}path" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6C6A2"/><stop offset=".45" stop-color="#A69A80"/><stop offset="1" stop-color="#6A6252"/></linearGradient>
      <filter id="${id}stone" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".8 .22" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .18 0 0 0 0 .16 0 0 0 0 .12 0 0 0 .55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      ${blurDef(id, 2)}${blurDef(id, 6)}${blurDef(id, 9)}${blurDef(id, 26)}
    </defs>`;
    s += `<rect width="1600" height="900" fill="url(#${id}sky)"/>`;
    s += `<circle cx="1150" cy="190" r="580" fill="url(#${id}sun)"/>`;
    s += `<g filter="url(#${id}b9)" opacity=".85">`;
    for (let i = 0; i < 24; i++) {
      s += `<ellipse cx="${f1(r() * 1700 - 50)}" cy="${f1(370 + r() * 80)}" rx="${f1(70 + r() * 130)}" ry="${f1(40 + r() * 60)}" fill="${pick(r, ['#5C6A4E', '#6E7A5A', '#4E5A43', '#7D8763'])}"/>`;
    }
    s += `</g><rect y="${VY}" width="1600" height="${900 - VY}" fill="url(#${id}ground)"/>`;
    s += `<rect y="${VY - 60}" width="1600" height="120" fill="url(#${id}haze)"/>`;
    const path = `200,900 1400,900 ${VX + 26},${VY} ${VX - 26},${VY}`;
    s += `<polygon points="${path}" fill="url(#${id}path)"/><polygon points="${path}" fill="#000" filter="url(#${id}stone)"/>`;
    s += `<g stroke="#3A342A" stroke-linecap="round" fill="none">`;
    let prevY = VY;
    for (let k = 1; k <= 16; k++) {
      const t = k / 16, y = VY + 468 * Math.pow(t, 1.7), hw = hwAt(y), hwp = hwAt(prevY);
      s += `<path d="M${f1(VX - hw)} ${f1(y)}L${f1(VX + hw)} ${f1(y)}" stroke-width="${(.4 + 2.2 * t).toFixed(2)}" opacity="${(.25 + .3 * t).toFixed(2)}"/>`;
      const n = 2 + Math.floor(t * 5);
      for (let j = 0; j < n; j++) {
        const u = (j + .5 + (r() - .5) * .6) / n;
        s += `<path d="M${f1(VX - hwp + 2 * hwp * u)} ${f1(prevY)}L${f1(VX - hw + 2 * hw * u)} ${f1(y)}" stroke-width="${(.3 + 1.6 * t).toFixed(2)}" opacity="${(.2 + .25 * t).toFixed(2)}"/>`;
      }
      prevY = y;
    }
    s += `</g><polygon points="${path}" fill="#F3D9A4" opacity=".16"/>`;
    for (let k = 0; k < 24; k++) {
      const t = Math.pow(k / 23, 1.6), y = VY + 10 + 460 * t, hw = hwAt(y), sc = .15 + 1.9 * t;
      const blur = t > .82 ? 6 : t > .5 ? 2 : 0;
      for (const side of [-1, 1]) {
        const cx = VX + side * (hw + 34 * sc + r() * 30 * sc);
        s += `<g${blur ? ` filter="url(#${id}b${blur})"` : ''}><ellipse cx="${f1(cx)}" cy="${f1(y - 8 * sc)}" rx="${f1(56 * sc)}" ry="${f1(22 * sc)}" fill="#4F5A40"/>${foliage(r, cx, y - 20 * sc, 56 * sc, 30, PAL_DAY, 1150)}</g>`;
      }
    }
    s += `<g filter="url(#${id}b26)" opacity=".3">`;
    for (let i = 0; i < 5; i++) { const x = 1150 - i * 170; s += `<polygon points="1150,190 ${x - 260},900 ${x - 170},900" fill="#FFE9BE"/>`; }
    return svgWrap(s + '</g>');
  }

  function sceneMesa(id) {
    const r = rng(23), VX = 800, VY = 468;
    let s = `<defs>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8B086"/><stop offset=".45" stop-color="#9C8E6A"/><stop offset=".56" stop-color="#7A735A"/><stop offset="1" stop-color="#3F3D30"/></linearGradient>
      <linearGradient id="${id}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A7F62"/><stop offset="1" stop-color="#4A4535"/></linearGradient>
      <radialGradient id="${id}glow"><stop offset="0" stop-color="#FFF1CF" stop-opacity=".7"/><stop offset=".4" stop-color="#F2D59C" stop-opacity=".3"/><stop offset="1" stop-color="#F2D59C" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}cloth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2E9D7"/><stop offset="1" stop-color="#C9BDA6"/></linearGradient>
      <linearGradient id="${id}glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".3" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity=".12"/><stop offset=".78" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient>
      ${blurDef(id, 1)}${blurDef(id, 4)}${blurDef(id, 14)}
    </defs>`;
    s += `<rect width="1600" height="900" fill="url(#${id}bg)"/><ellipse cx="${VX}" cy="${VY - 40}" rx="600" ry="340" fill="url(#${id}glow)"/>`;
    s += `<g stroke="#FBF3E2" fill="none" opacity=".16" filter="url(#${id}b1)">`;
    for (let x = -1400; x <= 3000; x += 220) s += `<path d="M${f1(VX + (x - VX) * .06)} ${VY - 150}L${x} -40" stroke-width="${f1(1.4 + Math.abs(x - VX) / 700)}"/>`;
    for (let k = 1; k <= 4; k++) {
      const t = k / 4, w = 110 + 1300 * Math.pow(t, 1.7), y = VY - 150 - (VY - 90) * Math.pow(t, 1.2);
      s += `<path d="M${f1(VX - w)} ${f1(y + 120 * t)}Q${VX} ${f1(y - 160 * t)} ${f1(VX + w)} ${f1(y + 120 * t)}" stroke-width="${f1(1.2 + 2.5 * t)}"/>`;
    }
    s += `</g><g filter="url(#${id}b14)">`;
    for (let i = 0; i < 42; i++) {
      const side = i % 2 ? 1 : -1, t = r();
      s += `<circle cx="${f1(VX + side * (130 + t * 900 + r() * 80))}" cy="${f1(VY - 140 + r() * (260 + t * 300))}" r="${f1(40 + t * 150)}" fill="${pick(r, ['#59654A', '#6E7A5A', '#4A563F', '#8A9A86', '#B79C8E'])}" opacity=".85"/>`;
    }
    s += `</g><rect y="${VY + 30}" width="1600" height="${900 - VY}" fill="url(#${id}floor)"/>`;
    s += `<polygon points="330,900 1270,900 ${VX + 30},${VY + 6} ${VX - 30},${VY + 6}" fill="#2B2A21" opacity=".5"/>`;
    s += `<polygon points="400,900 1200,900 ${VX + 22},${VY} ${VX - 22},${VY}" fill="url(#${id}cloth)"/>`;
    s += `<g fill="#FFF6DE" opacity=".22">`;
    for (let k = 0; k < 7; k++) {
      const t0 = Math.pow(k / 7 + .05, 1.6), t1 = Math.pow(k / 7 + .1, 1.6), y0 = VY + 432 * t0, y1 = VY + 432 * t1;
      const h0 = 22 + 378 * t0, h1 = 22 + 378 * t1;
      s += `<polygon points="${f1(VX - h0)},${f1(y0)} ${f1(VX + h0)},${f1(y0 - 6)} ${f1(VX + h1)},${f1(y1 - 6)} ${f1(VX - h1)},${f1(y1)}"/>`;
    }
    s += `</g>`;
    for (let k = 0; k < 22; k++) {
      const t = Math.pow((k + 1) / 22, 1.9), y = VY + 6 + 430 * t, hw = 22 + 378 * ((y - VY) / 432), sc = .06 + 1.4 * t;
      s += `<g${t > .7 ? ` filter="url(#${id}b4)"` : ''}>`;
      s += foliage(r, VX, y - 6 * sc, 30 * sc, 9, PAL_DAY);
      for (const side of [-1, 1]) {
        const px = VX + side * hw * .58, gx = VX + side * hw * .86;
        s += `<ellipse cx="${f1(px)}" cy="${f1(y)}" rx="${f1(46 * sc)}" ry="${f1(13 * sc)}" fill="#DCD3C3" stroke="#B9AE99" stroke-width="${(.8 * sc).toFixed(2)}"/>`;
        s += `<ellipse cx="${f1(px)}" cy="${f1(y - 2 * sc)}" rx="${f1(22 * sc)}" ry="${f1(6 * sc)}" fill="#F0E8DA"/>`;
        s += `<path d="M${f1(px - 20 * sc)} ${f1(y - 2 * sc)}L${f1(px + 20 * sc)} ${f1(y - sc)}" stroke="#A4865E" stroke-width="${(1.2 * sc).toFixed(2)}"/>`;
        s += `<rect x="${f1(gx - 8 * sc)}" y="${f1(y - 58 * sc)}" width="${f1(16 * sc)}" height="${f1(46 * sc)}" rx="${f1(6 * sc)}" fill="url(#${id}glass)" stroke="#fff" stroke-opacity=".35" stroke-width="${(.6 * sc).toFixed(2)}"/>`;
        if (k % 3 === 0) {
          const cx = VX + side * hw * .26;
          s += `<rect x="${f1(cx - 9 * sc)}" y="${f1(y - 70 * sc)}" width="${f1(18 * sc)}" height="${f1(64 * sc)}" rx="${f1(8 * sc)}" fill="#fff" opacity=".12" stroke="#fff" stroke-opacity=".35" stroke-width="${(.6 * sc).toFixed(2)}"/><rect x="${f1(cx - 5 * sc)}" y="${f1(y - 34 * sc)}" width="${f1(10 * sc)}" height="${f1(28 * sc)}" fill="#F3EBDD"/>`;
        }
      }
      s += '</g>';
    }
    return svgWrap(s);
  }

  /* El arco: un marco con follaje más denso arriba a la izquierda (asimétrico) */
  function archFoliage(r, P, sunX) {
    let s = '';
    const pts = [];
    for (let i = 0; i < 104; i++) {
      const th = Math.PI * (1 - Math.pow(r(), .8));
      pts.push([800 + 225 * Math.cos(th) + (r() - .5) * 26, 420 - 270 * Math.sin(th) + (r() - .5) * 26, 26 + r() * 22 + (th > 1.9 ? 14 : 0)]);
    }
    for (let i = 0; i < 26; i++) {
      const left = r() < .66, y = 430 + 270 * Math.pow(r(), left ? .5 : 1.4);
      pts.push([(left ? 575 : 1025) + (r() - .5) * 30, y, 20 + r() * 20]);
    }
    for (let i = 0; i < 5; i++) {
      const th = 1.8 + r() * 1.2, L = 120 + r() * 90;
      const x0 = 800 + 225 * Math.cos(th), y0 = 420 - 270 * Math.sin(th);
      for (let j = 1; j <= 6; j++) { const t = j / 6; pts.push([x0 + Math.cos(th) * L * t, y0 - Math.sin(th) * L * t * .5 + 30 * t * t, 18 * (1 - t * .6)]); }
    }
    pts.sort((a, b) => b[2] - a[2]).forEach(([x, y, R]) => { s += foliage(r, x, y, R, 13, P, sunX); });
    for (let i = 0; i < 9; i++) {
      const left = i < 6, x = (left ? 575 : 1025) + (r() - .5) * 120, y = 690 + r() * 30;
      s += foliage(r, x, y, 34 + r() * 18, 22, P, sunX);
    }
    return s;
  }

  function sceneAltar(id) {
    const r = rng(37), H = 560;
    let s = `<defs>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9BC86"/><stop offset=".5" stop-color="#B99C6C"/><stop offset=".62" stop-color="#9F8966"/><stop offset="1" stop-color="#6E6352"/></linearGradient>
      <radialGradient id="${id}sun"><stop offset="0" stop-color="#FFF6DD" stop-opacity=".85"/><stop offset=".3" stop-color="#FAD9A0" stop-opacity=".42"/><stop offset="1" stop-color="#FAD9A0" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2B294"/><stop offset="1" stop-color="#7B6F5B"/></linearGradient>
      <filter id="${id}stone" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".5 .12" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .2 0 0 0 0 .17 0 0 0 0 .13 0 0 0 .4 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      ${blurDef(id, 5)}${blurDef(id, 16)}
    </defs>`;
    s += `<rect width="1600" height="900" fill="url(#${id}bg)"/><g filter="url(#${id}b16)" opacity=".8">`;
    for (let i = 0; i < 26; i++) s += `<ellipse cx="${f1(r() * 1700 - 50)}" cy="${f1(470 + r() * 90)}" rx="${f1(80 + r() * 140)}" ry="${f1(50 + r() * 70)}" fill="${pick(r, ['#6E7A5A', '#7D8763', '#5C6A4E', '#93987A'])}"/>`;
    s += `</g><circle cx="540" cy="470" r="470" fill="url(#${id}sun)"/>`;
    s += `<rect y="${H}" width="1600" height="${900 - H}" fill="url(#${id}floor)"/><rect y="${H}" width="1600" height="${900 - H}" fill="#000" filter="url(#${id}stone)"/>`;
    s += `<g stroke="#4D4436" fill="none" stroke-linecap="round">`;
    let prev = H;
    for (let k = 1; k <= 11; k++) {
      const t = k / 11, y = H + (900 - H) * Math.pow(t, 1.55), sw = f1(.5 + 1.6 * t), op = (.18 + .25 * t).toFixed(2);
      s += `<path d="M0 ${f1(y)}H1600" stroke-width="${sw}" opacity="${op}"/>`;
      const w = 40 + 260 * t;
      for (let x = (k % 2) * w * .5 - r() * w * .3; x < 1600; x += w * (.7 + r() * .6)) s += `<path d="M${f1(x)} ${f1(prev)}V${f1(y)}" stroke-width="${sw}" opacity="${op}"/>`;
      prev = y;
    }
    s += `</g><g fill="#2E281E" opacity=".38" filter="url(#${id}b5)">`;
    for (const x of [575, 1025]) s += `<polygon points="${x - 12},702 ${x + 16},702 ${x + 1040},1010 ${x + 900},1040"/>`;
    s += `<path d="M590 704C760 760 1060 830 1700 860L1700 980C1150 940 820 850 590 716Z"/>`;
    for (let i = 0; i < 5; i++) for (const side of [-1, 1]) {
      const x = 800 + side * (360 + i * 150), y = 760 + i * 30, L = 520 + i * 90;
      s += `<polygon points="${f1(x)},${f1(y)} ${f1(x + 26)},${f1(y)} ${f1(x + 26 + L)},${f1(y + L * .3)} ${f1(x + L * .86)},${f1(y + L * .34)}"/>`;
    }
    s += `</g><path d="M575 702V420A225 270 0 0 1 1025 420V702" fill="none" stroke="#6B5E48" stroke-width="5"/>`;
    s += archFoliage(r, PAL_DAY, 540);
    return svgWrap(s);
  }

  function sceneVelada(id) {
    const r = rng(53), H = 560;
    let s = `<defs>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2C38"/><stop offset=".42" stop-color="#25343D"/><stop offset=".62" stop-color="#1E2528"/><stop offset="1" stop-color="#121615"/></linearGradient>
      <radialGradient id="${id}cg"><stop offset="0" stop-color="#FFE8B8" stop-opacity="1"/><stop offset=".22" stop-color="#FFBE78" stop-opacity=".5"/><stop offset="1" stop-color="#FF9A50" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}pool"><stop offset="0" stop-color="#D8975A" stop-opacity=".6"/><stop offset="1" stop-color="#C98A52" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}wax" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4DE"/><stop offset=".4" stop-color="#F0DCBC"/><stop offset="1" stop-color="#B89B76"/></linearGradient>
    </defs>`;
    s += `<rect width="1600" height="900" fill="url(#${id}bg)"/><g stroke="#A8BCC4" fill="none" opacity=".1">`;
    for (let x = 80; x < 1600; x += 110) s += `<path d="M${x} 0V${H}"/>`;
    for (let k = 1; k <= 5; k++) s += `<path d="M0 ${k * 100}Q800 ${k * 100 - 90} 1600 ${k * 100}"/>`;
    s += `</g><rect y="${H}" width="1600" height="${900 - H}" fill="#161B1A"/>`;
    s += `<ellipse cx="800" cy="740" rx="760" ry="170" fill="url(#${id}pool)" style="opacity:var(--ign,1)"/>`;
    s += `<ellipse cx="800" cy="420" rx="330" ry="360" fill="url(#${id}pool)" style="opacity:calc(var(--ign,1) * .5)"/>`;
    s += `<path d="M575 702V420A225 270 0 0 1 1025 420V702" fill="none" stroke="#2A2620" stroke-width="5"/>`;
    s += archFoliage(r, PAL_NIGHT);
    const cs = [];
    for (let i = 0; i < 46; i++) cs.push([500 + r() * 600, 690 + r() * 70]);
    for (let i = 0; i < 16; i++) { const t = i / 15; cs.push([700 - 420 * t + (r() - .5) * 24, 712 + 190 * t], [900 + 420 * t + (r() - .5) * 24, 712 + 190 * t]); }
    for (let i = 0; i < 26; i++) { const left = r() < .5; cs.push([left ? r() * 380 : 1220 + r() * 380, 790 + r() * 120]); }
    for (let i = 0; i < 30; i++) cs.push([180 + r() * 1240, 585 + r() * 40]);
    cs.sort((a, b) => a[1] - b[1]).forEach(([x, y]) => {
      const sc = .3 + (y - 560) / 340 * 1.5, h = (12 + r() * 26) * sc;
      const th = clamp(Math.hypot(x - 800, (y - 720) * 2) / 900 * .7 + r() * .15, 0, .84).toFixed(3);
      s += `<g style="--on:clamp(0,(var(--ign,1) - ${th}) * 8,1)">`;
      s += `<circle cx="${f1(x)}" cy="${f1(y - h - 6 * sc)}" r="${f1(78 * sc)}" fill="url(#${id}cg)" style="opacity:calc(var(--on) * .9)"/>`;
      s += `<rect x="${f1(x - 7 * sc)}" y="${f1(y - h)}" width="${f1(14 * sc)}" height="${f1(h)}" rx="${f1(2 * sc)}" fill="url(#${id}wax)" style="opacity:calc(.12 + .8 * var(--on))"/>`;
      s += `<rect x="${f1(x - 15 * sc)}" y="${f1(y - h - 34 * sc)}" width="${f1(30 * sc)}" height="${f1(h + 34 * sc)}" rx="${f1(7 * sc)}" fill="none" stroke="#F2E2C4" stroke-opacity=".16" stroke-width="${(.8 * sc).toFixed(2)}"/>`;
      s += `<ellipse cx="${f1(x)}" cy="${f1(y - h - 6 * sc)}" rx="${f1(2.6 * sc)}" ry="${f1(6.5 * sc)}" fill="#FFF0C8" style="opacity:var(--on)"/></g>`;
    });
    return svgWrap(s);
  }

  const SCENES = [sceneUmbral, sceneMesa, sceneAltar, sceneVelada];

  /* ---------------------------------------------------------
     3. Medidas y progreso del hero
     --------------------------------------------------------- */
  let heroTop = 0, heroRange = 1, heroBottom = 0, vh = innerHeight;
  function measure() {
    vh = innerHeight;
    heroTop = hero.getBoundingClientRect().top + scrollY;
    heroBottom = heroTop + hero.offsetHeight;
    heroRange = Math.max(1, hero.offsetHeight - vh);
    dawnH = dawn.offsetHeight;
    sizeMotes();
  }
  const heroProgress = () => clamp((scrollY - heroTop) / heroRange, 0, 1);

  /* ---------------------------------------------------------
     4. Bandas: opacidad con smoothstep, --k de montaje, solo escrituras con cambio
     --------------------------------------------------------- */
  const bands = $$('.band', hero).map(el => {
    const [a, b] = el.dataset.range.split(',').map(Number);
    return {
      el, a, b, ramp: el.dataset.ramp ? +el.dataset.ramp : Math.min(.025, (b - a) * .35),
      op: -1, k: -1, t: -1, on: null, interactive: el.hasAttribute('data-interactive'), useT: el.classList.contains('fx-glass')
    };
  });
  bands[0].first = true;
  bands[bands.length - 1].last = true;
  let loadK = 0, loadStart = 0;

  function updateBands(p) {
    for (const B of bands) {
      const f = Math.min(.02, (B.b - B.a) / 3);
      const op = (B.first ? 1 : smooth(p, B.a, B.a + f)) * (B.last ? 1 : 1 - smooth(p, B.b - f, B.b));
      let k = clamp((p - B.a) / B.ramp, 0, 1);
      if (B.first) k = Math.max(k, loadK);
      if (Math.abs(op - B.op) > .004 || ((op === 0 || op === 1) && op !== B.op)) { B.op = op; B.el.style.opacity = op.toFixed(3); }
      if (Math.abs(k - B.k) > .008 || ((k === 0 || k === 1) && k !== B.k)) { B.k = k; B.el.style.setProperty('--k', k.toFixed(3)); }
      if (B.useT && op > 0) {
        const t = clamp((p - B.a) / (B.b - B.a), 0, 1);
        if (Math.abs(t - B.t) > .004) { B.t = t; B.el.style.setProperty('--t', t.toFixed(3)); }
      }
      const on = op > .02;
      if (on !== B.on) { B.on = on; B.el.classList.toggle('is-on', on); if (B.interactive) B.el.inert = !on; }
    }
  }

  /* ---------------------------------------------------------
     5. Escena: capas por lámina, penumbra, velas, hojas, HUD
     --------------------------------------------------------- */
  const layers = [];          // { proc, still, stillOk, op, tr }
  const SC = { dusk: -1, ign: -1, lv: -1, ch: -1, hud: -1, moved: null, lit: null };
  let videoReady = false;

  function updateScene(p) {
    if (!videoReady) {
      const x = .03;
      layers.forEach((L, i) => {
        const w = (i === 0 ? 1 : smooth(p, STOPS[i] - x, STOPS[i] + x)) * (i === 3 ? 1 : 1 - smooth(p, STOPS[i + 1] - x, STOPS[i + 1] + x));
        const local = clamp((p - STOPS[i]) / (STOPS[i + 1] - STOPS[i]), -.2, 1.2);
        const sc = (i === 3 ? 1.02 + .04 * local : 1.03 + .11 * local).toFixed(4);
        const ty = i === 1 ? (local * -1.6).toFixed(2) : '0';
        if (Math.abs(w - L.op) > .003 || ((w === 0 || w === 1) && w !== L.op)) {
          L.op = w;
          const v = w.toFixed(3);
          if (L.still) L.still.style.opacity = L.stillOk ? v : '0';
          L.proc.style.opacity = L.stillOk ? '0' : v;
        }
        if (w > 0) {
          const tr = `translate3d(0,${ty}%,0) scale(${sc})`;
          if (tr !== L.tr) { L.tr = tr; (L.stillOk ? L.still : L.proc).style.transform = tr; }
        }
      });
    }
    const dusk = smooth(p, .76, .90);
    if (Math.abs(dusk - SC.dusk) > .004 || ((dusk === 0 || dusk === 1) && dusk !== SC.dusk)) {
      SC.dusk = dusk;
      duskEls.forEach(el => el.style.setProperty('--dusk', dusk.toFixed(3)));
      motes.dusk = dusk;
    }
    const ign = clamp((p - .79) / .15, 0, 1);
    if (Math.abs(ign - SC.ign) > .01 || ((ign === 0 || ign === 1) && ign !== SC.ign)) {
      SC.ign = ign;
      candlesEl.style.setProperty('--ign', ign.toFixed(3));
      if (layers[3]) layers[3].proc.style.setProperty('--ign', ign.toFixed(2));
    }
    const lit = ign > .02;
    if (lit !== SC.lit) { SC.lit = lit; stage.classList.toggle('lit', lit); }
    const lv = 1 - smooth(p, .17, .27);
    if (Math.abs(lv - SC.lv) > .005 || ((lv === 0 || lv === 1) && lv !== SC.lv)) { SC.lv = lv; leavesEl.style.setProperty('--lv', lv.toFixed(3)); }
    let ch = 0;
    while (ch < 3 && p >= STOPS[ch + 1]) ch++;
    if (ch !== SC.ch) { SC.ch = ch; hudItems.forEach((li, i) => li.classList.toggle('on', i === ch)); }
    if (Math.abs(p - SC.hud) > .002 || ((p === 0 || p === 1) && p !== SC.hud)) { SC.hud = p; hudFill.style.transform = `scaleY(${p.toFixed(4)})`; }
    const moved = p > .012;
    if (moved !== SC.moved) { SC.moved = moved; stage.classList.toggle('moved', moved); }
  }

  /* ---------------------------------------------------------
     6. Vídeo: Blob en streaming con anillo, seeks con compuerta
     --------------------------------------------------------- */
  let seekBusy = false, pendingTime = null;
  function requestSeek(t) {
    if (!video.duration) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', () => {
    seekBusy = false;
    if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', () => { seekBusy = false; pendingTime = null; if (CFG.video) failVideo(); });

  function progressToTime(p) {
    const T = CFG.chapterTimes;
    let i = 0;
    while (i < 3 && p > STOPS[i + 1]) i++;
    const local = clamp((p - STOPS[i]) / (STOPS[i + 1] - STOPS[i]), 0, 1);
    return clamp((T[i] + local * (T[i + 1] - T[i])) * video.duration, 0, video.duration - .05);
  }

  let blobStarted = false;
  function startBlobFetch() {
    if (blobStarted) return;
    blobStarted = true;
    loadHeroBlob().catch(failVideo);
  }
  async function loadHeroBlob() {
    const ctrl = new AbortController();
    let watchdog = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(CFG.video, { priority: 'low', signal: ctrl.signal });
    if (!res.ok || !res.body) throw new Error('video ' + res.status);
    const total = Number(res.headers.get('Content-Length')) || CFG.videoBytes || 15000000;
    const reader = res.body.getReader();
    const chunks = [];
    let got = 0, lastRing = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      clearTimeout(watchdog);
      watchdog = setTimeout(() => ctrl.abort(), 20000);
      chunks.push(value);
      got += value.length;
      const frac = Math.min(1, got / total), now = performance.now();
      if (now - lastRing > 100 || frac === 1) { lastRing = now; ring.style.setProperty('--ld', Math.round(126 * (1 - frac))); }
    }
    clearTimeout(watchdog);
    ring.style.setProperty('--ld', 0);
    video.src = URL.createObjectURL(new Blob(chunks, { type: res.headers.get('Content-Type') || 'video/mp4' }));
    video.load();
    video.addEventListener('canplay', () => {
      videoReady = true;
      stage.classList.remove('loading');
      stage.classList.add('video-ready', 'media');
      requestSeek(progressToTime(scrubOn ? heroProgress() : 0));
    }, { once: true });
  }
  function failVideo() {
    stage.classList.remove('loading');
    stage.classList.add('video-failed');
    videoReady = false;
    video.removeAttribute('src');
    video.style.display = 'none';
  }

  /* ---------------------------------------------------------
     7. Hojas de primer plano: muelle que responde al scroll
     --------------------------------------------------------- */
  const branches = [];
  let gust = 0;
  function buildBranch(r, type, size) {
    const leaves = [], L = 200;
    let d = '';
    const stems = [[0, 0, .78 + r() * .2, L * (.95 + r() * .2)]];
    for (let i = 0; i < 2; i++) stems.push([null, null, .5 + r() * .7, L * (.45 + r() * .25), .3 + r() * .4]);
    let main = null;
    stems.forEach((st, si) => {
      let x0, y0;
      const ang = st[2];
      if (si === 0) { x0 = 0; y0 = 0; } else { const t = st[4]; x0 = main.x0 + (main.x1 - main.x0) * t; y0 = main.y0 + (main.y1 - main.y0) * t; }
      const x1 = x0 + Math.cos(ang) * st[3], y1 = y0 + Math.sin(ang) * st[3];
      const cx = (x0 + x1) / 2 + (r() - .5) * 40, cy = (y0 + y1) / 2 + (r() - .5) * 40;
      if (si === 0) main = { x0, y0, x1, y1 };
      d += `M${f1(x0)} ${f1(y0)}Q${f1(cx)} ${f1(cy)} ${f1(x1)} ${f1(y1)}`;
      const n = type === 'euca' ? 9 : 13;
      for (let i = 1; i <= n; i++) {
        const t = i / (n + 1), mt = 1 - t;
        const px = mt * mt * x0 + 2 * mt * t * cx + t * t * x1, py = mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
        const tx = 2 * mt * (cx - x0) + 2 * t * (x1 - cx), ty = 2 * mt * (cy - y0) + 2 * t * (y1 - cy);
        const a = Math.atan2(ty, tx) * 180 / Math.PI, side = i % 2 ? 1 : -1;
        const col = pick(r, ['#1B251C', '#212C22', '#283327', '#2F3A2C']);
        if (type === 'euca') {
          const rr = (9 + r() * 7) * (1 - t * .35);
          const ox = Math.cos((a + 90 * side) * Math.PI / 180) * rr * .9, oy = Math.sin((a + 90 * side) * Math.PI / 180) * rr * .9;
          leaves.push(`<ellipse cx="${f1(px + ox)}" cy="${f1(py + oy)}" rx="${f1(rr)}" ry="${f1(rr * .86)}" fill="${col}"/>`);
        } else {
          const ry = 15 + r() * 8, rot = a + side * (45 + r() * 20);
          const ox = Math.cos(rot * Math.PI / 180) * ry * .9, oy = Math.sin(rot * Math.PI / 180) * ry * .9;
          leaves.push(`<ellipse cx="${f1(px + ox)}" cy="${f1(py + oy)}" rx="${f1(3.6 + r() * 1.6)}" ry="${f1(ry)}" transform="rotate(${f1(rot - 90)} ${f1(px + ox)} ${f1(py + oy)})" fill="${col}"/>`);
        }
      }
    });
    return `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true"><g transform="scale(${(size / 230).toFixed(3)})"><path d="${d}" fill="none" stroke="#1E281F" stroke-width="2.2" stroke-linecap="round"/>${leaves.join('')}</g></svg>`;
  }
  function buildLeaves() {
    const r = rng(77);
    const defs = [
      { x: 0, y: 0, fx: 1, fy: 1, size: 52, type: 'euca', blur: 3, w: 1, ph: .2, out: [-1, -1] },
      { x: 100, y: 0, fx: -1, fy: 1, size: 56, type: 'olive', blur: 1.6, w: -.8, ph: 1.4, out: [1, -1] },
      { x: 0, y: 100, fx: 1, fy: -1, size: 44, type: 'olive', blur: 7, w: -1.2, ph: 2.1, out: [-1, 1] },
      { x: 100, y: 100, fx: -1, fy: -1, size: 48, type: 'euca', blur: 8, w: 1.1, ph: 3.3, out: [1, 1] },
      { x: 0, y: 46, fx: 1, fy: 1, size: 30, type: 'olive', blur: .8, w: .7, ph: 4.2, out: [-1, 0] }
    ];
    defs.forEach(D => {
      const el = document.createElement('div');
      el.className = 'br';
      const sz = `${D.size}vmin`;
      el.style.width = el.style.height = sz;
      el.style.left = D.fx > 0 ? `calc(${D.x}% - 2vmin)` : `calc(${D.x}% - ${D.size}vmin + 2vmin)`;
      el.style.top = D.fy > 0 ? `calc(${D.y}% - 2vmin)` : `calc(${D.y}% - ${D.size}vmin + 2vmin)`;
      el.style.transformOrigin = `${D.fx > 0 ? 'left' : 'right'} ${D.fy > 0 ? 'top' : 'bottom'}`;
      el.innerHTML = buildBranch(r, D.type, 200);
      const svg = el.firstChild;
      svg.style.transform = `scale(${D.fx},${D.fy})`;
      svg.style.filter = `blur(${D.blur}px)`;
      leavesEl.appendChild(el);
      branches.push({ el, D, ang: 0, vel: 0, tr: '' });
    });
  }
  function stepLeaves(dt, p) {
    if (p > .28) return false;
    const n = dt / 16.667;
    gust *= Math.pow(.9, n);
    if (Math.abs(gust) < .01) gust = 0;
    const out = smooth(p, 0, .27), vmin = Math.min(innerWidth, vh) / 100;
    let moving = gust !== 0;
    for (const B of branches) {
      const target = Math.sin(p * Math.PI * 7 + B.D.ph) * 2.2 + gust * B.D.w;
      B.vel += (target - B.ang) * .08 * n;
      B.vel *= Math.pow(.84, n);
      B.ang += B.vel * n;
      if (Math.abs(B.vel) > .003 || Math.abs(target - B.ang) > .02) moving = true;
      const dx = B.D.out[0] * out * B.D.size * .45 * vmin, dy = B.D.out[1] * out * B.D.size * .3 * vmin;
      const tr = `translate3d(${f1(dx)}px,${f1(dy)}px,0) rotate(${B.ang.toFixed(2)}deg) scale(${(1 + out * .5).toFixed(3)})`;
      if (tr !== B.tr) { B.tr = tr; B.el.style.transform = tr; }
    }
    return moving;
  }

  /* ---------------------------------------------------------
     8. Polen al sol que se vuelve brasa en la velada (canvas)
     --------------------------------------------------------- */
  const motes = { cv: $('#motes'), ctx: null, list: [], w: 0, h: 0, dpr: 1, raf: null, last: 0, dusk: 0 };
  function sizeMotes() {
    if (!motes.ctx) return;
    motes.dpr = Math.min(1.5, devicePixelRatio || 1);
    motes.w = innerWidth; motes.h = vh;
    motes.cv.width = Math.round(motes.w * motes.dpr);
    motes.cv.height = Math.round(motes.h * motes.dpr);
    motes.ctx.setTransform(motes.dpr, 0, 0, motes.dpr, 0, 0);
  }
  function initMotes() {
    motes.ctx = motes.cv.getContext('2d');
    const r = rng(91);
    for (let i = 0; i < 64; i++) motes.list.push({ x: r(), y: r(), z: .3 + r() * .7, r: .6 + r() * 1.9, ph: r() * 6.28, tw: .4 + r() * 1.2 });
    sizeMotes();
  }
  function motesFrame(now) {
    const { ctx, w, h } = motes;
    const dt = Math.min(64, now - (motes.last || now));
    motes.last = now;
    const d = motes.dusk;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    const cr = 255, cg = Math.round(232 - 64 * d), cb = Math.round(190 - 100 * d);
    for (const m of motes.list) {
      const sway = Math.sin(m.ph + now * .0006 * m.tw);
      const vx = (.000010 + sway * .000012) * m.z * (1 - d) + sway * .000008 * d;
      const vy = (.000007 * (1 - d) - .000032 * d) * m.z;
      m.x += vx * dt; m.y += vy * dt;
      if (m.x > 1.03) m.x = -.03; else if (m.x < -.03) m.x = 1.03;
      if (m.y > 1.03) m.y = -.03; else if (m.y < -.03) m.y = 1.03;
      const a = (.18 + .32 * (.5 + .5 * Math.sin(now * .002 * m.tw + m.ph))) * m.z * (d > .5 ? 1.3 : 1);
      const px = m.x * w, py = m.y * h, rad = m.r * (1 + d * .4);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${(a * .25).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(px, py, rad * 3.2, 0, 6.283); ctx.fill();
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(px, py, rad, 0, 6.283); ctx.fill();
    }
    motes.raf = requestAnimationFrame(motesFrame);
  }
  function motesStart() {
    if (!motes.ctx || motes.raf !== null || !scrubOn || !heroOnScreen || document.hidden || reduced()) return;
    motes.last = 0;
    motes.raf = requestAnimationFrame(motesFrame);
  }
  function motesStop() { if (motes.raf !== null) { cancelAnimationFrame(motes.raf); motes.raf = null; } }

  /* ---------------------------------------------------------
     9. Velas: bokeh de primer plano sobre cualquier fondo
     --------------------------------------------------------- */
  function buildCandles() {
    const r = rng(61);
    let html = '';
    for (let i = 0; i < 26; i++) {
      const left = r() < .5, x = left ? r() * 30 : 70 + r() * 30;
      html += `<i class="cd b" style="--x:${f1(x)}%;--y:${f1(60 + r() * 46)}%;--s:${Math.round(70 + r() * 150)}px;--th:${(.1 + r() * .7).toFixed(2)};--fd:${(-r() * 3).toFixed(2)}s"></i>`;
    }
    for (let i = 0; i < 18; i++) {
      html += `<i class="cd" style="--x:${f1(6 + r() * 88)}%;--y:${f1(78 + r() * 22)}%;--s:${Math.round(18 + r() * 34)}px;--th:${(.05 + r() * .75).toFixed(2)};--fd:${(-r() * 3).toFixed(2)}s"></i>`;
    }
    candlesEl.innerHTML = html;
  }

  /* ---------------------------------------------------------
     10. Bucle principal: lerp normalizado por dt, descansa al converger
     --------------------------------------------------------- */
  let scrubOn = false, heroOnScreen = true, heroBuilt = false;
  let target = 0, shown = 0, rafId = null, lastTick = 0, lastY = scrollY, lastYT = 0;

  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    shown += (target - shown) * (1 - Math.pow(1 - .14, dt / 16.667));
    let moving = Math.abs(target - shown) > .0004;
    if (!moving) shown = target;
    if (loadK < 1) {
      if (!loadStart) loadStart = now + 250;
      const t = clamp((now - loadStart) / 1500, 0, 1);
      loadK = 1 - Math.pow(1 - t, 3);
      moving = true;
    }
    const leavesMoving = stepLeaves(dt, shown);
    if (videoReady) requestSeek(progressToTime(shown));
    updateBands(shown);
    updateScene(shown);
    if (moving || leavesMoving) rafId = requestAnimationFrame(tick);
    else { rafId = null; lastTick = 0; }
  }
  const kick = () => { if (rafId === null && scrubOn) rafId = requestAnimationFrame(tick); };

  function onScroll() {
    target = heroProgress();
    const now = performance.now(), y = scrollY;
    if (lastYT && now - lastYT < 200) gust = clamp(gust + (y - lastY) / Math.max(8, now - lastYT) * 1.4, -9, 9);
    lastY = y; lastYT = now;
    if (heroOnScreen) kick();
  }

  function initHeroOnce() {
    if (heroBuilt) return;
    heroBuilt = true;
    SCENES.forEach((fn, i) => {
      const proc = document.createElement('div');
      proc.className = 'ps';
      proc.innerHTML = fn('s' + i);
      procEl.appendChild(proc);
      layers.push({ proc, still: null, stillOk: false, op: -1, tr: '' });
    });
    buildLeaves();
    buildCandles();
    initMotes();
    const stills = CFG.stills || [];
    let pending = 0;
    const firstDone = () => { if (CFG.video) startBlobFetch(); };
    stills.forEach((src, i) => {
      if (!src || !layers[i]) return;
      const d = document.createElement('div');
      d.className = 'still';
      stillsEl.appendChild(d);
      layers[i].still = d;
      const img = new Image();
      if (i === 0) pending++;
      img.onload = () => {
        d.style.backgroundImage = `url("${src}")`;
        layers[i].stillOk = true;
        layers[i].op = -1;
        layers[i].tr = '';
        stage.classList.add('media');
        if (scrubOn) updateScene(shown);
        if (i === 0) firstDone();
      };
      img.onerror = () => { if (i === 0) firstDone(); };
      img.src = src;
    });
    if (CFG.video) {
      stage.classList.add('loading');
      if (!pending) startBlobFetch();
      setTimeout(startBlobFetch, 4000);
    }
  }

  /* ---------------------------------------------------------
     11. Modo estático: láminas apiladas con su imagen o su escena
     --------------------------------------------------------- */
  let staticBuilt = false;
  function buildStaticOnce() {
    if (staticBuilt) return;
    staticBuilt = true;
    const portrait = matchMedia('(orientation: portrait)').matches;
    $$('.chapter').forEach((ch, i) => {
      const bg = $('.chapter-bg', ch);
      const src = (portrait && CFG.stillsPortrait && CFG.stillsPortrait[i]) || (CFG.stills && CFG.stills[i]);
      bg.innerHTML = SCENES[i]('st' + i);
      if (src) {
        const img = new Image();
        img.alt = '';
        img.decoding = 'async';
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.onload = () => { bg.querySelector('svg')?.remove(); };
        img.onerror = () => img.remove();
        img.src = src;
        bg.appendChild(img);
      }
    });
  }

  /* ---------------------------------------------------------
     12. Las cinco puertas, vivas en las dos direcciones
     --------------------------------------------------------- */
  const MQLS = GATES.map(q => matchMedia(q));
  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    initHeroOnce();
    addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(B => { B.op = -1; B.k = -1; B.t = -1; B.on = null; });
    Object.keys(SC).forEach(k => { SC[k] = typeof SC[k] === 'number' ? -1 : null; });
    layers.forEach(L => { L.op = -1; L.tr = ''; });
    measure();
    target = shown = heroProgress();
    if (shown > .05) loadK = 1;
    updateBands(shown);
    updateScene(shown);
    if (videoReady) requestSeek(progressToTime(shown));
    onScroll();
    kick();
    motesStart();
  }
  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastTick = 0; }
    motesStop();
    bands.forEach(B => {
      B.el.style.removeProperty('opacity');
      B.el.style.removeProperty('--k');
      B.el.style.removeProperty('--t');
      B.el.classList.remove('is-on');
      B.el.inert = false;
    });
  }
  function applyMode() {
    const isStatic = MQLS.some(m => m.matches);
    root.classList.toggle('static', isStatic);
    root.classList.toggle('scrub', !isStatic);
    if (isStatic) { disableScrub(); buildStaticOnce(); }
    else enableScrub();
    measure();
    pageTick();
    updateHoldMode();
  }
  MQLS.forEach(m => m.addEventListener('change', applyMode));

  /* ---------------------------------------------------------
     13. Cuaderno de campo: entradas, trazos, ruta, secciones vivas
     --------------------------------------------------------- */
  function initReveals() {
    $$('.draw').forEach(svg => $$('path,circle,ellipse', svg).forEach(el => el.setAttribute('pathLength', '1')));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('in');
        io.unobserve(el);
        const d = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
        setTimeout(() => el.classList.add('done'), 1300 + d * 130);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .12 });
    $$('.rv').forEach(el => io.observe(el));

    const liveIO = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('live', e.isIntersecting)));
    $$('.lugar, .regalo, .closing').forEach(el => liveIO.observe(el));

    new IntersectionObserver(entries => {
      heroOnScreen = entries[0].isIntersecting;
      if (heroOnScreen) { kick(); motesStart(); } else motesStop();
    }).observe(hero);
  }

  const nav = $('#nav'), lugar = $('#lugar'), route = $('#map-route'), dawn = $('.dawn');
  let dawnH = 0;
  let navSolid = null, rt = -1, pageQueued = false;
  function pageTick() {
    pageQueued = false;
    const solid = scrollY > heroBottom + dawnH * .55 - 80;
    if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('solid', solid); }
    if (!reduced()) {
      const rect = lugar.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const v = 1 - clamp((vh * .9 - rect.top) / (rect.height * .75), 0, 1);
        if (Math.abs(v - rt) > .004 || ((v === 0 || v === 1) && v !== rt)) { rt = v; route.style.setProperty('--rt', v.toFixed(3)); }
      }
    }
  }
  addEventListener('scroll', () => { if (!pageQueued) { pageQueued = true; requestAnimationFrame(pageTick); } }, { passive: true });

  let resizeQueued = false;
  addEventListener('resize', () => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => { resizeQueued = false; measure(); if (scrubOn) { onScroll(); } pageTick(); });
  });

  /* Imágenes de detalle, solo si existen en la configuración */
  function initDetails() {
    $$('[data-detail]').forEach(frame => {
      const src = CFG.details && CFG.details[+frame.dataset.detail];
      if (!src) return;
      const img = new Image();
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onload = () => img.classList.add('ok');
      img.onerror = () => img.remove();
      img.src = src;
      frame.appendChild(img);
    });
    const cl = $('.closing-bg');
    const src = CFG.stills && CFG.stills[3];
    cl.innerHTML = sceneVelada('cl');
    if (src) {
      const img = new Image();
      img.alt = '';
      img.loading = 'lazy';
      img.onload = () => cl.querySelector('svg')?.remove();
      img.onerror = () => img.remove();
      img.src = src;
      cl.appendChild(img);
    }
    const r = rng(19);
    let glows = '';
    for (let i = 0; i < 14; i++) glows += `<i class="glow" style="--x:${f1(r() * 100)}%;--y:${f1(55 + r() * 45)}%;--s:${Math.round(80 + r() * 200)}px;--fd:${(-r() * 3).toFixed(2)}s"></i>`;
    $('#confirmar').insertAdjacentHTML('afterbegin', glows);
  }

  /* Cuenta atrás */
  function initCountdown() {
    if (!CFG.weddingDate) return;
    const n = $('#count-n'), t = $('.count-t');
    const days = Math.ceil((new Date(CFG.weddingDate) - Date.now()) / 86400000);
    if (days > 1) { n.textContent = days; t.textContent = 'días para encender las velas'; }
    else if (days === 1) { n.textContent = '1'; t.textContent = 'día para encender las velas'; }
    else if (days === 0) { n.textContent = 'Hoy'; t.textContent = 'encendemos las velas'; }
    else { n.textContent = 'Gracias'; t.textContent = 'las velas siguen encendidas'; }
  }

  /* Copiar IBAN */
  function initIban() {
    const btn = $('#copy-iban'), status = $('#copy-status'), code = $('#iban');
    let timer;
    btn.addEventListener('click', async () => {
      const text = code.textContent.replace(/\s+/g, '');
      try { await navigator.clipboard.writeText(text); }
      catch (e) {
        const sel = getSelection(), range = document.createRange();
        range.selectNodeContents(code); sel.removeAllRanges(); sel.addRange(range);
        status.textContent = 'Selecciónalo y cópialo con tu teclado.';
        return;
      }
      btn.firstElementChild.textContent = 'Copiado';
      status.textContent = 'Número de cuenta copiado.';
      clearTimeout(timer);
      timer = setTimeout(() => { btn.firstElementChild.textContent = 'Copiar'; status.textContent = ''; }, 2600);
    });
  }

  /* Anclas: dentro del hero se traducen a progreso de scroll */
  function scrollToTarget(id, smoothScroll) {
    const el = id ? document.getElementById(id) : null;
    if (!el) return false;
    let y;
    const band = el.closest('.band');
    if (scrubOn && hero.contains(el) && el !== hero) {
      const B = band && bands.find(b => b.el === band);
      const p = !B ? 0 : B.last ? 1 : B.a + (B.b - B.a) * .55;
      y = heroTop + p * heroRange;
    } else if (el === hero || el.id === 'main') {
      y = 0;
    } else {
      y = el.getBoundingClientRect().top + scrollY - (band ? 76 : 0);
    }
    scrollTo({ top: y, behavior: smoothScroll && !reduced() ? 'smooth' : 'auto' });
    return true;
  }
  function afterScroll(fn) {
    let done = false;
    const run = () => { if (done) return; done = true; removeEventListener('scrollend', run); fn(); };
    addEventListener('scrollend', run, { once: true });
    setTimeout(run, 1400);
  }
  function initAnchors() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!scrollToTarget(id, true)) return;
      e.preventDefault();
      history.replaceState(null, '', '#' + id);
      if (id === 'rsvp') afterScroll(() => { if (scrubOn) { shown = target = heroProgress(); updateBands(shown); updateScene(shown); } if (!form.classList.contains('done')) $('input[name="nombre"]', form).focus({ preventScroll: true }); });
      if (id === 'main') afterScroll(() => $('#main').focus({ preventScroll: true }));
    });
    if (location.hash.length > 1) requestAnimationFrame(() => scrollToTarget(location.hash.slice(1), false));
  }

  /* ---------------------------------------------------------
     14. El momento: mantener pulsado para encender tu vela
     --------------------------------------------------------- */
  const form = $('#rsvp-form'), hold = $('#hold'), holdLabel = $('.hold-label', hold), hint = $('#hold-hint');
  const nameInput = $('input[name="nombre"]', form), errName = $('#err-nombre');
  const HOLD_MS = 1600;
  let hp = 0, holding = false, holdRaf = null, lastH = 0, sending = false;

  function updateHoldMode() {
    const no = form.asistencia.value === 'no';
    form.acompanantes.disabled = no;
    if (reduced()) {
      holdLabel.textContent = no ? 'Enviar respuesta' : 'Confirmar asistencia';
      hint.hidden = true;
    } else {
      holdLabel.textContent = no ? 'Mantén pulsado para enviar tu respuesta' : 'Mantén pulsado para encender tu vela';
      hint.hidden = false;
    }
  }
  function setHP(v) { hp = v; hold.style.setProperty('--hp', v.toFixed(3)); }
  function validate() {
    if (nameInput.value.trim()) { nameInput.removeAttribute('aria-invalid'); errName.textContent = ''; return true; }
    nameInput.setAttribute('aria-invalid', 'true');
    errName.textContent = 'Escribe tu nombre para que sepamos quién eres.';
    nameInput.focus();
    return false;
  }
  function holdTick(now) {
    const dt = Math.min(64, now - (lastH || now));
    lastH = now;
    if (holding) setHP(Math.min(1, hp + dt / HOLD_MS));
    else setHP(Math.max(0, hp - dt / (HOLD_MS * .5) * (.35 + hp)));
    if (holding && hp >= 1) { holding = false; hold.classList.remove('holding'); holdRaf = null; lastH = 0; complete(); return; }
    if (holding || hp > 0) holdRaf = requestAnimationFrame(holdTick);
    else { holdRaf = null; lastH = 0; }
  }
  function startHold() {
    if (sending || form.classList.contains('done')) return;
    if (!validate()) return;
    holding = true;
    hold.classList.add('holding');
    if (holdRaf === null) holdRaf = requestAnimationFrame(holdTick);
  }
  function endHold() {
    if (!holding) return;
    holding = false;
    hold.classList.remove('holding');
    if (holdRaf === null && hp > 0) holdRaf = requestAnimationFrame(holdTick);
  }
  async function send(data) {
    if (CFG.rsvpEndpoint) {
      const res = await fetch(CFG.rsvpEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('rsvp ' + res.status);
      return;
    }
    if (CFG.rsvpEmail) {
      const lines = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join('\n');
      location.href = `mailto:${CFG.rsvpEmail}?subject=${encodeURIComponent('Confirmación: ' + data.get('nombre'))}&body=${encodeURIComponent(lines)}`;
      return;
    }
    await new Promise(res => setTimeout(res, 350));   // modo demo: no se envía a ningún sitio
  }
  async function complete() {
    if (sending) return;
    if (!validate()) { setHP(0); return; }
    sending = true;
    setHP(1);
    const data = new FormData(form);
    try {
      await send(data);
    } catch (e) {
      sending = false;
      setHP(0);
      errName.textContent = 'No hemos podido enviar tu respuesta. Inténtalo de nuevo en un momento.';
      return;
    }
    const first = (data.get('nombre') || '').toString().trim().split(/\s+/)[0];
    const yes = data.get('asistencia') !== 'no';
    $('#done-t').textContent = yes ? 'Tu vela ya está encendida.' : 'Gracias por avisarnos.';
    $('#done-p').textContent = yes
      ? `Gracias, ${first}. Nos vemos el 19 de junio al final del sendero.`
      : `Te echaremos de menos, ${first}. Guardaremos una vela encendida por ti.`;
    form.classList.add('done');
    $('#rsvp-done').focus({ preventScroll: true });
    if (!reduced()) {
      candlesEl.classList.remove('flare');
      void candlesEl.offsetWidth;
      candlesEl.classList.add('flare');
    }
    sending = false;
  }
  function initHold() {
    updateHoldMode();
    form.addEventListener('change', e => { if (e.target.name === 'asistencia') updateHoldMode(); });
    nameInput.addEventListener('input', () => { if (nameInput.value.trim()) { nameInput.removeAttribute('aria-invalid'); errName.textContent = ''; } });
    form.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.target === hold || e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      const fields = $$('input:not([type="radio"]),select,input[type="radio"]:checked,button', form).filter(el => !el.disabled && el.offsetParent);
      const i = fields.indexOf(e.target);
      (fields[i + 1] || hold).focus();
    });
    form.addEventListener('submit', e => e.preventDefault());
    hold.addEventListener('pointerdown', e => {
      if (e.button !== 0 || reduced()) return;
      e.preventDefault();
      try { hold.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
      startHold();
    });
    hold.addEventListener('pointerup', endHold);
    hold.addEventListener('pointercancel', endHold);
    hold.addEventListener('lostpointercapture', endHold);
    hold.addEventListener('contextmenu', e => e.preventDefault());
    hold.addEventListener('click', e => {
      if (e.detail === 0 || reduced()) { complete(); return; }   // teclado, lector de pantalla o movimiento reducido
      if (hp < 1 && !sending) { hint.classList.remove('nudge'); void hint.offsetWidth; hint.classList.add('nudge'); }
    });
  }

  /* ---------------------------------------------------------
     15. Arranque
     --------------------------------------------------------- */
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('paused', document.hidden);
    if (document.hidden) motesStop(); else motesStart();
  });
  reduceMQ.addEventListener('change', () => { updateHoldMode(); if (reduced()) motesStop(); });

  splitText();
  initReveals();
  initDetails();
  initCountdown();
  initIban();
  initHold();
  applyMode();
  initAnchors();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); if (scrubOn) onScroll(); });
  addEventListener('load', () => { measure(); if (scrubOn) onScroll(); });
})();
