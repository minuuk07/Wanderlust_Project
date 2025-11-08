// public/js/filters.js
document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const raw = (filter.dataset.category || "").trim();
      if (!raw) return;
      const category = encodeURIComponent(raw.toLowerCase());
      const baseUrl = window.location.origin; // dynamic base
      window.location.href = `${baseUrl}/filter/${category}`;
    });
  });
});
