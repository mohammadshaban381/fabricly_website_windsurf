const PARTIALS = {
  'site-header': 'partials/navbar.html',
  'site-certified': 'partials/certified.html',
  'site-cta': 'partials/cta.html',
  'site-footer': 'partials/footer.html',
  'product-catalog-grid': 'partials/sections/product-catalog.html',
  'fabric-range-grid': 'partials/sections/fabric-range.html',
  'product-faq': 'partials/sections/product-faq.html',
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

function initPolicyNav(root = document) {
  const navLinks = Array.from(root.querySelectorAll('.policy-summary a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);
  if (!navLinks.length || !sections.length) return;

  function setActive(id) {
    navLinks.forEach((link) => {
      link.setAttribute('aria-current', String(link.getAttribute('href') === `#${id}`));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').slice(1);
      window.setTimeout(() => setActive(id), 0);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) setActive(visible.target.id);
  }, {
    rootMargin: `-${Math.round(window.innerHeight * 0.18)}px 0px -60% 0px`,
    threshold: [0, 0.2, 0.5],
  });

  sections.forEach((section) => observer.observe(section));
  const initial = window.location.hash ? window.location.hash.slice(1) : sections[0].id;
  setActive(initial);
}

function initScrollTop() {
  const button = document.createElement('button');
  button.className = 'scroll-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Scroll to top');
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.5 20V6.8l-5.6 5.6-.7-.7L12 4.9l6.8 6.8-.7.7-5.6-5.6V20h-1z"/></svg>';
  document.body.append(button);

  function update() {
    button.classList.toggle('is-visible', window.scrollY > 520);
  }

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', update, { passive: true });
  update();
}

const WHATSAPP_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.54 2 2.07 6.45 2.07 11.93c0 1.75.46 3.46 1.33 4.97L2 22l5.24-1.37a10.03 10.03 0 0 0 4.8 1.22h.01c5.5 0 9.97-4.45 9.97-9.93C22.02 6.45 17.54 2 12.04 2Zm0 18.17h-.01a8.32 8.32 0 0 1-4.24-1.16l-.3-.18-3.1.81.83-3.02-.2-.31a8.2 8.2 0 0 1-1.27-4.38c0-4.55 3.72-8.25 8.3-8.25 2.21 0 4.29.86 5.86 2.42a8.18 8.18 0 0 1 2.43 5.83c0 4.55-3.72 8.24-8.3 8.24Zm4.55-6.17c-.25-.12-1.48-.73-1.71-.81-.23-.09-.4-.12-.56.12-.17.25-.65.81-.8.98-.15.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.71c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.24.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.9 2.4 1.02 2.56.12.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.16-.48-.29Z"/></svg>';

function applyWhatsAppIcons(root = document) {
  root.querySelectorAll('a[href*="wa.me"] svg').forEach((svg) => {
    svg.outerHTML = WHATSAPP_ICON;
  });
}

function initWhatsAppPrompt() {
  const float = document.querySelector('.wa-float');
  if (!float) return;
  const href = float.getAttribute('href') || 'https://wa.me/923268680669';
  float.innerHTML = WHATSAPP_ICON;

  const prompt = document.createElement('div');
  prompt.className = 'wa-prompt';
  prompt.innerHTML = `
    <button class="wa-prompt-close" type="button" aria-label="Close WhatsApp message">×</button>
    <p>Need help with fabric, MOQ, or pricing?</p>
    <small>This opens WhatsApp outside the website.</small>
    <a href="${href}" rel="noopener" target="_blank">Let's discuss your needs <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 18.3 5.7 17.6 16.2 7H8V6h10v10h-1V7.8L6.4 18.3z"/></svg></a>
  `;
  document.body.append(prompt);

  const isHome = document.body.classList.contains('home-page');
  let manuallyDismissed = false;
  let prompted = false;
  let hideTimer;

  function showPrompt(force = false) {
    if (manuallyDismissed && !force) return;
    prompted = true;
    window.clearTimeout(hideTimer);
    prompt.classList.add('is-visible');
    hideTimer = window.setTimeout(hidePrompt, 5000);
  }

  function hidePrompt() {
    window.clearTimeout(hideTimer);
    prompt.classList.remove('is-visible');
  }

  function closePrompt() {
    manuallyDismissed = true;
    hidePrompt();
  }

  function onScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    if (!isHome && !prompted && window.scrollY / scrollable >= 0.72) showPrompt();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  prompt.querySelector('.wa-prompt-close')?.addEventListener('click', closePrompt);
  float.addEventListener('mouseenter', () => showPrompt(true));
  float.addEventListener('focus', () => showPrompt(true));
  float.addEventListener('click', hidePrompt);
  if (isHome) {
    window.setTimeout(() => showPrompt(), 1400);
  } else {
    onScroll();
  }
}

function initCookieConsent() {
  const storageKey = 'fabricly_cookie_consent';
  let saved;

  try {
    saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
  } catch (error) {
    saved = null;
  }

  window.FabriclyConsent = saved || { essential: true, analytics: false, marketing: false };
  if (saved) return;

  const banner = document.createElement('section');
  banner.className = 'cookie-consent';
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = `
    <div class="cookie-consent-copy">
      <p>Fabricly uses cookies to improve the website, understand traffic, and measure future ad performance.</p>
      <a href="cookie-policy.html">Cookie details</a>
    </div>
    <form class="cookie-consent-panel" hidden>
      <label><input type="checkbox" checked disabled /> Essential</label>
      <label><input type="checkbox" name="analytics" /> Analytics</label>
      <label><input type="checkbox" name="marketing" /> Marketing</label>
    </form>
    <div class="cookie-consent-actions">
      <button class="btn btn-outline" type="button" data-cookie-action="reject">Reject all</button>
      <button class="btn btn-outline" type="button" data-cookie-action="customize">Customize</button>
      <button class="btn btn-primary" type="button" data-cookie-action="accept">Accept all</button>
    </div>
  `;
  document.body.append(banner);

  const panel = banner.querySelector('.cookie-consent-panel');
  const actions = banner.querySelector('.cookie-consent-actions');

  function saveConsent(consent) {
    window.FabriclyConsent = consent;
    localStorage.setItem(storageKey, JSON.stringify({ ...consent, savedAt: new Date().toISOString() }));
    banner.classList.add('is-hiding');
    window.setTimeout(() => banner.remove(), 220);
  }

  actions.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cookie-action]');
    if (!button) return;
    const action = button.dataset.cookieAction;

    if (action === 'customize') {
      panel.hidden = !panel.hidden;
      button.textContent = panel.hidden ? 'Customize' : 'Save choices';
      button.dataset.cookieAction = panel.hidden ? 'customize' : 'save';
      return;
    }

    if (action === 'accept') {
      saveConsent({ essential: true, analytics: true, marketing: true });
      return;
    }

    if (action === 'reject') {
      saveConsent({ essential: true, analytics: false, marketing: false });
      return;
    }

    if (action === 'save') {
      saveConsent({
        essential: true,
        analytics: Boolean(panel.elements.analytics.checked),
        marketing: Boolean(panel.elements.marketing.checked),
      });
    }
  });
}

