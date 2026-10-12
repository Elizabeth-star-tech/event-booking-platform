(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!menuToggle || !navMenu) {
    return;
  }

  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("open");
    });
  });
})();