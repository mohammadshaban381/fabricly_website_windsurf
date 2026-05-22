/**
 * Site entrypoint.
 * Loads shared partials (navbar/footer/sections) and runs initializers.
 */
import { mountPartials } from './components.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => mountPartials());
} else {
  mountPartials();
}
