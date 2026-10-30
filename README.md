# Cheta Ezenwoye | Portfolio

Static portfolio site served by GitHub Pages at https://ch-ezey.github.io

It is styled like a Nintendo console home menu: a Wii channel grid and curved
dock, Switch Joy-Con colours, a GameCube "save data" screen and NES-style pixel
labels. There is no build step or framework, just HTML, CSS and JavaScript.

## Project structure

```
index.html              Page skeleton: HUD, the four screens, dock, project modal
.nojekyll               Tells GitHub Pages to serve files as-is

assets/
  images/               Mii picture and project screenshots
  fonts/                Continuum Bold (headings and buttons)

css/                    How things look. Loaded in this order by index.html:
  theme.css             Colours and fonts as variables; light and dark theme
  base.css              Page-wide defaults, dotted background, shared headings
  layout.css            The frame: HUD (top), stage (middle), pager dots, dock (bottom)
  components.css        Reusable bits: pill buttons, round buttons, chips
  screens/
    home.css            About card and skill cards
    projects.css        Channel tile grid, per-project tile colours
    experience.css      Save data cards
    contact.css         Speech bubble and slot carousel
  modal.css             Project pop-up (the "TV")

js/                     How things behave. index.html loads only main.js.
  main.js               Starting point: runs everything below in order
  data.js               ALL the text content: skills, projects, jobs, education, contacts
  utils.js              Small helpers for building HTML
  home.js               Builds the skill cards
  projects.js           Builds the channel tiles
  experience.js         Builds the experience cards
  fit.js                Shrinks whichever screen is showing so it fits the window (desktop only)
  contact.js            Contact carousel, speech bubble, copy-to-clipboard
  modal.js              Draws and opens/closes the project pop-up
  router.js             Which screen is showing; all navigation (clicks, keys, back button)
  theme.js              Light/Dark button
  sound.js              Sound button and menu beeps
  clock.js              Time and date in the HUD
```

## How it works

- **One page, four screens.** `index.html` has four `<section class="screen">`
  elements (home, projects, experience, contact). Only the one with the class
  `on` is visible. `js/router.js` decides which one.
- **Navigation.** Any element with `data-go="<route>"` is a navigation button,
  for example `data-go="contact"`. Routes are `home`, `projects`, `experience`,
  `contact` and `project-<id>` (Channels screen with that project's modal open).
  The address bar stays at the site root, but a link like `/#contact` opens
  that screen on arrival.
- **Content comes from data.** Projects, jobs, skills and contacts are not
  written in the HTML. They live in `js/data.js`, and the other scripts turn
  them into HTML.
- **No scrolling on desktop.** After a screen is shown, and whenever the window
  is resized, `js/fit.js` checks whether the screen is taller than the space
  available. If it is, the screen is zoomed out just enough to fit, down to 60%
  at most. Before zooming, Experience tries its compact three-column layout
  and Projects hides its empty rows of tiles. Tablets and
  phones (860px wide and below) scroll normally instead.
- **Theming.** Colours are CSS variables in `css/theme.css`. Dark mode follows
  the OS, or the HUD button, which sets `<html data-theme="dark">`.

## Common edits

| I want to...               | Edit                                                          |
|----------------------------|---------------------------------------------------------------|
| Change the intro text      | The `#s-home` section in `index.html`                         |
| Add or edit a project      | `PROJECTS` in `js/data.js`, plus a colour class in `css/screens/projects.css` |
| Add or edit a job          | `JOBS` / `EDUCATION` in `js/data.js`                          |
| Change skills              | `SKILLS` in `js/data.js`                                      |
| Change contact options     | `CONTACTS` in `js/data.js`                                    |
| Change a colour            | `css/theme.css`                                               |

## Previewing locally

The JavaScript uses ES modules (`import`/`export`), which browsers won't load
from a file opened by double-clicking (`file://`). Serve the folder instead:

- VS Code: install the **Live Server** extension, then right-click
  `index.html` and choose **Open with Live Server**, or
- run `python -m http.server` in this folder and open http://localhost:8000
