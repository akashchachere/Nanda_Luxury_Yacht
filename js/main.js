/* ═══ INIT ON LOAD ═══ */
window.addEventListener('load', () => { initHero(); });

/* ═══ AOS ═══ */
if (typeof AOS !== 'undefined') {
  AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
}

/* ═══ NAVBAR ═══ */
const navbar = document.getElementById('navbar');
const topbar = document.getElementById('topbar');
const backToTopBtn = document.getElementById('backToTop');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 80);
  if (topbar) topbar.classList.toggle('hidden', scrollY > 200);
  if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollY > 400);
  lastScroll = scrollY;
});

/* ═══ HAMBURGER ═══ */
const hamburgerBtn = document.getElementById('hamburger');
const mobileMenuEl = document.getElementById('mobileMenu');
if (hamburgerBtn && mobileMenuEl) {
  hamburgerBtn.addEventListener('click', () => {
    mobileMenuEl.classList.toggle('open');
  });
}
function closeMobile() { if (mobileMenuEl) mobileMenuEl.classList.remove('open'); }

/* ═══ HERO SLIDESHOW ═══ */
function initHero() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroDots');
  const labelEl = document.getElementById('slideLabelText');
  if (!slides.length || !dotsContainer) return;
  let current = 0;

  // Create dots
  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i+1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
    // Only the first slide's video should play on load; keep others paused until active
    const vid = slide.querySelector('video');
    if (vid && i !== 0) vid.pause();
  });

  function goTo(idx) {
    const prevVideo = slides[current].querySelector('video');
    if (prevVideo) prevVideo.pause();
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
    const label = slides[current].getAttribute('data-label');
    if (label && labelEl) labelEl.textContent = label;
    const curVideo = slides[current].querySelector('video');
    if (curVideo) { curVideo.currentTime = 0; curVideo.play().catch(()=>{}); }
    const labelDot = document.querySelector('.slide-label-dot');
    if (labelDot) labelDot.classList.toggle('is-live', slides[current].dataset.video === 'true');
  }
  // Set initial live state for the first slide
  const initialDot = document.querySelector('.slide-label-dot');
  if (initialDot) initialDot.classList.toggle('is-live', slides[0].dataset.video === 'true');

  // Auto-advance every 5 seconds
  setInterval(() => {
    goTo((current + 1) % slides.length);
  }, 5000);

  // GSAP hero animations
  if (typeof gsap !== 'undefined') {
    gsap.to('[data-gsap="fadeUp"]', { opacity:1, y:0, duration:1, stagger:0.2, delay:0.3, ease:'power3.out' });
    gsap.to('[data-gsap="headline"] .line', { opacity:1, y:0, duration:0.9, stagger:0.15, delay:0.5, ease:'power3.out' });
  }
}

/* ═══ BACK TO TOP ═══ */
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══ COUNTERS ═══ */
const observerOpts = { threshold: 0.5 };
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
        else { el.textContent = Math.floor(current).toLocaleString(); }
      }, 20);
      counterObserver.unobserve(el);
    }
  });
}, observerOpts);
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ═══ SWIPER ═══ */
if (typeof Swiper !== 'undefined' && document.querySelector('.testimonials-swiper')) {
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: { 768: { slidesPerView: 2 } }
  });
}

/* ═══ FORM ═══ */
function submitForm() {
  document.getElementById('formSuccess').style.display = 'block';
  setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 5000);
}

/* ═══ CHARTER ROUTES: DESTINATION TOGGLE ═══ */
document.querySelectorAll('.dest-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dest-toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const dest = btn.dataset.dest;
    const targetPanel = document.getElementById('panel-' + dest);
    document.querySelectorAll('.dest-panel').forEach(panel => panel.classList.remove('active'));
    if (targetPanel) targetPanel.classList.add('active');
  });
});

/* ═══ CHARTER ROUTES: ROUTE FILTER (All / Mumbai↔Elephanta / Mumbai↔Mandwa) ═══ */

