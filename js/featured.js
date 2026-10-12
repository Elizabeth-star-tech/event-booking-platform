(function () {
  const grid = document.getElementById("featured-grid");

  if (!grid) {
    return;
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

  function daysUntil(dateText) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const eventDay = new Date(dateText + "T00:00:00");
    return Math.round((eventDay - todayStart) / (1000 * 60 * 60 * 24));
  }

  function daysLabel(days) {
    if (days === 0) {
      return "Today";
    }
    if (days === 1) {
      return "Tomorrow";
    }
    return "In " + days + " days";
  }

  const today = new Date().toISOString().split("T")[0];

  const nextThree = eventsData
    .filter(function (event) {
      return event.date >= today;
    })
    .sort(function (a, b) {
      return a.date.localeCompare(b.date);
    })
    .slice(0, 3);

  if (nextThree.length === 0) {
    grid.innerHTML = "<p>No upcoming events right now. Check back soon.</p>";
    return;
  }

  nextThree.forEach(function (event) {
    grid.innerHTML += `
      <article class="event-card">
        <img src="${event.image}" alt="${event.name}">
        <div class="event-info">
          <p class="days-tag">${daysLabel(daysUntil(event.date))}</p>
          <span class="event-badge">${event.category}</span>
          <h3>${event.name}</h3>
          <p class="event-meta">${formatDate(event.date)} at ${event.time}</p>
          <p class="event-meta">${event.venue}, ${event.location}</p>
          <div class="event-footer">
            <span class="event-price">${formatPrice(event.price)}</span>
            <a href="event.html?id=${event.id}" class="details-link">View details</a>
          </div>
        </div>
      </article>
    `;
  });
})();