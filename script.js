const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelectorAll('#site-nav a');

menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

const isMobile = () => window.matchMedia('(max-width: 800px)').matches;
const resourceFor = (element) => (
  isMobile() && element.dataset.srcMobile
    ? element.dataset.srcMobile
    : element.dataset.src
);

const loadDeferredImage = (image) => {
  if (!image || image.src || !image.dataset.src) return;
  image.src = resourceFor(image);
};

const loadDeferredGroup = (container) => {
  container?.querySelectorAll('.deferred-panel-media').forEach(loadDeferredImage);
};

const revealElements = [...document.querySelectorAll('.reveal')];
revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
  if (element.getBoundingClientRect().top > window.innerHeight * .9) {
    element.classList.add('will-reveal');
  }
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 8% 0px' });

  revealElements.filter((element) => element.classList.contains('will-reveal'))
    .forEach((element) => revealObserver.observe(element));

  const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadDeferredImage(entry.target);
      mediaObserver.unobserve(entry.target);
    });
  }, { rootMargin: '260px 0px' });
  document.querySelectorAll('.lazy-media').forEach((image) => mediaObserver.observe(image));

  const backgroundObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const url = isMobile() && entry.target.dataset.bgMobile
        ? entry.target.dataset.bgMobile
        : entry.target.dataset.bg;
      if (url) entry.target.style.setProperty('--lazy-bg', `url("${url}")`);
      backgroundObserver.unobserve(entry.target);
    });
  }, { rootMargin: '260px 0px' });
  document.querySelectorAll('.lazy-bg').forEach((element) => backgroundObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
  document.querySelectorAll('.lazy-media').forEach(loadDeferredImage);
  document.querySelectorAll('.lazy-bg').forEach((element) => {
    const url = isMobile() && element.dataset.bgMobile ? element.dataset.bgMobile : element.dataset.bg;
    if (url) element.style.setProperty('--lazy-bg', `url("${url}")`);
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();

const natureCard = document.querySelector('.card-nature');
const therapyPanel = document.querySelector('#natural-therapy');
const therapyClose = document.querySelector('.therapy-close');
const therapyPages = [...document.querySelectorAll('.therapy-page')];
const therapyDots = [...document.querySelectorAll('.therapy-dots button')];
const therapyPrev = document.querySelector('.therapy-prev');
const therapyNext = document.querySelector('.therapy-next');
const therapyEnter = document.querySelector('.therapy-enter');
const therapyCount = document.querySelector('.therapy-count b');
let therapyPage = 0;

const showTherapyPage = (page) => {
  therapyPage = (page + therapyPages.length) % therapyPages.length;
  therapyPages.forEach((item, index) => item.classList.toggle('is-active', index === therapyPage));
  therapyDots.forEach((dot, index) => dot.classList.toggle('is-active', index === therapyPage));
  therapyCount.textContent = String(therapyPage + 1).padStart(2, '0');
  loadDeferredGroup(therapyPages[therapyPage]);
};

const setTherapyOpen = (open) => {
  therapyPanel.classList.toggle('is-open', open);
  therapyPanel.setAttribute('aria-hidden', String(!open));
  natureCard.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('therapy-open', open);
  if (open) {
    showTherapyPage(0);
    therapyClose.focus();
  } else natureCard.focus();
};

natureCard.addEventListener('click', () => setTherapyOpen(true));
natureCard.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    setTherapyOpen(true);
  }
});
therapyClose.addEventListener('click', () => setTherapyOpen(false));
therapyEnter.addEventListener('click', () => showTherapyPage(1));
therapyPrev.addEventListener('click', () => showTherapyPage(therapyPage - 1));
therapyNext.addEventListener('click', () => showTherapyPage(therapyPage + 1));
therapyDots.forEach((dot) => dot.addEventListener('click', () => showTherapyPage(Number(dot.dataset.go))));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && therapyPanel.classList.contains('is-open')) setTherapyOpen(false);
  if (event.key === 'ArrowLeft' && therapyPanel.classList.contains('is-open')) showTherapyPage(therapyPage - 1);
  if (event.key === 'ArrowRight' && therapyPanel.classList.contains('is-open')) showTherapyPage(therapyPage + 1);
});

const visualCard = document.querySelector('.card-visual');
const visualPanel = document.querySelector('#sitang-visual');
const visualClose = document.querySelector('.visual-close');
const visualScroll = document.querySelector('.visual-scroll');
const visualTabs = [...document.querySelectorAll('.visual-tabs button')];
const visualVideo = document.querySelector('.visual-film video');
const filmFrame = document.querySelector('.film-frame');
const filmPlay = document.querySelector('.film-play');
const visualEnter = document.querySelector('.visual-enter');

