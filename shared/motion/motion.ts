/**
 * Shared motion runtime (no dependencies, ~2 kB).
 * See motion.css for the attribute API.
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initSplit(): void {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((element) => {
    const text = element.textContent?.trim() ?? '';
    if (!text || element.dataset.splitDone) return;
    element.dataset.splitDone = 'true';
    element.setAttribute('aria-label', text);
    element.textContent = '';
    text.split(/\s+/).forEach((word, index, words) => {
      const outer = document.createElement('span');
      outer.className = 'split-word';
      outer.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.textContent = word;
      inner.style.setProperty('--w', String(index));
      outer.append(inner);
      element.append(outer);
      if (index < words.length - 1) element.append(' ');
    });
  });
}

function initReveal(): void {
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((child, index) => {
      child.style.setProperty('--i', String(Math.min(index, 12)));
    });
  });

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-split]');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-in', 'is-done'));
    return;
  }
  // Fully clipped elements (mask/clip reveals) never report an intersection,
  // so those are triggered by observing their parent instead.
  const watched = new Map<Element, HTMLElement[]>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        for (const target of watched.get(entry.target) ?? []) {
          target.classList.add('is-in');
          window.setTimeout(() => target.classList.add('is-done'), 2200);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  targets.forEach((target) => {
    const clipped = target.dataset.reveal === 'mask' || target.dataset.reveal === 'clip';
    const anchor = (clipped && target.parentElement) || target;
    const group = watched.get(anchor) ?? [];
    group.push(target);
    watched.set(anchor, group);
    observer.observe(anchor);
  });
}

function initScrollEffects(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const progress = document.querySelector<HTMLElement>('[data-scroll-progress]');
  const parallax = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  const root = document.documentElement;
  let ticking = false;

  const update = (): void => {
    ticking = false;
    const scrollY = window.scrollY;
    header?.classList.toggle('is-scrolled', scrollY > 12);
    if (progress) {
      const max = root.scrollHeight - window.innerHeight;
      progress.style.setProperty('--progress', max > 0 ? (scrollY / max).toFixed(4) : '0');
    }
    if (reduceMotion.matches) return;
    const viewport = window.innerHeight;
    for (const element of parallax) {
      const rect = element.getBoundingClientRect();
      const current = parseFloat(element.style.getPropertyValue('--parallax-y')) || 0;
      const top = rect.top - current;
      if (top > viewport * 1.5 || top + rect.height < -viewport * 0.5) continue;
      const speed = Number(element.dataset.parallax) || 0.1;
      const offset = (top + rect.height / 2 - viewport / 2) * -speed;
      element.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
    }
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function initSpotlight(): void {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      element.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

function initMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!toggle || !menu) return;
  const label = toggle.querySelector<HTMLElement>('[data-menu-label]');

  const setOpen = (open: boolean): void => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.toggleAttribute('inert', !open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (label) label.textContent = open ? 'Закрыть' : 'Меню';
  };

  setOpen(false);
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 60em)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function initNavSpy(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const byId = new Map<string, HTMLAnchorElement>();
  for (const link of links) {
    const id = link.hash.slice(1);
    if (id && document.getElementById(id)) byId.set(id, link);
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => link.removeAttribute('aria-current'));
        byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

function initGallery(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (!dialog) return;
  const image = dialog.querySelector<HTMLImageElement>('img');
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]');
  document.querySelectorAll<HTMLButtonElement>('[data-gallery-item]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!image) return;
      image.src = button.dataset.full ?? '';
      image.alt = button.dataset.alt ?? '';
      if (caption) caption.textContent = button.dataset.alt ?? '';
      dialog.showModal();
    });
  });
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

initSplit();
initReveal();
initScrollEffects();
initSpotlight();
initMenu();
initNavSpy();
initGallery();
