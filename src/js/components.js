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

const FALLBACK_PARTIALS = {
  navbar: `
<header id="site-header" class="sticky top-0 z-50 w-full bg-scheme1-bg/90 backdrop-blur transition-shadow" role="banner">
  <nav class="mx-auto flex h-16 lg:h-[72px] w-full max-w-[1440px] items-center gap-4 px-page-mobile lg:gap-8 lg:px-page" aria-label="Primary">
    <a href="index.html" class="flex shrink-0 items-center" aria-label="Fabricly - Home">
      <img src="public/images/logo/fabricly-logo-transparent.png" alt="Fabricly" class="h-11 w-auto" width="120" height="44" decoding="async" />
    </a>
    <ul class="hidden flex-1 items-center justify-center gap-8 lg:flex" role="menubar">
      <li role="none"><a role="menuitem" href="index.html" class="nav-link">Home</a></li>
      <li role="none"><a role="menuitem" href="products.html" class="nav-link">Products</a></li>
      <li role="none"><a role="menuitem" href="fabric-range.html" class="nav-link">Fabric Range</a></li>
      <li role="none"><a role="menuitem" href="manufacturing-process.html" class="nav-link">Manufacturing Process</a></li>
      <li role="none"><a role="menuitem" href="about.html" class="nav-link">About Us</a></li>
      <li role="none"><a role="menuitem" href="contact.html" class="nav-link">Contact Us</a></li>
    </ul>
    <div class="ml-auto flex items-center gap-2 lg:gap-4">
      <a href="contact.html" class="btn-primary text-tiny lg:text-regular">Start Inquiry</a>
      <button type="button" id="nav-toggle" class="inline-flex h-12 w-12 items-center justify-center rounded-sm text-scheme1-text lg:hidden" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false">
        <svg class="icon-open h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        <svg class="icon-close hidden h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6" /></svg>
      </button>
    </div>
  </nav>
  <div id="mobile-menu" class="hidden border-t border-scheme1-border bg-scheme1-bg lg:hidden" role="region" aria-label="Mobile navigation">
    <ul class="flex flex-col px-page-mobile py-4">
      <li><a href="index.html" class="mobile-nav-link">Home</a></li>
      <li><a href="products.html" class="mobile-nav-link">Products</a></li>
      <li><a href="fabric-range.html" class="mobile-nav-link">Fabric Range</a></li>
      <li><a href="manufacturing-process.html" class="mobile-nav-link">Manufacturing Process</a></li>
      <li><a href="about.html" class="mobile-nav-link">About Us</a></li>
      <li><a href="contact.html" class="mobile-nav-link">Contact Us</a></li>
    </ul>
  </div>
</header>`,
  cta: `
<section class="section" aria-labelledby="cta-title">
  <div class="container-1280">
    <div class="rounded-lg border border-scheme1-border bg-scheme1-fg p-6 shadow-soft sm:p-10 lg:p-12">
      <div class="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
        <div class="flex-1 text-scheme1-text">
          <h2 id="cta-title" class="text-3xl font-bold leading-[1.2] sm:text-4xl lg:text-h3">Get your apparel manufactured at scale</h2>
          <p class="mt-6 text-regular leading-[1.5] sm:text-medium">Direct manufacturer, no middlemen, fast quotes within 24 hours.</p>
        </div>
        <a href="contact.html" class="btn-primary shrink-0">Start Inquiry</a>
      </div>
    </div>
  </div>
</section>`,
  footer: `
<footer class="bg-scheme1-bg" role="contentinfo">
  <div class="mx-auto w-full max-w-container px-page-mobile py-sec-sm lg:px-page">
    <div class="flex flex-col gap-10 lg:flex-row lg:gap-sec-md">
      <div class="flex flex-1 flex-col gap-8">
        <a href="index.html" class="inline-flex" aria-label="Fabricly - Home">
          <img src="public/images/logo/fabricly-logo-transparent.png" alt="Fabricly" class="h-16 w-auto lg:h-[92px]" width="180" height="92" />
        </a>
        <p class="text-regular leading-[1.5] text-scheme1-text">Fabricly helps apparel brands develop custom clothing with sourcing, production, and export support. Discuss your requirements, sourcing needs, or production plans with Fabricly now.</p>
        <div class="flex flex-wrap gap-4">
          <a href="contact.html" class="btn-primary">Start Your Project</a>
          <a href="https://wa.me/923268680669" target="_blank" rel="noopener" class="btn-outline">Talk To Us</a>
        </div>
      </div>
      <div class="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-3 lg:gap-4">
        <div><h2 class="footer-heading">Useful Links</h2><ul class="mt-4 flex flex-col"><li><a href="index.html" class="footer-link">Home</a></li><li><a href="about.html" class="footer-link">About us</a></li><li><a href="contact.html" class="footer-link">Contact us</a></li><li><a href="products.html" class="footer-link">Products</a></li><li><a href="fabric-range.html" class="footer-link">Fabric Range</a></li><li><a href="manufacturing-process.html" class="footer-link">Manufacturing Process</a></li></ul></div>
        <div><h2 class="footer-heading">Categories</h2><ul class="mt-4 flex flex-col"><li><a href="products.html#sportswear" class="footer-link">Sports Wear</a></li><li><a href="products.html#casual" class="footer-link">Casual Wear</a></li><li><a href="products.html#gym" class="footer-link">Gym Wear</a></li><li><a href="products.html#safety" class="footer-link">Safety Wear</a></li></ul></div>
        <div class="col-span-2 sm:col-span-1"><h2 class="footer-heading">Contact info</h2><div class="mt-4 flex flex-col gap-2 text-small leading-[1.5] text-scheme1-text"><a href="tel:+923268680669" class="hover:text-roti-dark">+92 326 8680669</a><a href="mailto:contact@fabricly.pk" class="hover:text-roti-dark">contact@fabricly.pk</a><p>W3Q4+3X3, Arafat town Block L, Karachi, Pakistan 74600</p></div></div>
      </div>
    </div>
    <div class="mt-10 flex flex-col gap-3 border-t border-scheme1-border pt-6 text-small text-scheme1-text sm:flex-row sm:items-center sm:justify-between"><p>© <span id="footer-year">2026</span> Fabricly. All rights reserved.</p><p>Karachi, Pakistan - Serving clients internationally.</p></div>
  </div>
</footer>`
};

async function loadPartial(slot) {
  const name = slot.getAttribute('data-include');
  if (!name) return;
  try {
    const res = await fetch(`partials/${name}.html`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    slot.outerHTML = await res.text();
  } catch (err) {
    if (FALLBACK_PARTIALS[name]) {
      slot.outerHTML = FALLBACK_PARTIALS[name];
    } else {
      console.error(`[components] Failed to load partial "${name}":`, err);
    }
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
