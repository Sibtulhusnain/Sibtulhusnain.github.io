const toggle = document.querySelector(".motion");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const preferenceKey = "sibtulhusnain-portfolio-motion";
let requested = true;

try {
  requested = localStorage.getItem(preferenceKey) !== "off";
} catch {
  // The control still works for this visit when storage is unavailable.
}

function updateMotion() {
  const enabled = requested && !reducedMotion.matches;
  document.documentElement.dataset.motion = enabled ? "on" : "off";
  toggle.setAttribute("aria-pressed", String(enabled));
  toggle.hidden = reducedMotion.matches;
}

toggle.addEventListener("click", () => {
  requested = !requested;
  try {
    localStorage.setItem(preferenceKey, requested ? "on" : "off");
  } catch {
    // The in-memory preference still applies.
  }
  updateMotion();
});
reducedMotion.addEventListener("change", updateMotion);
updateMotion();

const root = document.documentElement;
if (root.dataset.motion === "on" && (!location.hash || location.hash === "#top")) {
  root.classList.add("opening");
  window.setTimeout(() => root.classList.remove("opening"), 1600);
}

if ("IntersectionObserver" in window) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveal.unobserve(entry.target);
      if (root.dataset.motion === "on") {
        entry.target.classList.add("section-enter");
        entry.target.addEventListener("animationend", () => {
          entry.target.classList.remove("section-enter");
        }, { once: true });
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll(
    ".work-heading, .work-toolbar, .work-grid .project, .tool-strip li, " +
    ".editorial-heading, .craft-grid article, .journey .work-heading, .timeline article, .journey-milestones, .profile-links, .contact-preview"
  ).forEach(element => reveal.observe(element));
}

const readingProgress = document.createElement("div");
readingProgress.className = "reading-progress";
readingProgress.setAttribute("aria-hidden", "true");
document.body.prepend(readingProgress);
const sectionLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = sectionLinks.map(link => document.querySelector(link.hash));
let readingFrame = 0;

function syncReadingPosition() {
  readingFrame = 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
  readingProgress.style.setProperty("--page-progress", fraction);
  let active = -1;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= 145) active = index;
  });
  if (fraction >= .995) active = sections.length - 1;
  sectionLinks.forEach((link, index) => {
    if (index === active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function requestReadingSync() {
  if (!readingFrame) readingFrame = requestAnimationFrame(syncReadingPosition);
}

window.addEventListener("scroll", requestReadingSync, { passive: true });
window.addEventListener("resize", requestReadingSync);
window.addEventListener("load", requestReadingSync);
syncReadingPosition();
