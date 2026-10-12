(function () {
  const box = document.getElementById("event-details");

  if (!box) {
    return;
  }

  function formatDate(dateText) {
    return new Date(dateText + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function formatPrice(price) {
    return price === 0 ? "Free" : "KSh " + price.toLocaleString();
  }

  const params = new URLSearchParams(window.location.search);
  const eventId = Number(params.get("id"));

  const event = eventsData.find(function (e) {
    return e.id === eventId;
  });

  if (!event) {
    box.innerHTML = `
      <h2>Event not found</h2>
      <p>We could not find that event. It may have been removed.</p>
      <a href="index.html#events" class="btn">Back to all events</a>
    `;
    return;
  }

  document.title = event.name + " | Tukio";

  const scheduleRows = event.schedule
    .map(function (item) {
      return "<li><span class='schedule-time'>" + item.time +
        "</span><span>" + item.activity + "</span></li>";
    })
    .join("");

  const isPast = event.date < new Date().toISOString().split("T")[0];

  const bookButton = isPast
    ? "<span class='btn btn-disabled'>This event has ended</span>"
    : "<a href='index.html?event=" + event.id + "#booking' class='btn'>Book tickets</a>";

  box.innerHTML = `
    <div class="event-hero">
      <img src="${event.image}" alt="${event.name}">
    </div>

    <div class="event-layout">
      <div class="event-main">
        <span class="event-badge">${event.category}</span>
        <h1>${event.name}</h1>
        <p class="event-when">${formatDate(event.date)} at ${event.time}</p>

        <h2>About this event</h2>
        <p>${event.fullDescription}</p>

        <h2>Schedule</h2>
        <ul class="schedule-list">${scheduleRows}</ul>

        <h2>Organizer</h2>
        <p><strong>${event.organizer}</strong></p>
        <p>Contact: ${event.organizerContact}</p>
      </div>

      <aside class="event-side">
        <div class="side-card">
          <p class="side-label">Ticket price</p>
          <p class="side-price">${formatPrice(event.price)}</p>
          ${bookButton}
        </div>

        <div class="side-card">
          <h3>Venue</h3>
          <p><strong>${event.venue}</strong></p>
          <p>${event.location}</p>
          <p>${event.venueDetails}</p>
        </div>

        <div class="side-card">
          <h3>Tickets and registration</h3>
          <p>${event.ticketInfo}</p>
        </div>
      </aside>
    </div>
  `;
})();