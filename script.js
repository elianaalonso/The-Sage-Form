// ── Loader ──
(function () {
  const screen = document.getElementById('loaderScreen');
  const fill   = document.getElementById('loaderFill');
  const percent = document.getElementById('loaderPercent');
  const wipe   = document.getElementById('loaderWipe');
  if (!screen || !fill || !wipe) return;

  document.body.style.overflow = 'hidden';
  fill.style.width = '0%';
  if (percent) {
    percent.textContent = '0%';
  }

  let current    = 0;
  let target     = 0;
  let pageLoaded = false;

  // Fases de progreso simulado
  const phases = [
    { delay: 280,  val: 8 },
    { delay: 520,  val: 18 },
    { delay: 780,  val: 34 },
    { delay: 1080, val: 52 },
    { delay: 1380, val: 68 },
    { delay: 1720, val: 82 },
    { delay: 2100, val: 90 },
  ];
  phases.forEach(({ delay, val }) => {
    setTimeout(() => { if (!pageLoaded) target = val; }, delay);
  });

  // Animación suave con easing exponencial
  function tick() {
    if (Math.abs(target - current) > 0.15) {
      current += (target - current) * 0.055;
      fill.style.width = current.toFixed(2) + '%';
      if (percent) {
        percent.textContent = `${Math.max(0, Math.min(100, Math.round(current)))}%`;
      }
    }
    if (!pageLoaded || current < 99.5) {
      requestAnimationFrame(tick);
    } else {
      fill.style.width = '100%';
      if (percent) {
        percent.textContent = '100%';
      }
      setTimeout(() => wipe.classList.add('reveal'), 200);
      setTimeout(() => {
        screen.remove();
        document.body.style.overflow = '';
      }, 1100);
    }
  }
  requestAnimationFrame(tick);

  const minDisplay = 2200;
  const startTime  = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const wait    = Math.max(0, minDisplay - elapsed);
    setTimeout(() => {
      pageLoaded = true;
      target = 100;
    }, wait);
  });
})();

const liveTime = document.querySelector('.live-time');
const cursorDot = document.querySelector('.cursor-dot');
const cursorHalo = document.querySelector('.cursor-halo');
const progressFill = document.querySelector('.page-progress-fill');
const footerYear = document.querySelector('#footer-year');

if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}

if (liveTime) {
  const formatter = new Intl.DateTimeFormat('es-UY', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const updateTime = () => {
    liveTime.textContent = formatter.format(new Date());
  };

  updateTime();
  window.setInterval(updateTime, 1000);
}

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (finePointer && cursorDot && cursorHalo) {
  const cursorState = {
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.5,
    rafId: null
  };

  const renderCursor = () => {
    const transform = `translate3d(${cursorState.targetX}px, ${cursorState.targetY}px, 0)`;
    cursorDot.style.transform = transform;
    cursorHalo.style.transform = transform;
    cursorState.rafId = null;
  };

  const queueCursorRender = () => {
    if (cursorState.rafId !== null) {
      return;
    }
    cursorState.rafId = window.requestAnimationFrame(renderCursor);
  };

  window.addEventListener('pointermove', (event) => {
    cursorState.targetX = event.clientX;
    cursorState.targetY = event.clientY;
    document.body.classList.add('cursor-ready');
    queueCursorRender();
  }, { passive: true });

  window.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) {
      document.body.classList.remove('cursor-ready');
    }
  });
}

if (progressFill) {
  const updateProgress = () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
    progressFill.style.transform = `scaleX(${progress})`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  window.addEventListener('load', updateProgress);
}

const hero = document.querySelector('.hero');
const aboutSection = document.querySelector('.about');
const aboutStorySteps = document.querySelectorAll('.about-story-step');
const aboutProgressDots = document.querySelectorAll('.about-progress-dot');
const aboutFocusValue = document.querySelector('.about-focus-value');
const snapSections = document.querySelectorAll('.snap-section');
const navLinks = document.querySelectorAll('.top-nav a');
const workLinks = document.querySelectorAll('.work-line-link');
const workReelFrame = document.querySelector('.work-reel-frame');
const workReelLabel = document.querySelector('.work-reel-label');
const signatureCta = document.querySelector('.signature-cta');
const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');
const processSteps = document.querySelectorAll('.process-step');
const processFocusValue = document.querySelector('.process-focus-value');
const serviceStrips = document.querySelectorAll('.service-strip');
const servicesFocusValue = document.querySelector('.services-focus-value');

