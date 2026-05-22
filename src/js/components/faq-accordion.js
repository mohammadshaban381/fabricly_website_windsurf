/**
 * FAQ Accordion
 * - Uses native <details>/<summary> (so it works without JS)
 * - With JS: smooth open/close animation + optional single-open mode
 *   (set data-faq-single on the wrapping list)
 */

const DURATION = 220; // ms

function animate(detail, opening) {
  const content = detail.querySelector('.faq-content');
  if (!content) return;

  const start = content.offsetHeight;
  if (opening) detail.open = true;

  // After toggling, measure and animate
  requestAnimationFrame(() => {
    const end = opening ? content.scrollHeight : 0;
    content.style.overflow = 'hidden';
    content.style.height = `${start}px`;
    content.style.transition = `height ${DURATION}ms ease`;
    requestAnimationFrame(() => {
      content.style.height = `${end}px`;
    });
    setTimeout(() => {
      content.style.height = '';
      content.style.overflow = '';
      content.style.transition = '';
      if (!opening) detail.open = false;
    }, DURATION);
  });
}

export function initFaqAccordion(root = document) {
  root.querySelectorAll('[data-faq]').forEach((list) => {
    const single = list.hasAttribute('data-faq-single');
    const items = Array.from(list.querySelectorAll('details.faq-item'));

    items.forEach((detail) => {
      const summary = detail.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', (e) => {
        e.preventDefault();
        const willOpen = !detail.open;

        if (single && willOpen) {
          items.forEach((other) => {
            if (other !== detail && other.open) animate(other, false);
          });
        }
        animate(detail, willOpen);
      });
    });
  });
}
