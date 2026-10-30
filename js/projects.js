/* ==========================================================================
   projects.js: builds the channel tiles on the Channels screen
   --------------------------------------------------------------------------
   One tile per project in PROJECTS (js/data.js), then grey "Empty channel"
   tiles to fill the grid. Each project tile has data-go="project-<id>";
   js/router.js sees that on click and opens the project modal.
   ========================================================================== */

import { PROJECTS } from "./data.js";
import { el, escapeHtml } from "./utils.js";
import { beep } from "./sound.js";
import { setCompactLayout } from "./fit.js";

const COLUMNS = 3;       // must match grid-template-columns in css/screens/projects.css
const TOTAL_TILES = 9;   // a full 3×3 grid on desktop

export function renderChannels() {
  const grid = document.getElementById("grid");

  PROJECTS.forEach((p) => {
    const tile = el("button", "channel " + p.colorClass,
      `<span class="kind">${escapeHtml(p.kind)}</span>` +
      `<span class="name">${escapeHtml(p.name)}</span>` +
      `<span class="sub">${escapeHtml(p.tagline)}</span>`);
    tile.type = "button";
    tile.dataset.p = p.id;                  // marks it as a real project (used by CSS and the modal)
    tile.dataset.go = "project-" + p.id;    // where the router goes on click
    tile.setAttribute("aria-label", "Open " + p.name);
    grid.appendChild(tile);
  });

  // Fill the rest of the grid with empty tiles. Ones beyond the last row that has
  // a project are marked "spare" so the compact layout can hide them.
  const filledRows = Math.ceil(PROJECTS.length / COLUMNS) * COLUMNS;
  for (let i = PROJECTS.length; i < TOTAL_TILES; i++) {
    grid.appendChild(el("div", "channel empty" + (i >= filledRows ? " spare" : ""), "Empty channel"));
  }

  // When the window is too short for the full 3×3 grid, js/fit.js turns this on
  // to drop the spare rows before it resorts to zooming out.
  setCompactLayout("s-projects", (on) => grid.classList.toggle("compact", on));

  // Little blip when hovering over a project tile (only if sound is on).
  grid.addEventListener("mouseover", (e) => { if (e.target.closest("[data-p]")) beep(520, .03); });
}
