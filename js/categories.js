(function () {
  const grid = document.getElementById("category-grid");

  if (!grid) {
    return;
  }

  const categories = [
    { name: "Concert", text: "Live music, from jazz to Afrobeats." },
    { name: "Workshop", text: "Hands-on learning with experts." },
    { name: "Festival", text: "Food, music and fun for everyone." },
    { name: "Seminar", text: "Talks and panels to learn and network." }
  ];

  categories.forEach(function (category) {
    const count = eventsData.filter(function (event) {
      return event.category === category.name;
    }).length;

    grid.innerHTML += `
      <button type="button" class="category-card" data-category="${category.name}">
        <span class="category-name">${category.name}</span>
        <span class="category-text">${category.text}</span>
        <span class="category-count">${count} ${count === 1 ? "event" : "events"}</span>
      </button>
    `;
  });

  grid.addEventListener("click", function (event) {
    const card = event.target.closest(".category-card");

    if (!card) {
      return;
    }

    const select = document.getElementById("category-filter");

    if (select) {
      select.value = card.dataset.category;
      select.dispatchEvent(new Event("change"));
    }

    document.getElementById("events").scrollIntoView({ behavior: "smooth" });
  });
})();