
const envelope = document.getElementById("envelope");
const flap = document.getElementById("flap");
const letter = document.getElementById("letter");
const polaroid = document.getElementById("polaroid");
const music = document.getElementById("music");

let isOpen = false;
let isAnimating = false;

// Delay helper
const sleep = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Start background music
async function startMusic() {
  if (!music || !music.paused) return;

  try {
    await music.play();
  } catch (error) {
    console.log("Music will start after user interaction.");
  }
}

// Open envelope
async function openEnvelope() {
  if (isAnimating || isOpen) return;

  isAnimating = true;

  // Open the flap
  flap.classList.add("is-open");
  await sleep(850);

  // Slide the letter out
  letter.classList.add("is-out");
  await sleep(750);

  // Reveal the photograph
  polaroid.classList.add("is-out");
  await sleep(1000);

  isOpen = true;
  isAnimating = false;

  envelope.setAttribute("aria-expanded", "true");
}

// Close envelope
async function closeEnvelope() {
  if (isAnimating || !isOpen) return;

  isAnimating = true;

  // Hide the photograph
  polaroid.classList.remove("is-out");
  await sleep(500);

  // Return the letter
  letter.classList.remove("is-out");
  await sleep(850);

  // Close the flap
  flap.classList.remove("is-open");
  await sleep(1000);

  isOpen = false;
  isAnimating = false;

  envelope.setAttribute("aria-expanded", "false");
}

// Toggle envelope
async function toggleEnvelope() {
  if (isAnimating) return;

  await startMusic();

  if (isOpen) {
    await closeEnvelope();
  } else {
    await openEnvelope();
  }
}

// Click envelope
envelope.addEventListener("click", (event) => {
  // Ignore clicks on the letter
  if (event.target.closest(".letter")) return;

  toggleEnvelope();
});

// Keyboard support
envelope.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleEnvelope();
  }
});

// Keep letter scrolling independent
letter.addEventListener("click", (event) => {
  event.stopPropagation();
});

// Music fallback for browser autoplay restrictions
document.addEventListener("pointerdown", startMusic, {
  once: true
});

document.addEventListener("keydown", startMusic, {
  once: true
});

// Initial accessibility state
envelope.setAttribute("aria-expanded", "false");
envelope.setAttribute("aria-label", "Open love letter");
envelope.setAttribute("role", "button");
envelope.setAttribute("tabindex", "0");
