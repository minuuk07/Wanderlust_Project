document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.category;
      if (!category) return;
      const baseUrl = window.location.origin;
      window.location.href = `${baseUrl}/filter/${encodeURIComponent(category)}`;
    });
  });
});
