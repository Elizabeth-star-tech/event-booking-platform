(function () {
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    document.body.classList.toggle("dark", theme === "dark");

    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    }
  }

  applyTheme(localStorage.getItem("theme"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  }
})();