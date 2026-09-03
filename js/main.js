/* =========================================================
   GYxC — shared behavior (home page)
   Requires: gsap, ScrollTrigger, three.js loaded before this file
   ========================================================= */

gsap.registerPlugin(ScrollTrigger);

/* ---------- nav toggle (mobile) ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

/* ---------- reveal-on-scroll ---------- */
document.querySelectorAll('.goal-cell, .impact-row, .team-card, .route-row, .social-pill').forEach(el => el.classList.add('reveal'));
ScrollTrigger.batch('.reveal', {
  start: 'top 88%',
  onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.06 })
});

/* ---------- volunteer counter (1 -> 500+, quick countdown-style ramp) ---------- */
const counterEl = document.getElementById('volCounter');
if (counterEl) {
  ScrollTrigger.create({
    trigger: '#impact',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      let obj = { val: 1 };
      gsap.to(obj, {
        val: 500,
        duration: 1.8,
        ease: 'power1.out',
        onUpdate: () => counterEl.textContent = Math.floor(obj.val) + (obj.val >= 500 ? '+' : '')
      });
    }
  });
}

/* ---------- orbit network diagram (Impact section) ---------- */
(function () {
  const svg = document.getElementById('orbitSvg');
  if (!svg) return;
  const countries = ['Pakistan', 'India', 'Dubai', 'Canada', 'Uzbekistan', 'Saudi Arabia'];
  const cx = 200, cy = 200, r = 150;

  countries.forEach((name, i) => {
    const angle = (i / countries.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', x); line.setAttribute('y2', y);
    line.setAttribute('class', 'orbit-line');
    line.style.strokeDasharray = '260';
    line.style.strokeDashoffset = '260';
    svg.appendChild(line);

    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', x); ring.setAttribute('cy', y); ring.setAttribute('r', 12);
    ring.setAttribute('class', 'orbit-node-ring');
    svg.appendChild(ring);

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', 4);
    dot.setAttribute('class', 'orbit-node-dot');
    svg.appendChild(dot);

    const labelOffset = 26;
    const lx = cx + (r + labelOffset) * Math.cos(angle);
    const ly = cy + (r + labelOffset) * Math.sin(angle);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', lx); label.setAttribute('y', ly);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'orbit-label');
    label.textContent = name;
    svg.appendChild(label);

    gsap.to(ring, {
      attr: { r: 20 }, opacity: 0, duration: 2, repeat: -1, ease: 'power1.out', delay: i * 0.35,
      scrollTrigger: { trigger: '#impact', start: 'top 70%' }
    });
  });

  ScrollTrigger.create({
    trigger: '#impact', start: 'top 65%', once: true,
    onEnter: () => gsap.to(svg.querySelectorAll('.orbit-line'), { strokeDashoffset: 0, duration: 1.4, stagger: 0.12, ease: 'power2.out' })
  });
})();

/* ---------- horizontal scroll: stories ---------- */
(function () {
  const track = document.getElementById('storiesTrack');
  if (!track) return;
  function getScrollAmount() {
    return -(track.scrollWidth - window.innerWidth + 80);
  }
  gsap.to(track, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: '#stories',
      start: 'top top',
      end: () => `+=${Math.abs(getScrollAmount())}`,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true
    }
  });
})();

/* ---------- Three.js DNA hero (rose / teal, per client palette) ---------- */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const heroSection = document.getElementById('home');
  let renderer, scene, camera, group;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, heroSection.clientWidth / heroSection.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 16);

    group = new THREE.Group();
    scene.add(group);

    const roseMat = new THREE.MeshBasicMaterial({ color: 0xda7b93 });
    const tealMat = new THREE.MeshBasicMaterial({ color: 0x4f8f8f });
    const rungMat = new THREE.LineBasicMaterial({ color: 0x2f4454, transparent: true, opacity: 0.65 });

    const turns = 6, pointsPerTurn = 10, radius = 3.4, height = 22;
    const total = turns * pointsPerTurn;
    const geomA = new THREE.SphereGeometry(0.11, 10, 10);
    const geomB = new THREE.SphereGeometry(0.09, 10, 10);

    for (let i = 0; i < total; i++) {
      const t = i / total;
      const angle = t * Math.PI * 2 * turns;
      const y = height * (t - 0.5);

      const xA = Math.cos(angle) * radius;
      const zA = Math.sin(angle) * radius;
      const xB = Math.cos(angle + Math.PI) * radius;
      const zB = Math.sin(angle + Math.PI) * radius;

      const meshA = new THREE.Mesh(geomA, roseMat);
      meshA.position.set(xA, y, zA);
      group.add(meshA);

      const meshB = new THREE.Mesh(geomB, tealMat);
      meshB.position.set(xB, y, zB);
      group.add(meshB);

      if (i % 2 === 0) {
        const rungGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(xA, y, zA), new THREE.Vector3(xB, y, zB)
        ]);
        group.add(new THREE.Line(rungGeom, rungMat));
      }
    }

    group.rotation.z = 0.35;
    group.position.x = 3.4;

    animate();
  }

  let clock = new THREE.Clock();
  function animate() {
    if (!prefersReduced) {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.18;
      group.position.y = Math.sin(t * 0.3) * 0.4;
      renderer.render(scene, camera);
    } else {
      renderer.render(scene, camera);
    }
  }

  function resize() {
    if (!renderer) return;
    const w = heroSection.clientWidth, h = heroSection.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  if (window.WebGLRenderingContext) { init(); }
})();
