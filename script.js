const liveTime = document.querySelector('.live-time');
const cursorDot = document.querySelector('.cursor-dot');
const cursorHalo = document.querySelector('.cursor-halo');

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

const hero = document.querySelector('.hero');

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
