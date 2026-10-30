/* ==========================================================================
   theme.js: the Light/Dark button in the HUD
   --------------------------------------------------------------------------
   By default the site follows the visitor's OS setting. Clicking the button
   sets <html data-theme="light|dark">, which css/theme.css uses to override it.
   ========================================================================== */

import { beep } from "./sound.js";

const root = document.documentElement;

/* Icons drawn inside the button's <svg>. The button shows the theme you'd switch TO. */
const SUN = '<circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></g>';
const MOON = '<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" fill="currentColor"/>';

/* Dark if the visitor chose dark, or if they haven't chosen and their OS is dark. */
function isDark() {
  if (root.dataset.theme) return root.dataset.theme === "dark";
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

/* Update the button's icon, label and screen-reader text. */
function updateButton() {
  const dark = isDark();
  document.getElementById("theme-ic").innerHTML = dark ? SUN : MOON;
  document.getElementById("theme-t").textContent = dark ? "Light" : "Dark";
  document.getElementById("theme").setAttribute("aria-label", "Switch to " + (dark ? "light" : "dark") + " theme");
}

export function initTheme() {
  document.getElementById("theme").addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    updateButton();
    beep(700, .06);
  });
  updateButton();
}
