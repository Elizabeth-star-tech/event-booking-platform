(function () {
  const box = document.getElementById("ticket-box");

  if (!box) {
    return;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
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

  const reference = new URLSearchParams(window.location.search).get("ref");
  const bookings = JSON.parse(localStorage.getItem("eventBookings")) || [];
  const booking = bookings.find(function (b) {
    return b.reference === reference;
  });

  if (!booking) {
    box.innerHTML = `
      <h2>Ticket not found</h2>
      <p>We could not find that booking. It may have been cleared from this browser.</p>
      <a href="index.html#events" class="btn">Browse events</a>
    `;
    return;
  }

  const event = eventsData.find(function (e) {
    return e.id === booking.eventId;
  });

  const isPending = booking.status === "awaiting payment";

  const statusText = isPending ? "Awaiting payment" : "Confirmed";
  const statusClass = isPending ? "pending" : "confirmed";

  const heading = isPending
    ? "Your booking is saved"
    : "You're going! Booking confirmed";

  const note = isPending
    ? "Your tickets are reserved but not paid for yet."
    : "Show this ticket at the entrance. A copy has been prepared for " +
      escapeHtml(booking.email) + ".";

  const paymentLine = booking.paymentMethod
    ? "<div><span>Paid with</span><strong>" + escapeHtml(booking.paymentMethod) + "</strong></div>"
    : "";

  const actions = isPending
    ? "<a href='payment.html?ref=" + escapeHtml(booking.reference) + "' class='btn'>Pay now</a>"
    : "<button type='button' class='btn' id='print-ticket'>Print ticket</button>";

  document.title = "Ticket " + booking.reference + " | Tukio";

  box.innerHTML = `
    <div class="confirm-head">
      <p class="confirm-icon" aria-hidden="true">${isPending ? "&#9203;" : "&#10003;"}</p>
      <h1>${heading}</h1>
      <p>${note}</p>
    </div>

    <article class="ticket">
      <div class="ticket-top">
        <p class="ticket-category">${event ? escapeHtml(event.category) : "Event"}</p>
        <h2>${escapeHtml(booking.eventName)}</h2>
        <p>${formatDate(booking.eventDate)}${event ? " at " + escapeHtml(event.time) : ""}</p>
        ${event ? "<p>" + escapeHtml(event.venue) + ", " + escapeHtml(event.location) + "</p>" : ""}
      </div>

      <div class="ticket-details">
        <div><span>Booking reference</span><strong class="ticket-ref">${escapeHtml(booking.reference)}</strong></div>
        <div><span>Name</span><strong>${escapeHtml(booking.name)}</strong></div>
        <div><span>Tickets</span><strong>${booking.tickets}</strong></div>
        <div><span>Total</span><strong>${formatPrice(booking.total)}</strong></div>
        ${paymentLine}
        <div><span>Status</span><strong class="ticket-status ${statusClass}">${statusText}</strong></div>
      </div>
    </article>

    <div class="confirm-actions">
      ${actions}
      <a href="index.html#events" class="btn btn-outline-dark">Browse more events</a>
    </div>
  `;

  const printBtn = document.getElementById("print-ticket");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();