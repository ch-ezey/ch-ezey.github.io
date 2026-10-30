/* ==========================================================================
   router.js: decides which screen is showing
   --------------------------------------------------------------------------
   A "route" is a string naming what's on screen:
     "home", "projects", "experience", "contact"   one of the four screens
     "project-<id>"                                the Channels screen with that
                                                   project's modal open on top

   Every way of moving around ends up calling go(route):
     - clicking anything with a data-go="..." attribute (pager dots, dock
       Mii button, tile buttons, the modal's Back button, ...)
     - the modal's prev/next arrows (data-step="-1" / "1")
     - clicking the dark backdrop around the modal
     - keyboard: Up/Down between screens; Left/Right/Escape in the modal
     - the browser's Back/Forward buttons

   The address bar always stays at the site root: the route is kept in memory
   and in the browser history, so Back/Forward still work. A #hash on arrival
   (e.g. a shared link to /#contact) is honoured once, then removed.
   ========================================================================== */

import { PROJECTS } from "./data.js";
import { el } from "./utils.js";
import { beep } from "./sound.js";
import { openModal, closeModal, isModalOpen, isBackdrop, neighbourProjectId } from "./modal.js";
import { fitActiveScreen } from "./fit.js";

/* Route name -> id of its <section class="screen"> in index.html. */
const SCREENS = { home: "s-home", projects: "s-projects", experience: "s-experience", contact: "s-contact" };

/* Pager dots, top to bottom. Also the order Up/Down arrow keys move through. */
const PAGER = [
  { route: "home", label: "About" },
  { route: "projects", label: "Projects" },
  { route: "experience", label: "Experience" },
  { route: "contact", label: "Contact" }
];

let route = "home";

/* The URL without its #hash. */
function cleanUrl() {
  try { return location.pathname + location.search; } catch (e) { return ""; }
}

/* Update the page to match a route: show the right screen, highlight the
   right pager dot, and open/close the modal. Unknown routes fall back to home. */
function show(name) {
  let screenId, pagerGroup = name, projectId = null;

  if (name.startsWith("project-") && PROJECTS.some((p) => p.id === name.slice(8))) {
    projectId = name.slice(8);
    screenId = SCREENS.projects;
    pagerGroup = "projects";
  } else if (SCREENS[name]) {
    screenId = SCREENS[name];
  } else {
    screenId = SCREENS.home;
    pagerGroup = "home";
  }

  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("on", s.id === screenId));
  document.querySelectorAll("#pager button").forEach((b) => b.setAttribute("aria-current", b.dataset.go === pagerGroup ? "true" : "false"));

  if (projectId) openModal(projectId); else closeModal();
  fitActiveScreen();   // shrink the new screen if it's too tall for the window
}

/* Navigate to a route: record it in the browser history, show it, scroll to the top. */
export function go(name) {
  if (name !== route) {
    route = name;
    try { history.pushState({ r: name }, "", cleanUrl()); } catch (e) { /* ignore */ }
  }
  show(name);
  document.getElementById("stage").scrollTop = 0;
  beep(660, .05);
}

function onClick(e) {
  const goTarget = e.target.closest("[data-go]");
  if (goTarget) { go(goTarget.dataset.go); return; }

  const stepTarget = e.target.closest("[data-step]");
  if (stepTarget) { go("project-" + neighbourProjectId(+stepTarget.dataset.step)); return; }

  if (isBackdrop(e.target)) go("projects");
}

function onKeyDown(e) {
  // While the modal is open: Escape closes it, Left/Right switch project.
  if (isModalOpen()) {
    if (e.key === "Escape") go("projects");
    else if (e.key === "ArrowRight") go("project-" + neighbourProjectId(1));
    else if (e.key === "ArrowLeft") go("project-" + neighbourProjectId(-1));
    return;
  }

  // Otherwise Up/Down move between screens, unless a button or link has focus.
  const order = PAGER.map((p) => p.route);
  const i = order.indexOf(route);
  if (i < 0 || e.target.closest("a,button,input")) return;
  if (e.key === "ArrowDown") go(order[Math.min(i + 1, order.length - 1)]);
  if (e.key === "ArrowUp") go(order[Math.max(i - 1, 0)]);
}

/* Build the pager, hook up every navigation input, and show the first screen. */
export function initRouter() {
  const pager = document.getElementById("pager");
  PAGER.forEach((p) => {
    const dot = el("button");
    dot.type = "button";
    dot.dataset.go = p.route;
    dot.setAttribute("aria-label", p.label);
    pager.appendChild(dot);
  });

  // Starting route: from the #hash if there is one, then strip the hash from the address bar.
  route = location.hash.slice(1) || "home";
  try { history.replaceState({ r: route }, "", cleanUrl()); } catch (e) { /* not available in some previews */ }

  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("popstate", (e) => { route = (e.state && e.state.r) || "home"; show(route); });
  window.addEventListener("hashchange", () => { route = location.hash.slice(1) || "home"; show(route); });

  show(route);
}
