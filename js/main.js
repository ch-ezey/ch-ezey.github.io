/* ==========================================================================
   main.js: starting point for all the JavaScript
   --------------------------------------------------------------------------
   index.html loads only this file. It imports each part of the site and
   starts them in order. Each part lives in its own file:

     data.js        all the text content (projects, jobs, contacts...)
     utils.js       small HTML-building helpers
     home.js        skill cards on the Home screen
     projects.js    channel tiles on the Channels screen
     experience.js  cards on the Save data screen
     fit.js         shrinks the visible screen to fit the window (desktop)
     contact.js     slot carousel and speech bubble on the Contact screen
     modal.js       the project pop-up
     router.js      which screen is showing, and all navigation input
     theme.js       Light/Dark button
     sound.js       Sound button and beeps
     clock.js       time and date in the HUD
   ========================================================================== */

import { renderSkills } from "./home.js";
import { renderChannels } from "./projects.js";
import { renderExperience } from "./experience.js";
import { initFit } from "./fit.js";
import { initContact } from "./contact.js";
import { initModal } from "./modal.js";
import { initRouter } from "./router.js";
import { initTheme } from "./theme.js";
import { initSound } from "./sound.js";
import { startClock } from "./clock.js";

// 1. Build the parts of the page that come from data.js.
renderSkills();
renderChannels();
renderExperience();
initContact();

// 2. Hook up the HUD and the modal.
initSound();
initTheme();
startClock();
initModal();
initFit();

// 3. Last, so everything above exists: show the first screen.
initRouter();
