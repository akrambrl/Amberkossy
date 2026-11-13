/* ===== Amber Kossy — interactions ===== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const STUDIO_EMAIL = 'contact@amberkossy.fr';
  // Page de réservation bsport du studio (formules et réservation des cours)
  const BOOKING_URL = 'https://backoffice.bsport.io/m/AMBER%20KOSSY/6905/pass/?tabSelected=1&index=1';

  /* Header on scroll */
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile drawer */
  const drawer = $('[data-drawer]');
  const burger = $('[data-menu-toggle]');
  const setDrawer = (open) => {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('drawer-open', open);
  };
  burger.addEventListener('click', () => setDrawer(true));
  $('[data-menu-close]').addEventListener('click', () => setDrawer(false));
  $$('a', drawer).forEach(a => a.addEventListener('click', () => setDrawer(false)));

  /* Prestations filter */
  $$('[data-filter]').forEach(chip => chip.addEventListener('click', () => {
    $$('[data-filter]').forEach(c => c.classList.toggle('is-active', c === chip));
    const f = chip.dataset.filter;
    $$('.card').forEach(card => card.classList.toggle('is-hidden', f !== 'all' && card.dataset.cat !== f));
  }));

  /* Price tabs */
  $$('[data-price-tab]').forEach(tab => tab.addEventListener('click', () => {
    $$('[data-price-tab]').forEach(t => t.classList.toggle('is-active', t === tab));
    $$('[data-price-panel]').forEach(p => { p.hidden = p.dataset.pricePanel !== tab.dataset.priceTab; });
    $$('[data-price-intro]').forEach(p => { p.hidden = p.dataset.priceIntro !== tab.dataset.priceTab; });
  }));

  /* ===== Planning : horaires réels du studio (lundi → dimanche) ===== */
  const WEEK = [
    ['07:00', '08:00', '12:30', '18:00', '19:00', '20:00'], // lundi
    ['07:00', '08:00', '12:30', '18:00', '19:00', '20:00'], // mardi
    ['18:00', '19:00', '20:00'],                            // mercredi
    ['07:00', '08:00', '12:30', '18:00', '19:00', '20:00'], // jeudi
    ['18:00', '19:00', '20:00'],                            // vendredi
    ['09:00', '10:00', '11:00', '12:00'],                   // samedi
    ['09:30', '10:30', '11:30'],                            // dimanche
  ];
  const moment = t => { const h = parseInt(t, 10); return h < 12 ? 'Matin' : h < 15 ? 'Midi' : 'Soir'; };
  const label = t => t.replace(/^0/, '');
  const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const daysEl = $('[data-days]');
  const schedEl = $('[data-schedule]');
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  let activeDay = mondayOffset;

  daysEl.innerHTML = DAY_NAMES.map((d, i) => {
    const date = new Date(today); date.setDate(today.getDate() - mondayOffset + i);
    return `<button class="day" role="tab" data-day="${i}"><strong>${d}</strong><small>${date.getDate()}/${String(date.getMonth() + 1).padStart(2, '0')}</small></button>`;
  }).join('');

  const renderSchedule = () => {
    $$('.day', daysEl).forEach(b => {
      const on = Number(b.dataset.day) === activeDay;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    schedEl.innerHTML = WEEK[activeDay].map(time => `
      <div class="slot">
        <span class="slot__time">${label(time)}</span>
        <span class="slot__name">Pilates Reformer</span>
        <span class="slot__level">${moment(time)}</span>
        <a class="link-btn" href="${BOOKING_URL}" target="_blank" rel="noopener" data-book>Réserver →</a>
      </div>`).join('');
  };
  daysEl.addEventListener('click', e => {
    const b = e.target.closest('.day'); if (!b) return;
    activeDay = Number(b.dataset.day); renderSchedule();
  });
  renderSchedule();

  /* ===== Réservation : tous les boutons « Réserver » ouvrent bsport ===== */
  // Ce sont de vrais liens <a href> : ils marchent même si un navigateur bloque JavaScript ou les fenêtres.
  document.addEventListener('click', e => { if (e.target.closest('[data-book]')) setDrawer(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setDrawer(false); });

  /* Contact form */
  const contact = $('[data-contact-form]');
  contact.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(contact));
    window.location.href = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent('Question de ' + d.name)}&body=${encodeURIComponent(d.message + '\n\n' + d.name + ' — ' + d.email)}`;
    $('.form__ok', contact).hidden = false;
    contact.reset();
  });

  /* Newsletter */
  $('[data-newsletter]').addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('button', e.target);
    btn.textContent = 'Merci !';
    e.target.reset();
  });

  /* ===== Mobile « app » ===== */
  // Onglet actif de la barre du bas selon la section visible
  const tabs = $$('.tabbar__item');
  const tabSections = tabs.map(t => document.getElementById(t.dataset.tab) || document.body);
  const setActiveTab = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = tabs[0];
    tabSections.forEach((sec, i) => { if (sec.offsetTop <= y) current = tabs[i]; });
    tabs.forEach(t => t.classList.toggle('is-active', t === current));
  };
  window.addEventListener('scroll', setActiveTab, { passive: true });
  setActiveTab();

  // Points de pagination sous les carrousels
  $$('[data-swipe]').forEach(track => {
    const dots = document.createElement('div');
    dots.className = 'swipe-dots';
    dots.setAttribute('aria-hidden', 'true');
    track.after(dots);
    const items = () => [...track.children].filter(c => !c.classList.contains('is-hidden'));
    const update = () => {
      const list = items(); if (!list.length || !list[0].offsetWidth) return;
      const i = Math.round(track.scrollLeft / (list[0].offsetWidth + 14));
      [...dots.children].forEach((d, k) => d.classList.toggle('is-active', k === Math.min(i, list.length - 1)));
    };
    const build = () => { dots.innerHTML = items().map(() => '<span></span>').join(''); dots.hidden = track.hidden; update(); };
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // Reconstruit les points seulement quand un filtre ou un onglet change ce qui est affiché
    new MutationObserver(muts => {
      const relevant = muts.some(m => m.attributeName === 'hidden' ||
        (m.oldValue || '').includes('is-hidden') !== m.target.classList.contains('is-hidden'));
      if (relevant) { track.scrollLeft = 0; build(); }
    }).observe(track, { attributes: true, subtree: true, attributeFilter: ['hidden', 'class'], attributeOldValue: true });
    build();
  });

  // Application installable (et consultable hors-ligne) une fois le site en ligne en HTTPS
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  /* Year */
  $('[data-year]').textContent = today.getFullYear();

  /* Reveal on scroll */
  const targets = $$('.section__head, .card, .price, .steps li, .review, .intro__grid > *, .approach__grid > *, .faq details, .contact__grid > *');
  targets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => io.observe(el));
  } else targets.forEach(el => el.classList.add('is-in'));
})();
