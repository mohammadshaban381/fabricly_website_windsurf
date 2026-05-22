/**
 * Partial loader.
 *
 * Usage in any HTML page:
 *   <div data-include="navbar"></div>
 *   <div data-include="footer"></div>
 *
 * Fetches /partials/<name>.html and injects it in place. After all partials
 * are loaded, initializers (e.g. initNavbar) are run.
 */

import { initNavbar } from './components/navbar.js';
import { initFooter } from './components/footer.js';
import { initFaqAccordion } from './components/faq-accordion.js';
import { initTabs } from './components/tabs.js';

const INITIALIZERS = {
  navbar: initNavbar,
  footer: initFooter,
  // Section partials that include interactive widgets
  'sections/faq': initFaqAccordion,
};

// Always-on initializers — for components that exist directly in page markup
// (e.g. inline FAQ accordions, tab groups).
const GLOBAL_INITIALIZERS = [initFaqAccordion, initTabs];

async function loadPartial(slot) {
  const name = slot.getAttribute('data-include');
  if (!name) return;
  try {
    const res = await fetch(`/partials/${name}.html`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    slot.outerHTML = await res.text();
  } catch (err) {
    console.error(`[components] Failed to load partial "${name}":`, err);
  }
  return name;
}

export async function mountPartials(root = document) {
  const slots = Array.from(root.querySelectorAll('[data-include]'));
  const names = await Promise.all(slots.map(loadPartial));
  // Run initializers for the partials we loaded
  new Set(names.filter(Boolean)).forEach((name) => {
    INITIALIZERS[name]?.(document);
  });
  // Run always-on initializers (handles inline components in pages)
  GLOBAL_INITIALIZERS.forEach((fn) => fn(document));
}
