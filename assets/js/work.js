const toolbar = document.querySelector(".work-toolbar");
const filterGroup = toolbar.querySelector(".work-filters");
const filters = [...filterGroup.querySelectorAll("button[data-category]")];
const search = toolbar.querySelector('input[type="search"]');
const projects = [...document.querySelectorAll(".work-grid [data-project-category]")];
const empty = document.querySelector(".work-empty");
const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cardAnimations = new Set();
let category = "all";

function stopCardMotion() {
  for (const animation of cardAnimations) animation.cancel();
  cardAnimations.clear();
}

function moveUnderline() {
  const active = filters.find(filter => filter.dataset.category === category);
  filterGroup.style.setProperty("--filter-x", `${active.offsetLeft}px`);
  filterGroup.style.setProperty("--filter-y", `${active.offsetTop + active.offsetHeight - 2}px`);
  filterGroup.style.setProperty("--filter-width", active.offsetWidth);
}

function updateWork(animate = false) {
  const previous = new Map();
  if (animate && root.dataset.motion === "on" && !reducedMotion.matches && typeof Element.prototype.animate === "function") {
    for (const project of projects) {
      if (!project.hidden) previous.set(project, project.getBoundingClientRect());
    }
  }
  stopCardMotion();
  const query = search.value.trim().toLowerCase();
  let found = 0;
  for (const project of projects) {
    const projectCategories = project.dataset.projectCategory.split(/\s+/);
    const title = project.querySelector("h3").textContent;
    const searchable = [title, ...projectCategories, project.querySelector(".project-meta p").textContent].join(" ").toLowerCase();
    const match = (category === "all" || projectCategories.includes(category)) && searchable.includes(query);
    project.hidden = !match;
    if (match) found += 1;
  }
  empty.textContent = found ? "" : "No projects match your search.";

  for (const [project, before] of previous) {
    if (project.hidden) continue;
    const after = project.getBoundingClientRect();
    const x = before.left - after.left;
    const y = before.top - after.top;
    if (Math.abs(x) < 1 && Math.abs(y) < 1) continue;
    const animation = project.animate(
      [{ transform: `translate(${x}px, ${y}px)` }, { transform: "none" }],
      { duration: 360, easing: "cubic-bezier(.22, 1, .36, 1)" }
    );
    cardAnimations.add(animation);
    animation.addEventListener("finish", () => cardAnimations.delete(animation), { once: true });
  }
}

function selectCategory(next) {
  category = next;
  for (const filter of filters) {
    filter.setAttribute("aria-pressed", String(filter.dataset.category === category));
  }
  moveUnderline();
  updateWork(true);
}

for (const filter of filters) {
  filter.addEventListener("click", () => selectCategory(filter.dataset.category));
}
search.addEventListener("input", () => updateWork(true));
document.querySelector(".work-all").addEventListener("click", () => {
  search.value = "";
  selectCategory("all");
});
updateWork();
toolbar.hidden = false;
moveUnderline();
requestAnimationFrame(() => filterGroup.classList.add("has-indicator"));

if ("ResizeObserver" in window) {
  const resize = new ResizeObserver(moveUnderline);
  resize.observe(filterGroup);
  filters.forEach(filter => resize.observe(filter));
} else {
  window.addEventListener("resize", moveUnderline);
}

new MutationObserver(() => {
  if (root.dataset.motion !== "on") stopCardMotion();
}).observe(root, { attributes: true, attributeFilter: ["data-motion"] });
