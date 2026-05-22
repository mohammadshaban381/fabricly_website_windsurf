/**
 * Footer behavior — auto-update copyright year and active link state.
 */
export function initFooter(root = document) {
  const footer = root.querySelector('footer');
  if (!footer) return;

  const year = footer.querySelector('#footer-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const path = window.location.pathname.replace(/\/+$/, '') || '/index.html';
  footer.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const normalized = href.startsWith('/') ? href.split('#')[0] : '';
    if (normalized === path) a.classList.add('text-[#a0863c]', 'font-medium');
  });
}
