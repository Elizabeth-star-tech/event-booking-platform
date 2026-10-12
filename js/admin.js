(function () {
  const statsBox = document.getElementById("stats");

  if (!statsBox) {
    return;
  }

  const eventsBody = document.getElementById("events-table-body");
  const bookingsBody = document.getElementById("bookings-table-body");
  const bookingsWrap = document.getElementById("bookings-wrap");
  const noBookings = document.getElementById("no-bookings");

  const today = new Date().toISOString().split("T")[0];

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatPrice(price) {
    return price === 0 ? "Free" : "KSh " + price.toLocaleString();
  }

  function formatDate(dateText) {
    return new Date(dateText + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function getBookings() {
    return JSON.parse(localStorage.getItem("eventBookings")) || [];
  }

  // A booking counts as sold once it is paid, or confirmed (free events)
  function isSold(booking) {
    return booking.status === "paid" || booking.status === "confirmed";
  }

  function displayStats() {
    const bookings = getBookings();
    const sold = bookings.filter(isSold);

    const upcoming = eventsData.filter(function (event) {
      return event.date >= today;
    }).length;

    const ticketsSold = sold.reduce(function (sum, b) {
      return sum + b.tickets;
    }, 0);

    const revenue = sold.reduce(function (sum, b) {
      return sum + b.total;
    }, 0);

    const pending = bookings.filter(function (b) {
      return b.status === "awaiting payment";
    }).length;

    statsBox.innerHTML = `
      <div class="stat-card">
        <p class="stat-number">${eventsData.length}</p>
        <p>Total events (${upcoming} upcoming)</p>
      </div>
      <div class="stat-card">
        <p class="stat-number">${bookings.length}</p>
        <p>Bookings made (${pending} awaiting payment)</p>
      </div>
      <div class="stat-card">
        <p class="stat-number">${ticketsSold}</p>
        <p>Tickets sold</p>
      </div>
      <div class="stat-card">
        <p class="stat-number">KSh ${revenue.toLocaleString()}</p>
        <p>Revenue collected</p>
      </div>
    `;
  }

  function displayEvents() {
    const sold = getBookings().filter(isSold);
    eventsBody.innerHTML = "";

    eventsData.forEach(function (event) {
      const forEvent = sold.filter(function (b) {
        return b.eventId === event.id;
      });

      const tickets = forEvent.reduce(function (sum, b) {
        return sum + b.tickets;
      }, 0);

      const revenue = forEvent.reduce(function (sum, b) {
        return sum + b.total;
      }, 0);

      eventsBody.innerHTML += `
        <tr>
          <td class="event-cell">
            <img src="${event.image}" alt="${escapeHtml(event.name)}" class="thumb">
            <span>${escapeHtml(event.name)}</span>
          </td>
          <td>${formatDate(event.date)}</td>
          <td>${formatPrice(event.price)}</td>
          <td>${forEvent.length}</td>
          <td>${tickets}</td>
          <td>KSh ${revenue.toLocaleString()}</td>
        </tr>
      `;
    });
  }

  function statusBadge(status) {
    const classes = {
      "paid": "badge-paid",
      "confirmed": "badge-paid",
      "awaiting payment": "badge-pending"
    };

    const labels = {
      "paid": "Paid",
      "confirmed": "Confirmed",
      "awaiting payment": "Awaiting payment"
    };

    return (
      "<span class='status-badge " + (classes[status] || "") + "'>" +
      (labels[status] || escapeHtml(status || "Unknown")) +
      "</span>"
    );
  }

  function displayBookings() {
    const bookings = getBookings();
    bookingsBody.innerHTML = "";

    if (bookings.length === 0) {
      noBookings.hidden = false;
      bookingsWrap.hidden = true;
      return;
    }

    noBookings.hidden = true;
    bookingsWrap.hidden = false;

    bookings
      .slice()
      .reverse()
      .forEach(function (b) {
        bookingsBody.innerHTML += `
          <tr>
            <td><strong>${escapeHtml(b.reference)}</strong></td>
            <td>${escapeHtml(b.name)}<br><small>${escapeHtml(b.email)}</small></td>
            <td>${escapeHtml(b.eventName)}</td>
            <td>${b.tickets}</td>
            <td>${formatPrice(b.total)}</td>
            <td>${statusBadge(b.status)}</td>
            <td>
              <button class="delete-btn" data-reference="${escapeHtml(b.reference)}">Delete</button>
            </td>
          </tr>
        `;
      });
  }

  bookingsBody.addEventListener("click", function (event) {
    const btn = event.target.closest(".delete-btn");

    if (!btn) {
      return;
    }

    const reference = btn.dataset.reference;

    const remaining = getBookings().filter(function (b) {
      return b.reference !== reference;
    });

    localStorage.setItem("eventBookings", JSON.stringify(remaining));
    refresh();
  });

  function refresh() {
    displayStats();
    displayEvents();
    displayBookings();
  }

  refresh();
})();