let contactStatusTimeoutId = null;

const setContactStatus = (message, tone = null, autoClearMs = 0) => {
  if (!contactStatus) {
    return;
  }

  if (contactStatusTimeoutId) {
    window.clearTimeout(contactStatusTimeoutId);
    contactStatusTimeoutId = null;
  }

  contactStatus.classList.remove('is-success', 'is-error');
  if (tone) {
    contactStatus.classList.add(tone);
  }

  contactStatus.textContent = message;

  if (autoClearMs > 0) {
    contactStatusTimeoutId = window.setTimeout(() => {
      contactStatus.textContent = '';
      contactStatus.classList.remove('is-success', 'is-error');
      contactStatusTimeoutId = null;
    }, autoClearMs);
  }
};

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('.contact-submit');
    const formData = new FormData(contactForm);
    const action = contactForm.getAttribute('action') || 'https://formsubmit.co/thesageform@gmail.com';
    const endpoint = action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando…';
    }

    setContactStatus('Enviando…');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('request-failed');
      }

      setContactStatus('Brief enviado. Te respondo pronto.', 'is-success', 3800);

      contactForm.reset();
    } catch (_error) {
      setContactStatus('No se pudo enviar. Proba de nuevo.', 'is-error', 4200);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar brief';
      }
    }
  });
}

if (serviceStrips.length) {
  const setActiveService = (activeService) => {
    serviceStrips.forEach((service) => {
      service.classList.toggle('is-active', service === activeService);
    });

    if (servicesFocusValue && activeService?.dataset.service) {
      servicesFocusValue.textContent = activeService.dataset.service;
    }
  };

  const initialService = document.querySelector('.service-strip.is-active') || serviceStrips[0];
  if (initialService) {
    setActiveService(initialService);
  }

  const servicesObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveService(entry.target);
        }
      });
    },
    {
      threshold: 0.65,
      rootMargin: '-18% 0px -28% 0px'
    }
  );

  serviceStrips.forEach((service) => servicesObserver.observe(service));
}

if (processSteps.length) {
  const setActiveProcessStep = (activeStep) => {
    processSteps.forEach((step) => {
      step.classList.toggle('is-active', step === activeStep);
    });

    if (processFocusValue && activeStep?.dataset.phase) {
      processFocusValue.textContent = activeStep.dataset.phase;
    }
  };

  const initialProcessStep = document.querySelector('.process-step.is-active') || processSteps[0];
  if (initialProcessStep) {
    setActiveProcessStep(initialProcessStep);
  }

  const processObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveProcessStep(entry.target);
        }
      });
    },
    {
      threshold: 0.6,
      rootMargin: '-20% 0px -28% 0px'
    }
  );

  processSteps.forEach((step) => processObserver.observe(step));
}

if (aboutSection && aboutStorySteps.length) {
  const setActiveStoryStep = (activeStep) => {
    aboutStorySteps.forEach((step, index) => {
      const isActive = step === activeStep;
      step.classList.toggle('is-active', isActive);

      if (aboutProgressDots[index]) {
        aboutProgressDots[index].classList.toggle('is-active', isActive);
      }
    });

    if (aboutFocusValue && activeStep?.dataset.focus) {
      aboutFocusValue.textContent = activeStep.dataset.focus;
    }
  };

  const initialStep = document.querySelector('.about-story-step.is-active') || aboutStorySteps[0];
  if (initialStep) {
    setActiveStoryStep(initialStep);
  }

  const storyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveStoryStep(entry.target);
        }
      });
    },
    {
      threshold: 0.62,
      rootMargin: '-18% 0px -28% 0px'
    }
  );

  aboutStorySteps.forEach((step) => storyObserver.observe(step));
}

