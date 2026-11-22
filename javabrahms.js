
document.addEventListener("DOMContentLoaded", () => {

  const envelope = document.getElementById("envelope");
  const flap = document.getElementById("flap");
  const letter = document.getElementById("letter");
  const polaroid = document.getElementById("polaroid");
  const music = document.getElementById("music");

  // Stop if an essential element is missing
  if (!envelope || !flap || !letter || !polaroid) {
    console.error("Envelope elements could not be found.");
    return;
  }

  let isOpen = false;
  let isAnimating = false;

  const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

  // Start music after user interaction
  async function startMusic() {
    if (!music || !music.paused) return;

    try {
      await music.play();
    } catch (error) {
      console.log("Music will start after user interaction.");
    }
  }

  // OPEN ENVELOPE
  async function openEnvelope() {

    if (isAnimating || isOpen) return;

    isAnimating = true;

    envelope.setAttribute("aria-expanded", "true");
    envelope.setAttribute("aria-label", "Close the love letter");

    // Open flap
    flap.classList.add("is-open");

    await sleep(850);

    // Slide letter out
    letter.classList.add("is-out");

    await sleep(750);

    // Reveal photograph
    polaroid.classList.add("is-out");

    await sleep(1000);

    isOpen = true;
    isAnimating = false;
  }

  // CLOSE ENVELOPE
  async function closeEnvelope() {

    if (isAnimating || !isOpen) return;

    isAnimating = true;

    envelope.setAttribute("aria-expanded", "false");
    envelope.setAttribute("aria-label", "Open the love letter");

    // Hide photograph
    polaroid.classList.remove("is-out");

    await sleep(500);

    // Slide letter back inside
    letter.classList.remove("is-out");

    await sleep(850);

    // Close flap
    flap.classList.remove("is-open");

    await sleep(1000);

    isOpen = false;
    isAnimating = false;
  }

  // TOGGLE ENVELOPE
  async function toggleEnvelope() {

    if (isAnimating) return;

    startMusic();

    if (isOpen) {
      await closeEnvelope();
    } else {
      await openEnvelope();
    }
  }

  // Mouse and touch interaction
  envelope.addEventListener("click", (event) => {

    // Do not toggle when interacting with the letter
    if (event.target.closest(".letter")) return;

    toggleEnvelope();

  });

  // Keyboard interaction
  envelope.addEventListener("keydown", (event) => {

    if (event.target !== envelope) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleEnvelope();
    }

  });

  // Keep letter scrolling independent
  letter.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  letter.addEventListener("wheel", (event) => {
    event.stopPropagation();
  });

  letter.addEventListener("touchstart", (event) => {
    event.stopPropagation();
  }, { passive: true });

  // Try to start music on first interaction
  document.addEventListener("pointerdown", startMusic, {
    once: true
  });

  document.addEventListener("keydown", startMusic, {
    once: true
  });

});
