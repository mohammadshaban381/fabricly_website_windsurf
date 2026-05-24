const PARTIALS = {
  'site-header': 'partials/navbar.html',
  'site-certified': 'partials/certified.html',
  'site-cta': 'partials/cta.html',
  'site-footer': 'partials/footer.html',
};

async function loadPartial(slot) {
  const name = slot.dataset.component;
  const url = PARTIALS[name];
  if (!url) return;

  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  const html = await response.text();
  slot.outerHTML = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<\/script>/g, '');
}

function currentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function markActiveLinks(root = document) {
  const page = currentPage();
  root.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href').split('#')[0].split('/').pop() || 'index.html';
    if (href === page) link.setAttribute('aria-current', 'page');
  });
}

function setMobileMenu(open) {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const check = document.querySelector('.nav-check');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !menu) return;

  if (check) check.checked = open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  if (open) nav?.classList.remove('is-hidden');
}

if (typeof window !== 'undefined') {
  window.toggleMobileMenu = () => {
    const toggle = document.querySelector('.nav-toggle');
    setMobileMenu(toggle?.getAttribute('aria-expanded') !== 'true');
  };
}

function initNav(root = document) {
  const nav = root.querySelector('.site-nav');
  const toggle = root.querySelector('.nav-toggle');
  const check = root.querySelector('.nav-check');

  check?.addEventListener('change', () => setMobileMenu(check.checked));
  toggle?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setMobileMenu(!check?.checked);
  });

  const menu = root.querySelector('.mobile-menu');
  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMobileMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMobileMenu(false);
  });

  document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('menu-open')) return;
    if (nav?.contains(event.target)) return;
    setMobileMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 1024px)').matches) setMobileMenu(false);
  });

  let lastScrollY = window.scrollY;
  const onScroll = () => {
    if (!nav) return;

    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const movedEnough = Math.abs(currentScrollY - lastScrollY) > 6;

    nav.classList.toggle('is-scrolled', currentScrollY > 4);
    if (movedEnough) {
      nav.classList.toggle('is-hidden', !document.body.classList.contains('menu-open') && scrollingDown && currentScrollY > nav.offsetHeight);
      lastScrollY = currentScrollY;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initFooter(root = document) {
  const year = root.querySelector('#footer-year');
  if (year) year.textContent = String(new Date().getFullYear());
}

function initTabs(root = document) {
  const tabs = Array.from(root.querySelectorAll('.tabs [role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  if (!tabs.length) return;
  let activeIndex = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
  if (activeIndex < 0) activeIndex = 0;

  function scrollActiveTabIntoPlace(index) {
    const tab = tabs[index];
    const scroller = tab?.closest('.tabs');
    if (!tab || !scroller || window.matchMedia('(min-width: 641px)').matches) return;

    tab.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }

  function activate(index) {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.setAttribute('tabindex', selected ? '0' : '-1');
      const panel = panels[tabIndex];
      if (!panel) return;

      panel.classList.remove('is-entering', 'is-leaving');
      if (selected) {
        panel.hidden = false;
        panel.classList.add('is-entering');
      } else if (!panel.hidden) {
        panel.classList.add('is-leaving');
        window.setTimeout(() => {
          if (tab.getAttribute('aria-selected') === 'false') {
            panel.hidden = true;
            panel.classList.remove('is-leaving');
          }
        }, 220);
      }
    });
    activeIndex = index;
    tabs[index].focus({ preventScroll: true });
    scrollActiveTabIntoPlace(index);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        activate((index + 1) % tabs.length);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        activate((index - 1 + tabs.length) % tabs.length);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        activate(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        activate(tabs.length - 1);
      }
    });
  });
}

async function init() {
  const slots = Array.from(document.querySelectorAll('[data-component]'));
  await Promise.allSettled(slots.map(loadPartial));
  markActiveLinks();
  initNav();
  initFooter();
  initTabs();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