// Re-triggers the fleet card entrance animation with a staggered delay per card,
// so switching filters feels alive instead of an instant snap.
function animateFleetCards(cards) {
  cards.forEach((card, i) => {
    card.classList.remove('card-animate-in');
    void card.offsetWidth; // force reflow so the animation restarts
    card.style.animationDelay = (i * 60) + 'ms';
    card.classList.add('card-animate-in');
  });
}

// Re-triggers the "coming soon" panel's entrance animation.
function animateRouteEmpty(el) {
  if (!el) return;
  el.classList.remove('route-empty-animate');
  void el.offsetWidth;
  el.classList.add('route-empty-animate');
}

document.querySelectorAll('.route-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.route-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const route = btn.dataset.route;
    const grid = document.getElementById('mumbaiYachtGrid');
    const empty = document.getElementById('mumbaiRouteEmpty');
    const emptyTitle = document.getElementById('mumbaiRouteEmptyTitle');

    // Every yacht card lists the routes it runs (both directions) in data-routes.
    // Filter to whichever cards match the selected route.
    const visibleCards = [];
    document.querySelectorAll('#mumbaiYachtGrid .yacht-card').forEach(card => {
      const routes = (card.dataset.routes || '').split(' ');
      const matches = route === 'all' || routes.includes(route);
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCards.push(card);
    });

    if (visibleCards.length === 0) {
      // No yachts currently assigned to this route — show the coming-soon state
      if (grid) grid.style.display = 'none';
      if (empty) {
        empty.style.display = 'block';
        if (emptyTitle) emptyTitle.textContent = 'Route Coming Soon';
        animateRouteEmpty(empty);
      }
      return;
    }

    if (grid) grid.style.display = '';
    if (empty) empty.style.display = 'none';
    animateFleetCards(visibleCards);
  });
});

