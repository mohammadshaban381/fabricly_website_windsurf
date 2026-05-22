/**
 * Tabs — accessible roving-tabindex implementation.
 * Markup contract:
 *   <div data-tabs>
 *     <div role="tablist">
 *       <button role="tab" id="tab-1" aria-controls="panel-1" aria-selected="true">…</button>
 *       …
 *     </div>
 *     <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">…</div>
 *     <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>…</div>
 *   </div>
 *
 * Keyboard: Left/Right (or Up/Down on vertical tablists) cycles, Home/End jump.
 */
export function initTabs(root = document) {
  root.querySelectorAll('[data-tabs]').forEach((wrapper) => {
    const tabs = Array.from(wrapper.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((t) => wrapper.querySelector('#' + t.getAttribute('aria-controls')));

    const select = (i) => {
      tabs.forEach((t, idx) => {
        const selected = idx === i;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        if (panels[idx]) panels[idx].hidden = !selected;
      });
      tabs[i].focus();
    };

    tabs.forEach((tab, i) => {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', (e) => { e.preventDefault(); select(i); });
      tab.addEventListener('keydown', (e) => {
        const last = tabs.length - 1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select(i === last ? 0 : i + 1); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select(i === 0 ? last : i - 1); }
        else if (e.key === 'Home') { e.preventDefault(); select(0); }
        else if (e.key === 'End')  { e.preventDefault(); select(last); }
      });
    });
  });
}
