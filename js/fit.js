/* ==========================================================================
   fit.js: shrinks the visible screen so it fits the window without scrolling
   --------------------------------------------------------------------------
   Runs whenever a screen is shown (js/router.js), the window is resized, or
   the web fonts finish loading. For the screen that's currently showing it:
     1. resets it to its normal size and layout and measures it;
     2. if it's a lot too tall and the screen has a compact layout
        (see setCompactLayout below), switches to that;
     3. if it's still too tall, finds the largest zoom at which it fits
        (never below MIN_ZOOM, so text stays readable).

   Only on desktop. On tablets and phones (MOBILE_MAX and below) content is
   stacked in one column, so scrolling is expected there and nothing is shrunk.
   ========================================================================== */

const MOBILE_MAX = 860;      // matches the 860px breakpoint used in the CSS
const MIN_ZOOM = .6;         // never shrink below 60%
const COMPACT_BELOW = .84;   // use the compact layout if the screen only fits at under 84%

/* Optional tighter layouts, by screen id. Each value is a function(on) that
   switches the layout on or off. */
const compactLayouts = {};

/* Give a screen a compact layout to try before zooming,
   e.g. setCompactLayout("s-experience", (on) => grid.classList.toggle("compact", on)). */
export function setCompactLayout(screenId, toggle) {
  compactLayouts[screenId] = toggle;
}

/* Height inside the stage (the area between the top bar and the dock). */
function availableHeight() {
  const stage = document.getElementById("stage");
  const cs = getComputedStyle(stage);
  return stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
}

/* Undo any earlier fitting so the screen can be measured at its natural size. */
function reset(screen) {
  screen.style.zoom = "";
  screen.style.width = "";
  screen.style.maxWidth = "";
  if (compactLayouts[screen.id]) compactLayouts[screen.id](false);
}

export function fitActiveScreen() {
  // Reset every screen, so one we've left doesn't stay shrunk for next time.
  document.querySelectorAll(".screen").forEach(reset);

  const screen = document.querySelector(".screen.on");
  if (!screen || window.innerWidth <= MOBILE_MAX) return;

  const available = availableHeight();
  const compact = compactLayouts[screen.id];

  if (compact && screen.offsetHeight > available && available / screen.offsetHeight < COMPACT_BELOW) compact(true);

  if (screen.offsetHeight <= available) return;

  // The screen's normal on-screen width, measured before zooming.
  const fullWidth = screen.getBoundingClientRect().width;
  // How tall the screen ends up at a given zoom can't simply be calculated:
  // widening it makes text wrap onto fewer lines, and borders and text snap to
  // whole pixels. So try zoom levels and measure, halving the gap each time
  // (a binary search), to find the largest zoom that still fits.
  const fits = (zoom) => {
    zoomTo(screen, zoom, fullWidth, available);
    return screen.getBoundingClientRect().height <= available;   // size on screen, after zoom
  };
  let best = MIN_ZOOM;          // used even if nothing fits, so text stays readable
  if (fits(MIN_ZOOM)) {
    let low = MIN_ZOOM, high = 1;
    for (let step = 0; step < 7; step++) {   // 7 halvings: accurate to about half a percent
      const mid = (low + high) / 2;
      if (fits(mid)) low = mid; else high = mid;
    }
    best = low;
  }
  zoomTo(screen, best, fullWidth, available);
}

/* Zoom the screen out. Pixel widths are scaled by zoom (a 1000px box at 50% zoom
   shows as 500px), so the width is set in pixels rather than percent; browsers
   don't all treat percentages under zoom the same way. */
function zoomTo(screen, zoom, fullWidth, available) {
  screen.style.zoom = zoom.toFixed(3);
  screen.style.maxWidth = "none";

  // Widened: fullWidth / zoom px shows on screen as exactly fullWidth, so the
  // zoomed-out screen still fills the same width as before.
  const widened = (fullWidth / zoom) + "px";
  screen.style.width = widened;

  // That works for text, which reflows into fewer lines when wider. But content
  // with a fixed shape (like the channel tiles) just grows taller when wider,
  // cancelling out the zoom. If it doesn't fit, try the normal layout shrunk
  // down instead (narrower, centred) and keep whichever is shorter.
  const widenedHeight = screen.getBoundingClientRect().height;
  if (widenedHeight > available) {
    screen.style.width = fullWidth + "px";
    if (screen.getBoundingClientRect().height >= widenedHeight) screen.style.width = widened;
  }
}

export function initFit() {
  // Re-fit whenever the stage changes size: window resizes, and also the top bar
  // growing when its pixel font arrives.
  if (window.ResizeObserver) new ResizeObserver(fitActiveScreen).observe(document.getElementById("stage"));
  else window.addEventListener("resize", fitActiveScreen);

  // Web fonts change text size once they load, and they arrive at different
  // times (Google Fonts only downloads a font once the page uses it), so
  // re-fit each time a batch of fonts finishes loading.
  if (document.fonts) {
    document.fonts.addEventListener("loadingdone", fitActiveScreen);
    document.fonts.ready.then(fitActiveScreen);
  }
}
