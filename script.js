const hero = document.querySelector('.hero');

if (hero) {
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
  };

  hero.addEventListener('mousemove', updateGlow);
  hero.addEventListener('mouseleave', () => {
    hero.style.setProperty('--mx', '50%');
    hero.style.setProperty('--my', '40%');
    hero.style.setProperty('--px', '0px');
    hero.style.setProperty('--py', '0px');
  });
}