/* ═══ YACHT EXPLORE — FULL DETAIL PAGE ═══ */
const YACHTS = {
  allegra: {
    name: 'Allegra',
    image: 'image/yacht_explore_images/allegra.jpeg',
    gallery: ['image/yacht_explore_images/allegra_1.jpeg', 'image/yacht_explore_images/allegra_2.jpeg', 'image/yacht_explore_images/allegra_3.jpeg','image/yacht_explore_images/allegra_4.jpeg'],
    tagline: 'A sleek, sociable cruiser built for effortless day charters across Mumbai\u2019s harbour waters.',
    description: 'Allegra is the perfect choice for guests who want a smooth, stylish introduction to yacht life. With a spacious open deck and comfortable lounge seating, she\u2019s ideal for sunset cruises, small celebrations, and relaxed harbour tours to Elephanta Island or Mandwa. Her experienced crew ensures every voyage feels effortless from the moment you step aboard.',
    price: '\u20b91,75,000',
    specs: [
      { icon: 'fa-ruler-combined', val: '45m', label: 'Length' },
      { icon: 'fa-users', val: '12', label: 'Guests' },
      { icon: 'fa-bed', val: '6', label: 'Cabins' },
      { icon: 'fa-user-tie', val: '4', label: 'Crew' }
    ],
    amenities: ['Air Conditioning', 'Open Sun Deck', 'Premium Sound System', 'Onboard Bar', 'Fresh Water Shower', 'Safety Equipment', 'Dedicated Crew', 'Lounge Seating'],
    routes: ['Mumbai \u2192 Elephanta', 'Mumbai \u2192 Mandwa']
  },
  shorething: {
    name: 'Shorething',
    image: 'image/yacht_explore_images/shorething.jpeg',
    gallery: ['image/yacht_explore_images/shorething_1.jpeg', 'image/yacht_explore_images/shorething_2.jpeg', 'image/yacht_explore_images/shorething_3.jpeg', 'image/yacht_explore_images/shorething_4.jpeg'],
    tagline: 'A sleek, sociable cruiser built for effortless day charters across Mumbai\u2019s harbour waters.',
    description: 'Shorething is the perfect choice for guests who want a smooth, stylish introduction to yacht life. With a spacious open deck and comfortable lounge seating, she\u2019s ideal for sunset cruises, small celebrations, and relaxed harbour tours to Elephanta Island or Mandwa. Her experienced crew ensures every voyage feels effortless from the moment you step aboard.',
    price: '\u20b927,000',
    specs: [
      { icon: 'fa-ruler-combined', val: '45m', label: 'Length' },
      { icon: 'fa-users', val: '12', label: 'Guests' },
      { icon: 'fa-bed', val: '6', label: 'Cabins' },
      { icon: 'fa-user-tie', val: '4', label: 'Crew' }
    ],
    amenities: ['Air Conditioning', 'Open Sun Deck', 'Premium Sound System', 'Onboard Bar', 'Fresh Water Shower', 'Safety Equipment', 'Dedicated Crew', 'Lounge Seating'],
    routes: ['Mumbai \u2192 Elephanta', 'Mumbai \u2192 Mandwa']
  },
  letlive: {
    name: 'Live & Let Live',
    gallery: ['image/yacht_explore_images/live_let_live_1.jpeg', 'image/yacht_explore_images/live_let_live_2.jpeg', 'image/yacht_explore_images/live_let_live_3.jpeg', 'image/yacht_explore_images/live_let_live_4.jpeg'],
    image: 'image/yacht_explore_images/live_let_live.jpeg',
    tagline: 'A warm, easy-going charter yacht made for intimate gatherings and relaxed coastal escapes.',
    description: 'Live & Let Live lives up to her name \u2014 an easy-breezy yacht built for guests who want to unwind on the water without fuss. Her cosy cabins and shaded deck make her a favourite for small family outings and weekend getaways to Mandwa, with attentive crew looking after every detail along the way.',
    price: '\u20b960,000',
    specs: [
      { icon: 'fa-ruler-combined', val: '38m', label: 'Length' },
      { icon: 'fa-users', val: '10', label: 'Guests' },
      { icon: 'fa-bed', val: '5', label: 'Cabins' },
      { icon: 'fa-user-tie', val: '3', label: 'Crew' }
    ],
    amenities: ['Air Conditioning', 'Shaded Deck', 'Sound System', 'Onboard Bar', 'Fresh Water Shower', 'Safety Equipment', 'Dedicated Crew'],
    routes: ['Mumbai \u2192 Mandwa']
  },
  bugme: {
    name: 'Bug Me',
    image: 'image/yacht_explore_images/bug_me.jpeg',
    gallery: ['image/yacht_explore_images/bug_me_1.jpeg', 'image/yacht_explore_images/bug_me_2.jpeg', 'image/yacht_explore_images/bug_me_3.jpeg'],
    tagline: 'A compact, spirited yacht perfect for close friends and quick coastal adventures.',
    description: 'Bug Me is built for guests who want a fun, nimble charter experience. Compact yet comfortable, she\u2019s a great pick for smaller groups looking for a lively day out on the water, with quick access to both Elephanta Island and Mandwa from Mumbai\u2019s harbour.',
    price: '\u20b960,000',
    specs: [
      { icon: 'fa-ruler-combined', val: '32m', label: 'Length' },
      { icon: 'fa-users', val: '8', label: 'Guests' },
      { icon: 'fa-bed', val: '4', label: 'Cabins' },
      { icon: 'fa-user-tie', val: '3', label: 'Crew' }
    ],
    amenities: ['Air Conditioning', 'Open Deck', 'Sound System', 'Fresh Water Shower', 'Safety Equipment', 'Dedicated Crew'],
    routes: ['Mumbai \u2192 Elephanta', 'Mumbai \u2192 Mandwa']
  },
  a2b: {
    name: 'A2B',
    image: 'image/yacht_explore_images/a2b.jpeg',
    gallery: ['image/yacht_explore_images/a2b_1.jpeg', 'image/yacht_explore_images/a2b_2.jpeg', 'image/yacht_explore_images/a2b_3.jpeg', 'image/yacht_explore_images/a2b_4.jpeg'],
    tagline: 'A generously proportioned charter yacht built for larger groups and full-day itineraries.',
    description: 'A2B offers extra room to spread out, making her a top choice for larger groups, corporate outings, and celebrations. With seven cabins and a wide deck, she comfortably balances lively socialising with private, relaxed corners \u2014 ready for a full day exploring Mumbai\u2019s coastline.',
    price: '\u20b910,000',
    specs: [
      { icon: 'fa-ruler-combined', val: '50m', label: 'Length' },
      { icon: 'fa-users', val: '14', label: 'Guests' },
      { icon: 'fa-bed', val: '7', label: 'Cabins' },
      { icon: 'fa-user-tie', val: '5', label: 'Crew' }
    ],
    amenities: ['Air Conditioning', 'Open Sun Deck', 'Premium Sound System', 'Onboard Bar', 'Fresh Water Shower', 'Safety Equipment', 'Dedicated Crew', 'Lounge Seating', 'WiFi Onboard'],
    routes: ['Mumbai \u2192 Elephanta', 'Mumbai \u2192 Mandwa']
  },
  dolphine: {
    name: 'Dolphine',
    image: 'image/yacht_explore_images/dolphin.jpeg',
    gallery: ['image/yacht_explore_images/dolphin_1.jpeg', 'image/yacht_explore_images/dolphin_2.jpeg', 'image/yacht_explore_images/dolphin_3.jpeg', 'image/yacht_explore_images/dolphin_4.jpeg'],
    tagline: 'A flagship-class yacht offering the fleet\u2019s most spacious and premium charter experience.',
    description: 'Dolphine is among the largest in our fleet, offering nine cabins and expansive deck space designed for grand celebrations, corporate charters, and full-day luxury voyages. Every detail, from her lounge areas to her onboard amenities, is crafted to deliver an elevated experience on the water.',
    price: '\u20b960,000',
    specs: [
      { icon: 'fa-ruler-combined', val: '60m', label: 'Length' },
      { icon: 'fa-users', val: '18', label: 'Guests' },
      { icon: 'fa-bed', val: '9', label: 'Cabins' },
      { icon: 'fa-user-tie', val: '6', label: 'Crew' }
    ],
    amenities: ['Air Conditioning', 'Open Sun Deck', 'Premium Sound System', 'Full Bar', 'Fresh Water Shower', 'Safety Equipment', 'Dedicated Crew', 'Lounge Seating', 'WiFi Onboard', 'Catering Available'],
    routes: ['Mumbai \u2192 Elephanta', 'Mumbai \u2192 Mandwa']
  },
  westcoast: {
    name: 'West Coast Marine Express',
    image: 'image/yacht_explore_images/west_coast_marine.jpeg',
    gallery: ['image/yacht_explore_images/west_coast_marine_express_1.jpeg', 'image/yacht_explore_images/west_coast_marine_express_2.jpeg', 'image/yacht_explore_images/west_coast_marine_express_3.jpeg', 'image/yacht_explore_images/west_coast_marine_express_4.jpeg'],
    tagline: 'Our premium flagship charter \u2014 the pinnacle of comfort, space, and onboard luxury.',
    description: 'West Coast Marine is our premium-tier yacht, reserved for guests seeking the very best the fleet has to offer. With nine cabins, a full-service bar, and generous lounge space, she\u2019s the top pick for weekend getaways to Mandwa, milestone celebrations, and discerning corporate charters.',
    price: '\u20b914,000',
    specs: [
      { icon: 'fa-ruler-combined', val: '60m', label: 'Length' },
      { icon: 'fa-users', val: '18', label: 'Guests' },
      { icon: 'fa-bed', val: '9', label: 'Cabins' },
      { icon: 'fa-user-tie', val: '6', label: 'Crew' }
    ],
    amenities: ['Air Conditioning', 'Open Sun Deck', 'Premium Sound System', 'Full Bar', 'Fresh Water Shower', 'Safety Equipment', 'Dedicated Crew', 'Lounge Seating', 'WiFi Onboard', 'Catering Available'],
    routes: ['Mumbai \u2192 Mandwa']
  }
};

