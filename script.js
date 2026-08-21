// ─── PARTICLES ───
(function() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      width: ${Math.random() * 3 + 2}px;
      height: ${Math.random() * 3 + 2}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * -14}s;
      opacity: ${Math.random() * 0.3 + 0.1};
    `;
    container.appendChild(p);
  }
})();

// ─── NAV SCROLL & HAMBURGER ───
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when link clicked
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ─── WALLET PROGRESS BAR ANIMATION ───
const walletFill = document.querySelector('.wallet-fill');
const walletObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { walletFill.classList.add('animated'); walletObserver.disconnect(); }
  });
}, { threshold: 0.5 });
if (walletFill) walletObserver.observe(walletFill);

// ─── COUNTER-UP ANIMATION ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const divisor = parseInt(el.dataset.divisor) || 1;
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(eased * target / divisor);
    el.textContent = (target >= 1000 && divisor > 1 ? '+' : '') + val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ─── STEPS CONNECTOR ───
const connector = document.querySelector('.steps-connector');
const stepsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { connector.classList.add('visible'); stepsObserver.disconnect(); } });
}, { threshold: 0.3 });
if (connector) stepsObserver.observe(connector.parentElement);

// ─── SWIPE CARD (TINDER) ───
const topCard = document.getElementById('topCard');
const btnPass = document.getElementById('btnPass');
const btnMatch = document.getElementById('btnMatch');
const matchOverlay = document.getElementById('matchOverlay');
let startX = 0, currentX = 0, dragging = false;

const cardsData = [
  { school: 'CEFET-RJ • Rio de Janeiro', name: 'Turma 3ºC - 2026', budget: 'R$2.600 – R$3.100 por aluno', tags: ['🌊 Praia','📅 Janeiro','36 alunos'] },
  { school: 'Colégio São Paulo • SP',    name: 'Turma 3ºA - 2026', budget: 'R$2.500 – R$3.000 por aluno', tags: ['🌊 Praia','📅 Janeiro','32 alunos'] },
  { school: 'Instituto Federal • BH',    name: 'Turma 3ºB - 2026', budget: 'R$2.800 – R$3.200 por aluno', tags: ['⛰️ Serra','📅 Fevereiro','28 alunos'] },
  { school: 'ETEC Centro • SP',          name: 'Turma 3ºD - 2026', budget: 'R$2.200 – R$2.700 por aluno', tags: ['🏙️ Interior','📅 Março','30 alunos'] },
  { school: 'IF Sudeste MG • Muriaé',    name: 'Turma 3ºE - 2026', budget: 'R$2.400 – R$2.900 por aluno', tags: ['🌿 Natureza','📅 Abril','26 alunos'] },
];
let cardIdx = 0;

function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

if (topCard) {
  topCard.addEventListener('mousedown', e => { dragging = true; startX = getX(e); topCard.classList.add('dragging'); });
  topCard.addEventListener('touchstart', e => { dragging = true; startX = getX(e); topCard.classList.add('dragging'); }, { passive: true });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    currentX = getX(e) - startX;
    topCard.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.07}deg)`;
    topCard.style.opacity = Math.max(0.4, 1 - Math.abs(currentX) / 280);
  });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    currentX = getX(e) - startX;
    topCard.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.07}deg)`;
    topCard.style.opacity = Math.max(0.4, 1 - Math.abs(currentX) / 280);
  }, { passive: true });

  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    topCard.classList.remove('dragging');
    if (Math.abs(currentX) > 90) {
      swipeCard(currentX > 0 ? 'match' : 'pass');
    } else {
      topCard.style.transform = '';
      topCard.style.opacity = '';
    }
    currentX = 0;
  }

  function swipeCard(dir) {
    const x = dir === 'match' ? 650 : -650;
    topCard.style.transition = 'transform 0.4s cubic-bezier(0.34,1,0.64,1), opacity 0.4s';
    topCard.style.transform = `translateX(${x}px) rotate(${dir === 'match' ? 22 : -22}deg)`;
    topCard.style.opacity = '0';

    if (dir === 'match' && matchOverlay) {
      matchOverlay.classList.add('show');
      setTimeout(() => matchOverlay.classList.remove('show'), 2000);
    }

    setTimeout(() => {
      cardIdx = (cardIdx + 1) % cardsData.length;
      const c = cardsData[cardIdx];
      topCard.style.transition = '';
      topCard.style.transform = '';
      topCard.style.opacity = '';
      topCard.querySelector('.tc-school').textContent = '🏫 ' + c.school;
      topCard.querySelector('.tc-name').textContent = c.name;
      topCard.querySelector('.tc-budget-pill').textContent = c.budget;
      const tagsEl = topCard.querySelector('.tc-tags');
      tagsEl.innerHTML = c.tags.map(t => `<span class="tc-tag">${t}</span>`).join('');
    }, 420);
  }

  btnPass.addEventListener('click', () => swipeCard('pass'));
  btnMatch.addEventListener('click', () => swipeCard('match'));
}

// ─── AUCTION TIMER ───
let seconds = 85632;
const timerEl = document.getElementById('timer');
if (timerEl) {
  setInterval(() => {
    if (seconds <= 0) return;
    seconds--;
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    timerEl.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// ─── AUCTION BID BARS ANIMATE ON SCROLL ───
const bidBars = document.querySelectorAll('.bid-bar');
const bidWidths = ['88%', '72%', '60%', '48%'];
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      bidBars.forEach((bar, i) => {
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = bidWidths[i] || '40%'; }, 200 + i * 120);
      });
      barObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
const auctionCard = document.querySelector('.auction-card');
if (auctionCard) barObserver.observe(auctionCard);

// ─── ACTIVE NAV LINK ON SCROLL ───
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => activeObserver.observe(s));
