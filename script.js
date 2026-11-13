/* ===== Amber Kossy — interactions ===== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const STUDIO_EMAIL = 'hello@amberkossy.fr';

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
  }));

  /* ===== Planning ===== */
  const COACHES = ['Amber', 'Kossy', 'Inès', 'Maëlle', 'Jade'];
  const T = { mat: 'Mat Pilates', ref: 'Reformer', sculpt: 'Amber Sculpt', pre: 'Prénatal & Postnatal', stretch: 'Stretch & Mobility' };
  // [heure, type, niveau, coach index, places restantes]
  const WEEK = [
    [['07:15', T.ref, 'Tous niveaux', 0, 2], ['09:30', T.mat, 'Tous niveaux', 2, 6], ['12:30', T.sculpt, 'Intermédiaire', 1, 3], ['18:00', T.ref, 'Débutant', 3, 4], ['19:15', T.mat, 'Intermédiaire', 2, 5], ['20:15', T.stretch, 'Tous niveaux', 4, 8]],
    [['07:15', T.sculpt, 'Intermédiaire', 1, 1], ['10:00', T.pre, 'Prénatal', 3, 3], ['12:30', T.mat, 'Tous niveaux', 2, 7], ['18:00', T.ref, 'Intermédiaire', 0, 2], ['19:15', T.ref, 'Débutant', 4, 5]],
    [['07:15', T.ref, 'Débutant', 3, 4], ['09:30', T.stretch, 'Tous niveaux', 4, 9], ['12:30', T.ref, 'Tous niveaux', 0, 0], ['18:00', T.mat, 'Débutant', 2, 6], ['19:15', T.sculpt, 'Intermédiaire', 1, 2], ['20:15', T.mat, 'Avancé', 2, 4]],
    [['07:15', T.mat, 'Tous niveaux', 2, 8], ['10:00', T.pre, 'Postnatal', 3, 4], ['12:30', T.sculpt, 'Intermédiaire', 1, 3], ['18:00', T.ref, 'Avancé', 0, 1], ['19:15', T.ref, 'Débutant', 4, 6]],
    [['07:15', T.ref, 'Intermédiaire', 0, 3], ['12:30', T.mat, 'Tous niveaux', 2, 6], ['18:00', T.sculpt, 'Tous niveaux', 1, 2], ['19:15', T.stretch, 'Tous niveaux', 4, 10]],
    [['09:00', T.ref, 'Débutant', 3, 2], ['10:00', T.mat, 'Tous niveaux', 2, 4], ['11:00', T.sculpt, 'Intermédiaire', 1, 0], ['12:00', T.pre, 'Prénatal', 3, 5]],
    [['10:00', T.ref, 'Tous niveaux', 0, 3], ['11:00', T.stretch, 'Tous niveaux', 4, 7], ['12:00', T.mat, 'Débutant', 2, 6]],
  ];
  const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const daysEl = $('[data-days]');
  const schedEl = $('[data-schedule]');
  const filterEl = $('[data-schedule-filter]');
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
    const f = filterEl.value;
    const list = WEEK[activeDay].filter(c => f === 'all' || c[1] === f);
    schedEl.innerHTML = list.length ? list.map(([time, name, level, coach, spots]) => `
      <div class="slot">
        <span class="slot__time">${time}</span>
        <span class="slot__name">${name}</span>
        <span class="slot__level">${level}<span class="slot__spots ${spots <= 2 ? 'is-low' : ''}">${spots === 0 ? 'Complet · liste d’attente' : spots + ' place' + (spots > 1 ? 's' : '') + ' restante' + (spots > 1 ? 's' : '')}</span></span>
        <span class="slot__coach">avec ${COACHES[coach]}</span>
        <button class="link-btn" data-book="${name}" data-book-day="${activeDay}">${spots === 0 ? 'Attente →' : 'Réserver →'}</button>
      </div>`).join('') : '<div class="schedule__empty">Aucun cours de ce type ce jour-là.</div>';
  };
  daysEl.addEventListener('click', e => {
    const b = e.target.closest('.day'); if (!b) return;
    activeDay = Number(b.dataset.day); renderSchedule();
  });
  filterEl.addEventListener('change', renderSchedule);
  renderSchedule();

  /* ===== Booking modal ===== */
  const modal = $('[data-modal]');
  const form = $('[data-book-form]');
  const ok = $('.modal__ok', modal);
  const serviceSelect = form.elements.service;
  let lastFocus = null;

  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  form.elements.date.min = isoDate(today);

  const openModal = (service, dayIdx) => {
    lastFocus = document.activeElement;
    form.hidden = false; ok.hidden = true; form.reset();
    if (service) {
      const opt = [...serviceSelect.options].find(o => o.value === service);
      if (opt) serviceSelect.value = opt.value;
      else { serviceSelect.add(new Option(service, service, true, true)); }
    }
    const d = new Date(today);
    if (dayIdx !== undefined) d.setDate(today.getDate() - mondayOffset + Number(dayIdx));
    form.elements.date.value = isoDate(d < today ? today : d);
    setDrawer(false);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => form.elements.name.focus(), 50);
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus?.();
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-book]');
    if (b) { e.preventDefault(); openModal(b.dataset.book || '', b.dataset.bookDay); }
    if (e.target.closest('[data-modal-close]')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); setDrawer(false); } });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const body = `Bonjour,\n\nJe souhaite réserver :\n- Prestation : ${data.service}\n- Date : ${data.date}\n- Créneau : ${data.slot}\n\nNom : ${data.name}\nEmail : ${data.email}`;
    window.location.href = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent('Réservation — ' + data.service)}&body=${encodeURIComponent(body)}`;
    $('[data-ok-service]', ok).textContent = data.service;
    form.hidden = true; ok.hidden = false;
  });

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