function openYachtDetail(key) {
  const y = YACHTS[key];
  const page = document.getElementById('yachtDetailPage');
  if (!y || !page) return;

  document.getElementById('ydHeroImg').src = y.image;
  document.getElementById('ydHeroImg').alt = y.name;
  document.getElementById('ydName').textContent = y.name;
  document.getElementById('ydTagline').textContent = y.tagline;
  document.getElementById('ydDescription').textContent = y.description;
  document.getElementById('ydPrice').textContent = y.price;

  const quickStats = document.getElementById('ydQuickStats');
  quickStats.innerHTML = y.specs.slice(0, 3).map(s =>
    `<span><i class="fas ${s.icon}"></i> ${s.val} ${s.label}</span>`
  ).join('');

  const specsGrid = document.getElementById('ydSpecsGrid');
  specsGrid.innerHTML = y.specs.map(s =>
    `<div class="yd-spec-item"><i class="fas ${s.icon}"></i><span class="yd-spec-val">${s.val}</span><span class="yd-spec-label">${s.label}</span></div>`
  ).join('');

  const amenities = document.getElementById('ydAmenities');
  amenities.innerHTML = y.amenities.map(a =>
    `<div class="yd-amenity"><i class="fas fa-check-circle"></i> ${a}</div>`
  ).join('');

  const routes = document.getElementById('ydRoutes');
  routes.innerHTML = y.routes.map(r =>
    `<span><i class="fas fa-location-arrow"></i> ${r}</span>`
  ).join('');

  buildGallery('ydGallery', y.gallery && y.gallery.length ? y.gallery : [y.image], y.name);

  page.classList.add('open');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeYachtDetail() {
  const page = document.getElementById('yachtDetailPage');
  if (!page) return;
  page.classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══ SHARED GALLERY CAROUSEL — used by Yacht / Destination / Experience explore pages ═══ */
function buildGallery(containerId, images, altPrefix) {
  const el = document.getElementById(containerId);
  if (!el || !images || !images.length) return;
  let idx = 0;
  const track = el.querySelector('.gc-track');
  const dotsWrap = el.querySelector('.gc-dots');
  const counter = el.querySelector('.gc-counter');

  track.innerHTML = images.map((src, i) =>
    `<div class="gc-slide"><img src="${src}" alt="${altPrefix || 'Photo'} ${i + 1}" loading="lazy" /></div>`
  ).join('');
  dotsWrap.innerHTML = images.map((_, i) =>
    `<button class="gc-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Photo ${i + 1}"></button>`
  ).join('');

  function render() {
    track.style.transform = `translateX(-${idx * 100}%)`;
    dotsWrap.querySelectorAll('.gc-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    if (counter) counter.textContent = `${idx + 1} / ${images.length}`;
  }
  el.querySelector('.gc-prev').onclick = () => { idx = (idx - 1 + images.length) % images.length; render(); };
  el.querySelector('.gc-next').onclick = () => { idx = (idx + 1) % images.length; render(); };
  dotsWrap.querySelectorAll('.gc-dot').forEach(d => {
    d.onclick = () => { idx = parseInt(d.dataset.i, 10); render(); };
  });
  idx = 0;
  render();
}

/* ═══ DESTINATION EXPLORE — FULL DETAIL PAGE ═══ */
const DESTINATIONS = {
  mumbai: {
    name: 'Mumbai',
    region: '⚓ Arabian Sea · Maharashtra',
    tagline: 'India\u2019s City of Dreams, seen the way it was meant to be seen  from open water.',
    heroImage: 'https://images.pexels.com/photos/28350362/pexels-photo-28350362.jpeg',
    description1: 'Mumbai\u2019s coastline is a study in contrasts colonial stone monuments meeting a skyline of glass and light, all wrapped in the salt air of the Arabian Sea. A Nanda charter puts you right in the middle of it, gliding past the Gateway of India and the shimmering curve of Marine Drive\u2019s Queen\u2019s Necklace as the city puts on its evening show.',
    description2: 'Beyond the harbour, Elephanta Island offers a quieter, older Mumbai ancient rock-cut caves reachable only by boat. Whether it\u2019s a two-hour sunset sail or a full-day island crossing to Mandwa, our Mumbai fleet is built for guests who want the city\u2019s energy without ever touching traffic.',
    quickstats: ['10+ Yachts Based Here', 'Available Year Round', '2 Signature Routes'],
    highlights: ['Gateway of India ', 'Sunset harbour cruises', 'Elephanta Island heritage crossing', 'Mandwa day charters', 'Private onboard catering', 'Photography-ready golden hour light'],
    gallery: [
      'https://images.pexels.com/photos/14826311/pexels-photo-14826311.jpeg',
      'https://images.pexels.com/photos/17591959/pexels-photo-17591959.jpeg',
      'https://images.pexels.com/photos/5097333/pexels-photo-5097333.jpeg',
      'https://images.pexels.com/photos/7998983/pexels-photo-7998983.jpeg'
    ]
  },
  goa: {
    name: 'Goa',
    region: '\uD83C\uDF34 Konkan Coast · Goa',
    tagline: 'Where the party coast meets pure, unspoiled blue.',
    heroImage: 'image/destination/goa.png',
    description1: 'Goa is two coastlines in one. To the north, Candolim and Calangute hum with beach-shack energy and sunset crowds; to the south, Palolem and Agonda fold into quiet coves that feel a world away. A Nanda charter lets you have both and everything in between from the comfort of your own deck.',
    description2: 'No Goa voyage is complete without a golden-hour cruise up the Mandovi River, watching the old Portuguese quarter of Panjim glow as the sun drops. Whether you\u2019re planning a full day of island-hopping or a relaxed river sundowner, our Goa charters are built around your pace.',
    quickstats: ['Konkan Coastline Access', 'Available Year Round', 'North & South Goa Routes'],
    highlights: ['Candolim & Calangute coastal cruising', 'Palolem & Agonda hidden coves', 'Mandovi River sunset sails', 'Panjim heritage waterfront views', 'Water sports & island stops', 'Full-day or half-day itineraries'],
    gallery: [
      'image/goa_destination_image1.png',
      'https://images.pexels.com/photos/10898926/pexels-photo-10898926.jpeg',
      'https://images.pexels.com/photos/6348809/pexels-photo-6348809.jpeg',
      'https://images.pexels.com/photos/13574596/pexels-photo-13574596.jpeg'
    ]
  }
};

function openDestDetail(key) {
  const d = DESTINATIONS[key];
  const page = document.getElementById('destDetailPage');
  if (!d || !page) return;

  document.getElementById('ddHeroImg').src = d.heroImage;
  document.getElementById('ddHeroImg').alt = d.name;
  document.getElementById('ddRegion').textContent = d.region;
  document.getElementById('ddName').textContent = d.name;
  document.getElementById('ddTagline').textContent = d.tagline;
  document.getElementById('ddDescription1').textContent = d.description1;
  document.getElementById('ddDescription2').textContent = d.description2;

  const quickStats = document.getElementById('ddQuickStats');
  quickStats.innerHTML = d.quickstats.map(s => `<span><i class="fas fa-check"></i> ${s}</span>`).join('');

  const highlights = document.getElementById('ddHighlights');
  highlights.innerHTML = d.highlights.map(h =>
    `<div class="yd-amenity"><i class="fas fa-check-circle"></i> ${h}</div>`
  ).join('');

  buildGallery('ddGallery', d.gallery, d.name);

  page.classList.add('open');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeDestDetail() {
  const page = document.getElementById('destDetailPage');
  if (!page) return;
  page.classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══ LUXURY EXPERIENCE — FULL DETAIL PAGE ═══ */
const EXPERIENCES = {
  corporate: {
    name: 'Corporate Events',
    tagline: 'Business, elevated by the horizon.',
    heroImage: 'https://images.pexels.com/photos/20393210/pexels-photo-20393210.jpeg',
    description: 'Trade the boardroom for open water. Nanda\u2019s corporate charters are designed for teams who want a change of scenery without losing an ounce of professionalism private meeting decks, reliable service, and a crew trained to keep everything running exactly on schedule. Whether it\u2019s a leadership offsite, a client entertainment day, or a milestone team celebration, we handle the logistics so you can focus on the people in the room.',
    highlights: ['Private onboard meeting space', 'Dedicated event coordinator', 'Custom catering & bar packages', 'AV & connectivity on request', 'Flexible half-day & full-day slots', 'Confidential, exclusive-use charters'],
    gallery: ['https://images.pexels.com/photos/2205683/pexels-photo-2205683.jpeg', 'https://images.pexels.com/photos/271681/pexels-photo-271681.jpeg', 'https://images.pexels.com/photos/7895729/pexels-photo-7895729.jpeg', 'https://images.pexels.com/photos/30063500/pexels-photo-30063500.jpeg']
  },
  romantic: {
    name: 'Romantic Cruises',
    tagline: 'The most beautiful yes you\u2019ll ever say.',
    heroImage: 'https://images.pexels.com/photos/26986258/pexels-photo-26986258.jpeg',
    description: 'Some moments deserve more than a table for two. Sail into a Mumbai sunset or drift through Goa\u2019s golden waters with a crew that knows exactly when to disappear. From quiet proposal setups to anniversary surprises, every detail the music, the flowers, the champagne is arranged before you even step aboard.',
    highlights: ['Private sunset & moonlight sails', 'Proposal & anniversary styling', 'Champagne & candlelight setups', 'Photography arrangements available', 'Discreet, dedicated crew', 'Mumbai & Goa routes'],
    gallery: ['https://images.pexels.com/photos/274092/pexels-photo-274092.jpeg', 'https://images.pexels.com/photos/5723441/pexels-photo-5723441.jpeg', 'https://images.pexels.com/photos/5111525/pexels-photo-5111525.jpeg', 'https://images.pexels.com/photos/8857926/pexels-photo-8857926.jpeg']
  },
  celebrations: {
    name: 'Private Celebrations',
    tagline: 'Birthdays, milestones, and everything worth toasting to.',
    heroImage: 'https://images.pexels.com/photos/10955637/pexels-photo-10955637.jpeg',
    description: 'From an intimate birthday for close friends to a full milestone celebration with premium catering, our private celebration charters turn any occasion into an open-water event. Decorate the deck, bring your own playlist, or let our team curate the entire experience the Arabian Sea makes an unforgettable backdrop either way.',
    highlights: ['Custom decor & theming', 'Premium catering & bar service', 'Sound system & lighting onboard', 'Flexible guest capacity', 'Cake & celebration arrangements', 'Mumbai & Goa availability'],
    gallery: ['https://images.pexels.com/photos/5046354/pexels-photo-5046354.jpeg', 'https://images.pexels.com/photos/36918732/pexels-photo-36918732.jpeg', 'https://images.pexels.com/photos/10955625/pexels-photo-10955625.jpeg', 'https://images.pexels.com/photos/9750947/pexels-photo-9750947.jpeg']
  },
  family: {
    name: 'Family Vacations',
    tagline: 'A holiday the whole family will talk about for years.',
    heroImage: 'https://images.pexels.com/photos/5368745/pexels-photo-5368745.jpeg',
    description: 'Water toys for the kids, shaded lounging for the grandparents, and an itinerary that keeps everyone happy in between our family charters are built for every generation at once. Explore Elephanta Island, anchor for a swim, or simply enjoy a slow afternoon on deck with a crew that\u2019s used to looking after guests of every age.',
    highlights: ['Kid-friendly water toys & activities', 'Shaded lounge & deck seating', 'Flexible, easy-going itineraries', 'Life jackets for all ages', 'Family-style catering options', 'Short or full-day charters'],
    gallery: ['https://images.pexels.com/photos/7978888/pexels-photo-7978888.jpeg', 'https://images.pexels.com/photos/9692469/pexels-photo-9692469.jpeg', 'https://images.pexels.com/photos/35190661/pexels-photo-35190661.jpeg', 'https://images.pexels.com/photos/13086623/pexels-photo-13086623.jpeg']
  },
  film: {
    name: 'Film & Photography',
    tagline: 'Your next shoot, framed by open water.',
    heroImage: 'https://images.pexels.com/photos/18649940/pexels-photo-18649940.jpeg',
    description: 'From cinematic productions to luxury editorial shoots, our yachts double as some of the most striking sets on the coastline. Production crews get flexible access, ample deck space for equipment, and a location team that understands the demands of a shoot day all against the backdrop of Mumbai\u2019s harbour or Goa\u2019s coast.',
    highlights: ['Flexible access for crew & equipment', 'Multiple deck angles & backdrops', 'Golden hour scheduling on request', 'Generator & power support', 'Mumbai harbour & Goa coastline access', 'Full-day production charters'],
    gallery: ['https://images.pexels.com/photos/5204168/pexels-photo-5204168.jpeg', 'https://images.pexels.com/photos/37989298/pexels-photo-37989298.jpeg', 'https://images.pexels.com/photos/28704542/pexels-photo-28704542.jpeg', 'https://images.pexels.com/photos/15719169/pexels-photo-15719169.jpeg']
  },
  wellness: {
    name: 'Wellness Retreats',
    tagline: 'Reset, out on the water.',
    heroImage: 'https://images.pexels.com/photos/4939384/pexels-photo-4939384.jpeg',
    description: 'Sunrise yoga on deck, the sound of waves instead of traffic, and pure sea air doing more for you than any spa ever could. Our wellness charters are designed as a slow, restorative escape pair it with an onboard spa treatment or simply spend the day disconnecting somewhere the phone signal can\u2019t quite reach.',
    highlights: ['Sunrise & sunset yoga sessions', 'Onboard spa treatments on request', 'Quiet, low-traffic anchorages', 'Healthy onboard catering options', 'Small group or private charters', 'Mumbai & Goa locations'],
    gallery: ['https://images.pexels.com/photos/4939375/pexels-photo-4939375.jpeg', 'https://images.pexels.com/photos/4939380/pexels-photo-4939380.jpeg', 'https://images.pexels.com/photos/8981370/pexels-photo-8981370.jpeg', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80']
  }
};

function openExpDetail(key) {
  const ex = EXPERIENCES[key];
  const page = document.getElementById('expDetailPage');
  if (!ex || !page) return;

  document.getElementById('edHeroImg').src = ex.heroImage;
  document.getElementById('edHeroImg').alt = ex.name;
  document.getElementById('edName').textContent = ex.name;
  document.getElementById('edTagline').textContent = ex.tagline;
  document.getElementById('edDescription').textContent = ex.description;

  const highlights = document.getElementById('edHighlights');
  highlights.innerHTML = ex.highlights.map(h =>
    `<div class="yd-amenity"><i class="fas fa-check-circle"></i> ${h}</div>`
  ).join('');

  buildGallery('edGallery', ex.gallery, ex.name);

  page.classList.add('open');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeExpDetail() {
  const page = document.getElementById('expDetailPage');
  if (!page) return;
  page.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeYachtDetail();
    closeDestDetail();
    closeExpDetail();
  }
});