const setVisualOpen = (open) => {
  visualPanel.classList.toggle('is-open', open);
  visualPanel.setAttribute('aria-hidden', String(!open));
  visualCard.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('visual-open', open);
  if (open) {
    loadDeferredGroup(visualPanel.querySelector('.visual-cover'));
    visualScroll.scrollTop = 0;
    visualClose.focus();
  } else {
    visualVideo.pause();
    visualCard.focus();
  }
};

const openVisualFromCard = () => setVisualOpen(true);
visualCard.addEventListener('click', openVisualFromCard);
visualCard.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openVisualFromCard();
  }
});
visualClose.addEventListener('click', () => setVisualOpen(false));
visualEnter.addEventListener('click', () => {
  loadDeferredGroup(document.querySelector('#visual-illustration'));
  document.querySelector('#visual-illustration').scrollIntoView({ behavior: 'smooth' });
});
visualTabs.forEach((tab) => tab.addEventListener('click', () => {
  if (tab.dataset.visualGo === 'illustration') {
    loadDeferredGroup(document.querySelector('#visual-illustration'));
  } else if (!visualVideo.poster) {
    visualVideo.poster = visualVideo.dataset.poster;
  }
  document.querySelector(`#visual-${tab.dataset.visualGo}`).scrollIntoView({ behavior: 'smooth' });
}));
visualScroll.addEventListener('scroll', () => {
  const filmTop = document.querySelector('#visual-film').offsetTop;
  const inFilm = visualScroll.scrollTop > filmTop - window.innerHeight * .45;
  if (visualScroll.scrollTop > document.querySelector('#visual-illustration').offsetTop - window.innerHeight) {
    loadDeferredGroup(document.querySelector('#visual-illustration'));
  }
  if (inFilm && !visualVideo.poster) visualVideo.poster = visualVideo.dataset.poster;
  visualTabs.forEach((tab) => tab.classList.toggle('is-active', (tab.dataset.visualGo === 'film') === inFilm));
});
filmPlay.addEventListener('click', async () => {
  if (!visualVideo.src) {
    visualVideo.src = visualVideo.dataset.videoSrc;
    visualVideo.controls = true;
    visualVideo.load();
  }
  filmFrame.classList.add('is-playing');
  try {
    await visualVideo.play();
  } catch {
    filmFrame.classList.remove('is-playing');
  }
});
visualVideo.addEventListener('error', () => filmFrame.classList.remove('is-playing'));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && visualPanel.classList.contains('is-open')) setVisualOpen(false);
});

const productCard = document.querySelector('.card-product');
const productsPanel = document.querySelector('#ecology-products');
const productsClose = document.querySelector('.products-close');
const productsPages = [...document.querySelectorAll('.products-page')];
const productsDots = [...document.querySelectorAll('.products-dots button')];
const productsPrev = document.querySelector('.products-prev');
const productsNext = document.querySelector('.products-next');
const productsEnter = document.querySelector('.products-enter');
const productsCount = document.querySelector('.products-count b');
let productPage = 0;

const showProductPage = (page) => {
  productPage = (page + productsPages.length) % productsPages.length;
  productsPages.forEach((item, index) => item.classList.toggle('is-active', index === productPage));
  productsDots.forEach((dot, index) => dot.classList.toggle('is-active', index === productPage));
  productsCount.textContent = String(productPage + 1).padStart(2, '0');
  loadDeferredGroup(productsPages[productPage]);
};

const setProductsOpen = (open) => {
  productsPanel.classList.toggle('is-open', open);
  productsPanel.setAttribute('aria-hidden', String(!open));
  productCard.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('products-open', open);
  if (open) {
    showProductPage(0);
    productsClose.focus();
  } else productCard.focus();
};

productCard.addEventListener('click', () => setProductsOpen(true));
productCard.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    setProductsOpen(true);
  }
});
productsClose.addEventListener('click', () => setProductsOpen(false));
productsEnter.addEventListener('click', () => showProductPage(1));
productsPrev.addEventListener('click', () => showProductPage(productPage - 1));
productsNext.addEventListener('click', () => showProductPage(productPage + 1));
productsDots.forEach((dot) => dot.addEventListener('click', () => showProductPage(Number(dot.dataset.productGo))));
document.addEventListener('keydown', (event) => {
  if (!productsPanel.classList.contains('is-open')) return;
  if (event.key === 'Escape') setProductsOpen(false);
  if (event.key === 'ArrowLeft') showProductPage(productPage - 1);
  if (event.key === 'ArrowRight') showProductPage(productPage + 1);
});
