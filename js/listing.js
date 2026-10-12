(function () {
  const eventGrid = document.getElementById("event-grid");

  if (!eventGrid) {
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

  window.displayEvents = function (list) {
    eventGrid.innerHTML = "";

    list.forEach(function (event) {
      eventGrid.innerHTML += `
        <article class="event-card">
          <img src="${event.image}" alt="${event.name}">
          <div class="event-info">
            <span class="event-badge">${event.category}</span>
            <h3>${event.name}</h3>
            <p class="event-meta">${formatDate(event.date)} at ${event.time}</p>
            <p class="event-meta">${event.venue}, ${event.location}</p>
            <p class="event-description">${event.description}</p>
            <div class="event-footer">
              <span class="event-price">${formatPrice(event.price)}</span>
              <a href="event.html?id=${event.id}" class="details-link">View details</a>
            </div>
          </div>
        </article>
      `;
    });
  };

  window.formatEventDate = formatDate;
  window.formatEventPrice = formatPrice;

  window.displayEvents(eventsData);
})();