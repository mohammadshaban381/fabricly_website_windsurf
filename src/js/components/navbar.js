/**
 * Navbar behavior
 * - Mobile menu toggle (open/close, ARIA, body scroll lock)
 * - Active link highlighting based on current pathname
 * - Auto-close on link click / Escape / resize to desktop
 * - Subtle shadow on scroll
 *
 * Initialized by src/js/main.js after the navbar partial is injected.
 */

const DESKTOP_BREAKPOINT = 1024; // px (Tailwind `lg`)

export function initNavbar(root = document) {
  const header = root.querySelector('#site-header');
  if (!header) return;

  const toggle    = header.querySelector('#nav-toggle');
  const menu      = header.querySelector('#mobile-menu');
  const iconOpen  = header.querySelector('.icon-open');
  const iconClose = header.querySelector('.icon-close');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('hidden', !open);
    iconOpen?.classList.toggle('hidden', open);
    iconClose?.classList.toggle('hidden', !open);
    document.documentElement.classList.toggle('overflow-hidden', open);
  };

  const close = () => setOpen(false);

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
  });

  // Close when a link is tapped
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Close when resizing up to desktop
  let lastIsDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
  window.addEventListener('resize', () => {
    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
    if (isDesktop && !lastIsDesktop) close();
    lastIsDesktop = isDesktop;
  });

  // Highlight the active link
  const path = window.location.pathname.replace(/\/+$/, '') || '/index.html';
  header.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    const normalized = href.startsWith('/') ? href : `/${href}`;
    if (normalized === path) {
      a.setAttribute('aria-current', 'page');
      a.classList.add('is-active');
    }
  });

  // Elevation on scroll
  const onScroll = () => {
    header.classList.toggle('shadow-sm', window.scrollY > 4);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
