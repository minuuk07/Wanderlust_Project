// ✅ public/js/filters.js
document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.category;
      if (!category) return;

      const baseUrl = window.location.origin;
      // ✅ FIXED: add /listings before /filter
      window.location.href = `${baseUrl}/listings/filter/${encodeURIComponent(category)}`;
    });
  });
});
