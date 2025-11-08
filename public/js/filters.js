// public/js/filters.js

document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const category = filter.getAttribute("data-category");
      // Redirect to backend route for filtering
      window.location.href = `/filter/${category}`;
    });
  });
});
