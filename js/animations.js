(function () {
  const items = document.querySelectorAll(".category-card, #booking-form");

  items.forEach(function (item) {
    item.classList.add("reveal");
  });

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (item) {
      item.classList.add("visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
})();