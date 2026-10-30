/* ==========================================================================
   sound.js: menu "beep" sounds and the Sound on/off button in the HUD
   --------------------------------------------------------------------------
   Sounds are generated on the fly with the Web Audio API, so there are no
   audio files. Sound starts off; browsers only allow audio after the visitor
   has clicked something anyway.
   ========================================================================== */

let audio = null;      // created on the first beep
let soundOn = false;

/* Play a short tone. freq is the pitch in Hz, duration is in seconds.
   Does nothing while sound is off. */
export function beep(freq, duration) {
  if (!soundOn) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();   // makes the tone
    const gain = audio.createGain();        // controls the volume
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.value = .06;
    gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);   // fade out
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + duration);
  } catch (err) { /* audio not available in this browser */ }
}

/* Wire up the "Sound: off / on" button. */
export function initSound() {
  const button = document.getElementById("sound");
  button.addEventListener("click", () => {
    soundOn = !soundOn;
    button.setAttribute("aria-pressed", String(soundOn));
    button.textContent = "Sound: " + (soundOn ? "on" : "off");
    beep(880, .08);
  });
}
