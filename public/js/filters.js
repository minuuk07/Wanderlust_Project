// public/js/filters.js
document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const category = filter.getAttribute("data-category");
      if (!category) return;
      const baseUrl = window.location.origin; // https://wanderlust-project-r7lz.onrender.com
      window.location.href = `${baseUrl}/filter/${category}`;
    });
  });
});
