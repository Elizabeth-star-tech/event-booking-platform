(function () {
  const jumpBox = document.getElementById("cat-jump");
  const blocksBox = document.getElementById("cat-blocks");

  if (!jumpBox || !blocksBox) {
    return;
  }

  const categories = [
    { name: "Concert", text: "Live music, from jazz to Afrobeats." },
    { name: "Workshop", text: "Hands-on learning with experts." },
    { name: "Festival", text: "Food, music and fun for everyone." },
    { name: "Seminar", text: "Talks and panels to learn and network." }
  ];

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(dateText) {
    return new Date(dateText + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function formatPrice(price) {
    return price === 0 ? "Free" : "KSh " + price.toLocaleString();
  }

  function slug(name) {
    return "cat-" + name.toLowerCase().replace(/\s+/g, "-");
  }

  categories.forEach(function (category) {
    const list = eventsData
      .filter(function (event) {
        return event.category === category.name;
      })
      .sort(function (a, b) {
        return a.date.localeCompare(b.date);
      });

    jumpBox.innerHTML +=
      '<a href="#' + slug(category.name) + '" class="cat-pill">' +
      escapeHtml(category.name) + " (" + list.length + ")</a>";

    const cards = list
      .map(function (event) {
        return `
          <article class="event-card">
            <img src="${event.image}" alt="${escapeHtml(event.name)}">
            <div class="event-info">
              <h3>${escapeHtml(event.name)}</h3>
              <p class="event-meta">${formatDate(event.date)} at ${escapeHtml(event.time)}</p>
              <p class="event-meta">${escapeHtml(event.venue)}, ${escapeHtml(event.location)}</p>
              <p class="event-description">${escapeHtml(event.description)}</p>
              <div class="event-footer">
                <span class="event-price">${formatPrice(event.price)}</span>
                <a href="event.html?id=${event.id}" class="details-link">View details</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    const body = list.length > 0
      ? '<div class="event-grid">' + cards + "</div>"
      : '<p class="cat-empty">No events in this category yet.</p>';

    blocksBox.innerHTML += `
      <section class="cat-block" id="${slug(category.name)}">
        <div class="cat-head">
          <h2>${escapeHtml(category.name)}</h2>
          <span class="cat-count">${list.length} ${list.length === 1 ? "event" : "events"}</span>
        </div>
        <p class="cat-text">${escapeHtml(category.text)}</p>
        ${body}
      </section>
    `;
  });

  // Scroll to a category when the address has one, like categories.html#cat-concert
  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) {
      target.scrollIntoView();
    }
  }
})();