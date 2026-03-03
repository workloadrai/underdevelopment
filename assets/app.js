window.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const body = document.body;

  const tooltipTargets = document.querySelectorAll(".tooltip-target");
  tooltipTargets.forEach((target) => {
    target.addEventListener("click", () => {
      target.classList.add("is-tooltip");
      window.setTimeout(() => {
        target.classList.remove("is-tooltip");
      }, 1400);
    });
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      body.classList.add("is-ready");
    });
  });
});
