/* ==========================================================================
   modal.js: the project pop-up (the "TV" screen)
   --------------------------------------------------------------------------
   This file draws the modal and opens/closes it. It doesn't decide WHEN to
   open: js/router.js calls openModal() when the route is "project-<id>"
   and closeModal() for any other route. See css/modal.css for the styling.
   ========================================================================== */

import { PROJECTS } from "./data.js";
import { escapeHtml, chipList, bulletList } from "./utils.js";

/* The desktop modal is designed at this fixed size and scaled to fit the window. */
const DESIGN_W = 1440, DESIGN_H = 869;
/* Below this window width the modal becomes a plain full-screen page instead. */
const MOBILE_BREAKPOINT = 820;

const GITHUB_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

const backdrop = document.getElementById("tvbox");
const fitBox = document.getElementById("tvfit");
const tv = document.getElementById("tv");
const app = document.querySelector(".app");

let currentIndex = 0;      // which project is showing
let returnFocusTo = null;  // the tile that opened the modal, refocused on close

/* Glossy blue Wii-style arrow. flip = true points it left. */
function arrowSvg(flip) {
  const gradId = "ag" + (flip ? 1 : 0);
  const mirror = flip ? 'transform="translate(50 0) scale(-1 1)" ' : "";
  return `<svg viewBox="0 0 50 100" aria-hidden="true"><defs><linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#7ec4f2"/></linearGradient></defs><path ${mirror}d="M8 24Q8 8 18.5 20L39.5 44.8Q44 50 39.5 55.2L18.5 80Q8 92 8 76Z" fill="url(#${gradId})" stroke="#2f8fe6" stroke-width="4.5" stroke-linejoin="round"/></svg>`;
}

/* The white panel behind the content. Its three <path>s (fill, shading, outline)
   start empty; layoutTitleTab() fills in their shape. */
const SHEET_SVG = '<svg class="sheet" viewBox="0 0 1450 835" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sg" gradientUnits="userSpaceOnUse" x1="0" y1="5" x2="0" y2="830"><stop offset="0" stop-opacity="0"/><stop offset=".4" stop-opacity="0"/><stop offset=".5" stop-opacity=".4"/><stop offset=".66" stop-opacity=".4"/></linearGradient></defs><path id="sh1" fill="#fff"/><path id="sh2" fill="url(#sg)" fill-opacity=".2"/><path id="sh3" fill="none" stroke="#8D8E8F" stroke-width="6" stroke-linejoin="round"/></svg>';

/* Fill the TV with one project's content. */
function render(index) {
  const p = PROJECTS[index];
  currentIndex = index;

  const art = p.screenshots
    ? p.screenshots.map((s) => `<img src="${s.src}" alt="${escapeHtml(s.alt)}" width="200" height="392">`).join("")
    : `<div class="cover ${p.colorClass}"><b>${escapeHtml(p.name)}</b><i>${escapeHtml(p.tagline)}</i></div>`;

  tv.innerHTML =
    SHEET_SVG +
    `<h2 class="ttl" id="tvtitle"><span>${escapeHtml(p.name)}</span></h2>` +
    `<button type="button" class="arr prev" data-step="-1" aria-label="Previous project">${arrowSvg(true)}</button>` +
    `<div class="art">${art}</div>` +
    `<div class="txt">` +
      `<p class="d">${escapeHtml(p.description)}</p>` +
      `<h3>What it does</h3>${bulletList(p.highlights, "hl")}` +
      `<h3>Built with</h3>${chipList(p.stack)}` +
      `<p class="stat">${escapeHtml(p.status)}</p>` +
    `</div>` +
    `<button type="button" class="arr next" data-step="1" aria-label="Next project">${arrowSvg(false)}</button>` +
    `<div class="foot">` +
      `<button type="button" class="pill a" data-go="projects">Back</button>` +
      `<span class="pill b off" aria-disabled="true" title="No live version published yet">Live App</span>` +
      `<a class="ib" href="${p.repo}" target="_blank" rel="noopener" aria-label="${escapeHtml(p.name)} source on GitHub">${GITHUB_ICON}</a>` +
    `</div>`;
}

/* The white panel has a tab on its top-right edge holding the project name.
   Longer names need a wider tab, so measure the title and redraw the panel's
   outline to match. All numbers are in the 1440×869 design space. */
function layoutTitleTab() {
  const title = document.getElementById("tvtitle");
  const text = title && title.querySelector("span");
  if (!text) return;

  const tabWidth = Math.max(374, Math.min(900, text.offsetWidth + 130));
  const x0 = 1445 - tabWidth - 181;   // x where the tab's sloped left edge begins

  // Outline: across the top to the tab, down the left, along the bottom, up the right,
  // then the flat top of the tab and its curved slope back down to the start.
  const d = "M" + x0 + " 5H5V830H1445V76.3226H" + (x0 + 180.91) +
    "C" + (x0 + 155.44) + " 76.3226 " + (x0 + 140.1) + " 63.81 " + (x0 + 122.28) + " 49.27" +
    "C" + (x0 + 97.55) + " 29.09 " + (x0 + 68.03) + " 5 " + x0 + " 5Z";
  ["sh1", "sh2", "sh3"].forEach((id) => document.getElementById(id).setAttribute("d", d));

  title.style.left = (x0 + 181 - 5) + "px";
  title.style.width = tabWidth + "px";
}

/* Desktop: scale the 1440×869 TV down to fit the window (never up).
   Mobile: add the .m class for the full-screen layout instead. */
function fitToWindow() {
  const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
  tv.classList.toggle("m", mobile);
  fitBox.classList.toggle("m", mobile);
  if (mobile) {
    fitBox.style.width = fitBox.style.height = "";
    tv.style.transform = "";
    return;
  }
  const scale = Math.min(1, (window.innerWidth - 24) / DESIGN_W, (window.innerHeight - 24) / DESIGN_H);
  fitBox.style.width = DESIGN_W * scale + "px";
  fitBox.style.height = DESIGN_H * scale + "px";
  tv.style.transform = "scale(" + scale + ")";
}

export function isModalOpen() {
  return backdrop.classList.contains("on");
}

/* True if a click landed on the dark area around the TV (which should close it). */
export function isBackdrop(target) {
  return target === backdrop || target === fitBox;
}

/* The id of the project `step` places away from the current one, wrapping around.
   step = 1 for next, -1 for previous. */
export function neighbourProjectId(step) {
  const n = PROJECTS.length;
  return PROJECTS[(currentIndex + step + n) % n].id;
}

/* Show the modal for project `id`. Also used to switch projects while it's already open. */
export function openModal(id) {
  render(PROJECTS.findIndex((p) => p.id === id));
  fitToWindow();
  layoutTitleTab();
  // The title width changes once the custom font loads, so measure again then.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutTitleTab);

  const wasOpen = isModalOpen();
  backdrop.classList.add("on");
  backdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");   // stop the page behind from scrolling
  app.inert = true;                        // stop keyboard focus reaching the page behind

  if (!wasOpen) {
    returnFocusTo = document.querySelector(`[data-p="${id}"]`);
    setTimeout(() => tv.focus({ preventScroll: true }), 30);
  }
}

export function closeModal() {
  if (!isModalOpen()) return;
  backdrop.classList.remove("on");
  backdrop.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
  app.inert = false;
  if (returnFocusTo) { try { returnFocusTo.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
}

export function initModal() {
  window.addEventListener("resize", fitToWindow);
}
