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
  $('[data-year]').textContent = new Date().getFullYear();

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
