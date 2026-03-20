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
  window.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    cursorDot.style.transform = `translate(${x}px, ${y}px)`;
    cursorHalo.style.transform = `translate(${x}px, ${y}px)`;
    document.body.classList.add('cursor-ready');
  });

  window.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) {
      document.body.classList.remove('cursor-ready');
      document.body.classList.remove('cursor-hover');
    }
  });

  const interactiveElements = document.querySelectorAll('a, button, .btn, .top-nav a, .scroll-cue');
  interactiveElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    element.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
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
const snapSections = document.querySelectorAll('.snap-section');
const navLinks = document.querySelectorAll('.top-nav a');
const workLinks = document.querySelectorAll('.work-line-link');
const workReelFrame = document.querySelector('.work-reel-frame');
const workReelLabel = document.querySelector('.work-reel-label');
const signatureCta = document.querySelector('.signature-cta');

if (snapSections.length) {
  const updateSectionParallax = () => {
    const viewportCenter = window.innerHeight * 0.5;

    snapSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height * 0.5;
      const normalized = (sectionCenter - viewportCenter) / window.innerHeight;
      const drift = Math.max(-18, Math.min(18, normalized * -20));
      section.style.setProperty('--drift', drift.toFixed(2));
    });
  };

  updateSectionParallax();
  window.addEventListener('scroll', updateSectionParallax, { passive: true });
  window.addEventListener('resize', updateSectionParallax);
}

if (workLinks.length && workReelFrame && workReelLabel) {
  const setReelState = (tone, label) => {
    workReelFrame.classList.remove('mood-a', 'mood-b', 'mood-c');
    workReelFrame.classList.add(tone || 'mood-a');
    workReelLabel.textContent = label || 'Hover on a project';
  };

  workLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      setReelState(link.dataset.reel, link.dataset.preview);
    });

    link.addEventListener('focus', () => {
      setReelState(link.dataset.reel, link.dataset.preview);
    });

    link.addEventListener('mouseleave', () => {
      setReelState('mood-a', 'Hover on a project');
    });

    link.addEventListener('blur', () => {
      setReelState('mood-a', 'Hover on a project');
    });
  });
}

if (signatureCta) {
  const toggleSignatureCta = () => {
    const revealAfter = window.innerHeight * 0.35;
    if (window.scrollY > revealAfter) {
      signatureCta.classList.add('is-visible');
    } else {
      signatureCta.classList.remove('is-visible');
    }
  };

  toggleSignatureCta();
  window.addEventListener('scroll', toggleSignatureCta, { passive: true });
  window.addEventListener('resize', toggleSignatureCta);
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

  const updateGlow = (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const dx = (x - 50) / 50;
    const dy = (y - 50) / 50;
    const px = dx * 14;
    const py = dy * 10;

    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
    hero.style.setProperty('--px', `${px}px`);
    hero.style.setProperty('--py', `${py}px`);
    hero.style.setProperty('--pyn', `${dy.toFixed(3)}`);
    hero.style.setProperty('--fb-scale', '1.02');

    if (scrollCue) {
      const cueRect = scrollCue.getBoundingClientRect();
      const cueX = cueRect.left + cueRect.width / 2;
      const cueY = cueRect.top + cueRect.height / 2;
      const cueDistance = Math.hypot(event.clientX - cueX, event.clientY - cueY);
      hero.classList.toggle('is-near-scroll', cueDistance < 180);
    }
  };

  hero.addEventListener('mousemove', updateGlow);
  hero.addEventListener('mouseleave', () => {
    hero.style.setProperty('--mx', '50%');
    hero.style.setProperty('--my', '40%');
    hero.style.setProperty('--px', '0px');
    hero.style.setProperty('--py', '0px');
    hero.style.setProperty('--pyn', '0');
    hero.style.setProperty('--fb-scale', '1');
    hero.classList.remove('is-near-scroll');
  });
}
