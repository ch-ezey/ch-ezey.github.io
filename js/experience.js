/* ==========================================================================
   experience.js: builds the Save data screen
   --------------------------------------------------------------------------
   Card layout on desktop (see css/screens/experience.css):

     ┌──────────────── JOBS[0] (full width, .wide) ────────────────┐
     ├───── JOBS[1] ─────┬───── JOBS[2] ─────┬──── Education ─────┤

   This screen also has a .compact three-column layout, which js/fit.js
   switches to when the normal layout is much too tall for the window.
   ========================================================================== */

import { JOBS, EDUCATION } from "./data.js";
import { el, escapeHtml, chipList, bulletList } from "./utils.js";
import { setCompactLayout } from "./fit.js";

/* One job card. span is "s6" (full width) or "s3" (a third);
   extra is "wide" (bullets in two columns), "tall" or nothing. */
function jobCard(job, span, extra) {
  return el("article", "save " + span + (extra ? " " + extra : ""),
    `<header><h3>${escapeHtml(job.title)}</h3><span class="when">${escapeHtml(job.when)}</span><p class="role">${escapeHtml(job.role)}</p></header>` +
    bulletList(job.bullets, extra === "wide" ? "cols" : "") +
    (job.skills.length ? chipList(job.skills) : ""));
}

/* All education entries stacked in one card. */
function educationCard() {
  const entries = EDUCATION.map((e) =>
    `<div class="sub"><h4>${escapeHtml(e.title)}</h4><p>${escapeHtml(e.role)}</p><span class="when">${escapeHtml(e.when)}</span>` +
    (e.description ? `<p>${escapeHtml(e.description)}</p>` : "") +
    "</div>").join("");
  return el("article", "save s3", "<header><h3>Education</h3></header>" + entries);
}

export function renderExperience() {
  const saves = document.getElementById("saves");
  saves.appendChild(jobCard(JOBS[0], "s6", "wide"));
  saves.appendChild(jobCard(JOBS[1], "s3", "tall"));
  saves.appendChild(jobCard(JOBS[2], "s3"));
  saves.appendChild(educationCard());

  setCompactLayout("s-experience", (on) => saves.classList.toggle("compact", on));
}