if (snapSections.length) {
  let parallaxRaf = null;
  const updateSectionParallax = () => {
    const viewportCenter = window.innerHeight * 0.5;

    snapSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height * 0.5;
      const normalized = (sectionCenter - viewportCenter) / window.innerHeight;
      const drift = Math.max(-18, Math.min(18, normalized * -20));
      section.style.setProperty('--drift', drift.toFixed(2));
    });
    parallaxRaf = null;
  };

  const queueParallax = () => {
    if (parallaxRaf === null) {
      parallaxRaf = requestAnimationFrame(updateSectionParallax);
    }
  };

  updateSectionParallax();
  window.addEventListener('scroll', queueParallax, { passive: true });
  window.addEventListener('resize', queueParallax);
}

if (workLinks.length && workReelFrame && workReelLabel) {
  const workReelImage = workReelFrame.querySelector('.work-reel-image');

  const reelImages = {
    'mood-a': 'assets/images/case-consultora-hero.svg',
    'mood-b': 'assets/images/case-dharma/dharma-desktop-hero.png',
    'mood-c': 'assets/images/case-portfolio-hero.svg'
  };

  const setReelState = (tone, label) => {
    workReelFrame.classList.remove('mood-a', 'mood-b', 'mood-c');
    workReelFrame.classList.add(tone || 'mood-a');
    workReelLabel.textContent = label || 'Explorá una dirección';
    if (workReelImage && reelImages[tone]) {
      workReelImage.src = reelImages[tone];
    }
  };

  workLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      setReelState(link.dataset.reel, link.dataset.preview);
    });

    link.addEventListener('focus', () => {
      setReelState(link.dataset.reel, link.dataset.preview);
    });

    link.addEventListener('mouseleave', () => {
      setReelState('mood-a', 'Explorá una dirección');
    });

    link.addEventListener('blur', () => {
      setReelState('mood-a', 'Explorá una dirección');
    });
  });
}

// ─── WORK DRAWER ───────────────────────────────────────────────

const workDrawer = document.querySelector('.work-drawer');
const workDrawerOverlay = document.querySelector('.work-drawer-overlay');
const workDrawerClose = document.querySelector('.work-drawer-close');
const workDrawerHeroImage = document.querySelector('.work-drawer-hero-image');
const workDrawerThumbs = document.querySelector('.work-drawer-thumbs');

const createGallery = (baseSeed) => ([
  {
    label: 'Home',
    image: `assets/images/${baseSeed}-hero.svg`,
    alt: 'Vista principal del proyecto'
  },
  {
    label: 'Mobile',
    image: `assets/images/${baseSeed}-mobile.svg`,
    alt: 'Vista mobile del proyecto'
  },
  {
    label: 'Detail',
    image: `assets/images/${baseSeed}-detail.svg`,
    alt: 'Detalle visual del proyecto'
  }
]);

const projectDetails = {
  'mood-a': {
    tag: '01 / CONSULTORA BOUTIQUE',
    title: 'Sitio editorial para consultora boutique',
    year: '2025',
    type: 'Web design + Desarrollo',
    detail: 'Dirección visual sobria, estructura editorial y bloques de contenido pensados para vender criterio, servicio y confianza antes de la primera llamada.',
    steps: ['Arquitectura de contenido y narrativa', 'Diseño UI con jerarquía editorial', 'Desarrollo frontend y ajuste fino de interacción'],
    gallery: createGallery('case-consultora')
  },
  'mood-b': {
    tag: '02 / DHARMA YOGA INTEGRAL',
    title: 'Sitio institucional para estudio de yoga',
    year: '2026',
    type: 'Web design + Desarrollo',
    detail: 'Caso real para un estudio en Buceo: dirección visual cálida, jerarquía clara para clases y un recorrido pensado para convertir visitas en reservas.',
    steps: ['Arquitectura de secciones y propuesta de valor', 'Diseño UI inmersivo con foco en confianza', 'Implementación responsive y optimización de lectura'],
    gallery: [
      {
        label: 'Hero',
        image: 'assets/images/case-dharma/dharma-desktop-hero.png',
        alt: 'Hero principal del sitio Dharma Yoga Integral'
      },
      {
        label: 'Nosotros',
        image: 'assets/images/case-dharma/dharma-desktop-nosotros.png',
        alt: 'Sección nosotros del sitio Dharma Yoga Integral'
      },
      {
        label: 'Clases',
        image: 'assets/images/case-dharma/dharma-desktop-clases.png',
        alt: 'Sección clases del sitio Dharma Yoga Integral'
      },
      {
        label: 'Contacto',
        image: 'assets/images/case-dharma/dharma-desktop-contacto.png',
        alt: 'Sección contacto del sitio Dharma Yoga Integral'
      },
      {
        label: 'Mobile H',
        image: 'assets/images/case-dharma/dharma-mobile-hero.png',
        alt: 'Vista mobile hero del sitio Dharma Yoga Integral'
      },
      {
        label: 'Mobile C',
        image: 'assets/images/case-dharma/dharma-mobile-clases.png',
        alt: 'Vista mobile clases del sitio Dharma Yoga Integral'
      }
    ]
  },
  'mood-c': {
    tag: '03 / PORTFOLIO NARRATIVO',
    title: 'Portfolio narrativo para marca personal',
    year: '2024',
    type: 'Web design + Curation',
    detail: 'Una estructura más expresiva, con ritmo editorial y foco en voz propia. La interfaz acompaña el relato y deja que el contenido tenga presencia.',
    steps: ['Curaduría y secuencia de contenido', 'Tipografía, imagen y ritmo visual', 'Desarrollo inmersivo con foco en performance'],
    gallery: createGallery('case-portfolio')
  }
};

