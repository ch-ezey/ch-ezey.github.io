/* ==========================================================================
   utils.js: small helpers for building HTML from data
   ========================================================================== */

/* Create an element with an optional class and inner HTML.
   el("section", "card", "<h3>Hi</h3>") -> <section class="card"><h3>Hi</h3></section> */
export function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

/* Make text safe to drop into an HTML string. Without this, a "<" or "&" in
   the content would be read as HTML instead of shown as a character. */
export function escapeHtml(text) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
  return String(text).replace(/[&<>"]/g, (c) => entities[c]);
}

/* HTML for a row of chips (see .chips in css/components.css). */
export function chipList(items) {
  return '<ul class="chips">' + items.map((item) => `<li>${escapeHtml(item)}</li>`).join("") + "</ul>";
}

/* HTML for a plain bulleted list. */
export function bulletList(items, className) {
  const cls = className ? ` class="${className}"` : "";
  return `<ul${cls}>` + items.map((item) => `<li>${escapeHtml(item)}</li>`).join("") + "</ul>";
}
