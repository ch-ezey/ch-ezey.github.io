/* ==========================================================================
   contact.js: the slot carousel and speech bubble on the Contact screen
   --------------------------------------------------------------------------
   One slot per entry in CONTACTS (js/data.js). Picking a slot:
     - slides the carousel so that slot is in the middle,
     - fills the speech bubble with that contact's text,
     - shows either a link button or a "copy" button.
   Left/right arrow keys move between the real (non-empty) slots.
   ========================================================================== */

import { CONTACTS } from "./data.js";
import { el, escapeHtml } from "./utils.js";

let track, lead, main, linkBtn, copyBtn;
let selected = 0;

const isReal = (c) => Boolean(c.lead);   // empty slots only have a name

/* Select slot i. */
function pick(i) {
  const contact = CONTACTS[i];
  if (!isReal(contact)) return;
  selected = i;

  // Position every slot relative to the selected one. --o is how many slot-widths
  // left (-) or right (+) of centre it sits; the CSS turns that into a transform.
  // The modulo wraps slots around, so with 5 slots the offsets are always -2..2.
  const n = CONTACTS.length, half = Math.floor(n / 2);
  Array.from(track.children).forEach((slot, j) => {
    slot.style.setProperty("--o", ((j - i + n + half) % n) - half);
    slot.classList.toggle("sel", j === i);
    slot.setAttribute("aria-checked", String(j === i));
  });

  // Fill in the speech bubble.
  lead.textContent = contact.lead;
  main.textContent = contact.main;
  linkBtn.hidden = !contact.href;
  copyBtn.hidden = !!contact.href;
  if (contact.href) {
    linkBtn.href = contact.href;
    linkBtn.textContent = contact.linkText;
  } else {
    copyBtn.textContent = contact.copyText;
  }
}

/* Copy the text in the bubble (e.g. the email address) to the clipboard.
   If the browser refuses, select the text instead and ask the visitor to press Ctrl/Cmd+C. */
function copyToClipboard() {
  const original = CONTACTS[selected].copyText;
  function fallback() {
    const range = document.createRange();
    range.selectNodeContents(main);
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyBtn.textContent = "Press Ctrl/Cmd+C to copy";
  }
  try {
    navigator.clipboard.writeText(main.textContent).then(() => {
      copyBtn.textContent = "Copied";
      setTimeout(() => { copyBtn.textContent = original; }, 1800);
    }, fallback);
  } catch (err) { fallback(); }
}

export function initContact() {
  track = document.getElementById("track");
  lead = document.getElementById("b-lead");
  main = document.getElementById("b-main");
  linkBtn = document.getElementById("b-link");
  copyBtn = document.getElementById("b-copy");

  // Build the slots.
  CONTACTS.forEach((contact, i) => {
    const slot = el("button", "slot" + (isReal(contact) ? "" : " empty"), `<span>${escapeHtml(contact.name)}</span>`);
    slot.type = "button";
    slot.setAttribute("role", "radio");
    if (!isReal(contact)) slot.disabled = true;
    slot.addEventListener("click", () => pick(i));
    track.appendChild(slot);
  });

  copyBtn.addEventListener("click", copyToClipboard);

  // Arrow keys move between real slots. stopPropagation keeps the router's
  // own arrow-key handling (js/router.js) from also reacting.
  const lastReal = CONTACTS.filter(isReal).length - 1;
  document.getElementById("slots").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = Math.max(0, Math.min(lastReal, selected + (e.key === "ArrowRight" ? 1 : -1)));
    pick(next);
    track.children[next].focus({ preventScroll: true });
    e.stopPropagation();
  });

  pick(0);
}