const setDrawerGalleryImage = (image, alt) => {
  if (!workDrawerHeroImage) {
    return;
  }

  workDrawerHeroImage.src = image;
  workDrawerHeroImage.alt = alt;
};

const renderDrawerGallery = (gallery) => {
  if (!workDrawerThumbs || !workDrawerHeroImage || !gallery?.length) {
    return;
  }

  setDrawerGalleryImage(gallery[0].image, gallery[0].alt);
  workDrawerThumbs.innerHTML = gallery
    .map((item, index) => `
      <button class="work-drawer-thumb${index === 0 ? ' is-active' : ''}" type="button" data-image="${item.image}" data-alt="${item.alt}">
        <span class="work-drawer-thumb-frame">
          <img src="${item.image}" alt="" loading="lazy" />
        </span>
        <span class="work-drawer-thumb-label">${item.label}</span>
      </button>
    `)
    .join('');

  const thumbs = workDrawerThumbs.querySelectorAll('.work-drawer-thumb');
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach((item) => item.classList.remove('is-active'));
      thumb.classList.add('is-active');
      setDrawerGalleryImage(thumb.dataset.image, thumb.dataset.alt || 'Vista del proyecto');
    });
  });
};

const openDrawer = (reel) => {
  const data = projectDetails[reel];
  if (!data || !workDrawer) return;

  workDrawer.querySelector('.work-drawer-tag').textContent = data.tag;
  workDrawer.querySelector('.work-drawer-title').textContent = data.title;
  workDrawer.querySelector('.work-drawer-year').textContent = data.year;
  workDrawer.querySelector('.work-drawer-type').textContent = data.type;
  workDrawer.querySelector('.work-drawer-detail').textContent = data.detail;

  const stepsList = workDrawer.querySelector('.work-drawer-steps');
  stepsList.innerHTML = data.steps
    .map((s, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${s}</li>`)
    .join('');

  renderDrawerGallery(data.gallery);

  workDrawerOverlay.classList.add('is-visible');
  workDrawer.classList.add('is-open');
  document.body.classList.add('drawer-open');

  if (workDrawerClose) {
    window.setTimeout(() => workDrawerClose.focus(), 80);
  }
};

const closeDrawer = () => {
  workDrawerOverlay.classList.remove('is-visible');
  workDrawer.classList.remove('is-open');
  document.body.classList.remove('drawer-open');
};

if (workDrawer && workDrawerOverlay) {
  if (workDrawerClose) {
    workDrawerClose.addEventListener('click', closeDrawer);
  }

  workDrawerOverlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && workDrawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  document.querySelectorAll('.work-info-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      openDrawer(btn.dataset.reel);
    });
  });
}

if (signatureCta) {
  let ctaRaf = null;
  const toggleSignatureCta = () => {
    const revealAfter = window.innerHeight * 0.35;
    if (window.scrollY > revealAfter) {
      signatureCta.classList.add('is-visible');
    } else {
      signatureCta.classList.remove('is-visible');
    }
    ctaRaf = null;
  };

  const queueCtaToggle = () => {
    if (ctaRaf === null) {
      ctaRaf = requestAnimationFrame(toggleSignatureCta);
    }
  };

  toggleSignatureCta();
  window.addEventListener('scroll', queueCtaToggle, { passive: true });
  window.addEventListener('resize', queueCtaToggle);
}

if (snapSections.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  snapSections.forEach((section) => revealObserver.observe(section));

  if (navLinks.length) {
    const linkById = new Map();
    navLinks.forEach((link) => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      if (targetId) {
        linkById.set(targetId, link);
      }
    });

    const setActiveLink = (id) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const initialId = window.location.hash.replace('#', '');
    if (linkById.has(initialId)) {
      setActiveLink(initialId);
    } else {
      setActiveLink('about');
    }

    const navObserver = new IntersectionObserver(
      (entries) => {
        let topEntry = null;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (!topEntry || entry.intersectionRatio > topEntry.intersectionRatio) {
            topEntry = entry;
          }
        });

        if (topEntry && linkById.has(topEntry.target.id)) {
          setActiveLink(topEntry.target.id);
        }
      },
      {
        threshold: [0.35, 0.55, 0.75],
        rootMargin: '-18% 0px -30% 0px'
      }
    );

    snapSections.forEach((section) => navObserver.observe(section));
  }
}

if (hero) {
  const scrollCue = hero.querySelector('.scroll-cue');

  const glowState = {
    mouseX: 0,
    mouseY: 0,
    rect: null,
    cueX: 0,
    cueY: 0,
    rafId: null,
    active: false,
    nearScroll: false
  };

  const updateGlowGeometry = () => {
    glowState.rect = hero.getBoundingClientRect();
    if (scrollCue) {
      const cueRect = scrollCue.getBoundingClientRect();
      glowState.cueX = cueRect.left + cueRect.width / 2;
      glowState.cueY = cueRect.top + cueRect.height / 2;
    }
  };

  const renderGlow = () => {
    const rect = glowState.rect;
    if (!rect || rect.width === 0 || rect.height === 0) {
      glowState.rafId = null;
      return;
    }

    const x = ((glowState.mouseX - rect.left) / rect.width) * 100;
    const y = ((glowState.mouseY - rect.top) / rect.height) * 100;
    const dx = (x - 50) / 50;
    const dy = (y - 50) / 50;

    // Keep motion responsive while avoiding expensive full-surface repaint variables.
    hero.style.setProperty('--px', `${(dx * 14).toFixed(2)}px`);
    hero.style.setProperty('--py', `${(dy * 10).toFixed(2)}px`);
    hero.style.setProperty('--fb-scale', '1.02');

    if (scrollCue) {
      const cueDistance = Math.hypot(glowState.mouseX - glowState.cueX, glowState.mouseY - glowState.cueY);
      const shouldBeNear = glowState.nearScroll
        ? cueDistance < 210
        : cueDistance < 165;
      if (shouldBeNear !== glowState.nearScroll) {
        glowState.nearScroll = shouldBeNear;
        hero.classList.toggle('is-near-scroll', shouldBeNear);
      }
    }

    glowState.rafId = null;
  };

  const queueGlowRender = () => {
    if (glowState.rafId !== null) {
      return;
    }
    glowState.rafId = window.requestAnimationFrame(renderGlow);
  };

  updateGlowGeometry();
  window.addEventListener('resize', updateGlowGeometry);
  window.addEventListener('scroll', () => {
    if (glowState.active) {
      updateGlowGeometry();
    }
  }, { passive: true });

  hero.addEventListener('mouseenter', () => {
    glowState.active = true;
    updateGlowGeometry();
  });

  hero.addEventListener('pointermove', (event) => {
    glowState.mouseX = event.clientX;
    glowState.mouseY = event.clientY;
    queueGlowRender();
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    glowState.active = false;
    hero.style.setProperty('--px', '0px');
    hero.style.setProperty('--py', '0px');
    hero.style.setProperty('--fb-scale', '1');
    glowState.nearScroll = false;
    hero.classList.remove('is-near-scroll');
  });
}
