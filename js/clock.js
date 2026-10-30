/* ==========================================================================
   clock.js: the time and date in the top-right of the HUD
   ========================================================================== */

function pad(n) { return (n < 10 ? "0" : "") + n; }

function tick() {
  const now = new Date();
  document.getElementById("time").textContent = pad(now.getHours()) + ":" + pad(now.getMinutes());
  document.getElementById("date").textContent = now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

/* Show the time now, then refresh it every 20 seconds. */
export function startClock() {
  tick();
  setInterval(tick, 10000);
}