function initContactForms(root = document) {
  root.querySelectorAll('form[data-web3forms]').forEach((form) => {
    const alert = form.querySelector('.form-alert');
    const submit = form.querySelector('button[type="submit"]');
    const requiredFields = Array.from(form.querySelectorAll('[required]'));
    const validators = {
      name: {
        test: (value) => /^[A-Za-z][A-Za-z\s.'-]{1,}$/.test(value) && /[A-Za-z].*[A-Za-z]/.test(value),
        message: 'Please enter a valid name using letters, spaces, apostrophes, hyphens, or periods.',
      },
      email: {
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value),
        message: 'Please enter a complete email address, for example name@example.com.',
      },
      phone: {
        test: (value) => {
          const digits = value.replace(/\D/g, '');
          return /^[+\d][\d\s().-]{7,}$/.test(value) && digits.length >= 8 && digits.length <= 15 && !/^(\d)\1+$/.test(digits);
        },
        message: 'Please enter a valid WhatsApp or phone number with country code or area code.',
      },
      product: {
        test: (value) => /[A-Za-z]/.test(value) && value.trim().length >= 3,
        message: 'Please describe the product type using words, not only numbers.',
      },
    };

    function showAlert(type, message) {
      if (!alert) return;
      alert.hidden = false;
      alert.className = `form-alert form-alert--${type}`;
      alert.textContent = message;
    }

    function fieldMessage(field) {
      const label = field.closest('label');
      if (!label) return null;
      let message = label.querySelector('.field-error');
      if (!message) {
        message = document.createElement('span');
        message.className = 'field-error';
        label.append(message);
      }
      return message;
    }

    function setFieldError(field, message = '') {
      const error = fieldMessage(field);
      if (!error) return;
      error.textContent = message;
      error.hidden = !message;
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function clearFieldStates() {
      requiredFields.forEach((field) => {
        field.removeAttribute('aria-invalid');
        setFieldError(field, '');
      });
    }

    function normalizeField(field) {
      if (field.dataset.validate === 'name') {
        field.value = field.value.replace(/[^A-Za-z\s.'-]/g, '').replace(/\s{2,}/g, ' ');
      }
      if (field.dataset.validate === 'phone') {
        field.value = field.value.replace(/[^\d+().\-\s]/g, '').replace(/(?!^)\+/g, '').replace(/\s{2,}/g, ' ');
      }
      if (field.dataset.validate === 'email') {
        field.value = field.value.replace(/\s/g, '').toLowerCase();
      }
    }

    function validateField(field, showMessage = true) {
      const rule = validators[field.dataset.validate];
      if (!rule || !String(field.value || '').trim()) return true;
      const valid = rule.test(String(field.value || '').trim());
      setFieldError(field, valid || !showMessage ? '' : rule.message);
      return valid;
    }

    function validate() {
      clearFieldStates();
      requiredFields.forEach(normalizeField);
      const missing = requiredFields.filter((field) => !String(field.value || '').trim());

      missing.forEach((field) => setFieldError(field, 'This field is required.'));

      if (missing.length) {
        missing[0].focus();
        showAlert('error', 'Please complete all required fields before submitting your inquiry.');
        return false;
      }

      const invalid = requiredFields.find((field) => {
        const rule = validators[field.dataset.validate];
        return rule && !validateField(field, false);
      });
      if (invalid) {
        invalid.focus();
        setFieldError(invalid, validators[invalid.dataset.validate].message);
        showAlert('error', 'Please fix the highlighted field before submitting.');
        return false;
      }
      return true;
    }

    form.addEventListener('input', (event) => {
      const field = event.target;
      if (!field?.matches?.('input, textarea')) return;
      normalizeField(field);
      if (field.matches('[required]') && String(field.value || '').trim()) setFieldError(field, '');
    });

    form.addEventListener('blur', (event) => {
      const field = event.target;
      if (!field?.matches?.('[required]')) return;
      normalizeField(field);
      if (!String(field.value || '').trim()) {
        setFieldError(field, 'This field is required.');
        return;
      }
      validateField(field, true);
    }, true);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!validate()) return;

      const originalHtml = submit?.innerHTML;
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending...';
      }
      showAlert('info', 'Sending your inquiry to Fabricly...');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Submission failed.');
        }
        form.reset();
        clearFieldStates();
        showAlert('success', 'Inquiry sent successfully. Fabricly will review your details and reply as soon as possible.');
      } catch (error) {
        showAlert('error', 'Something went wrong while sending. Please try again or message Fabricly on WhatsApp.');
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.innerHTML = originalHtml || 'Submit Inquiry';
        }
      }
    });
  });
}

async function init() {
  const slots = Array.from(document.querySelectorAll('[data-component]'));
  await Promise.allSettled(slots.map(loadPartial));
  applyWhatsAppIcons();
  markActiveLinks();
  initNav();
  initFooter();
  initTabs();
  initPolicyNav();
  initScrollTop();
  initWhatsAppPrompt();
  initCookieConsent();
  initContactForms();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
