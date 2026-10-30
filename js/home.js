/* ==========================================================================
   home.js: fills in the skill cards on the Home screen
   --------------------------------------------------------------------------
   The About card itself is written directly in index.html; only the skill
   cards below it come from data (SKILLS in js/data.js).
   ========================================================================== */

import { SKILLS } from "./data.js";
import { el, escapeHtml, chipList } from "./utils.js";

export function renderSkills() {
  const container = document.getElementById("kit");
  SKILLS.forEach((group) => {
    container.appendChild(el("section", "", `<h3>${escapeHtml(group.title)}</h3>` + chipList(group.items)));
  });
}
