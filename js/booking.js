(function () {
  const form = document.getElementById("booking-form");

  if (!form) {
    return;
  }

  const eventSelect = document.getElementById("book-event");
  const ticketsInput = document.getElementById("book-tickets");
  const totalBox = document.getElementById("booking-total");

  const today = new Date().toISOString().split("T")[0];

  function formatPrice(price) {
    return price === 0 ? "Free" : "KSh " + price.toLocaleString();
  }

  // Fill the dropdown with upcoming events only
  eventsData
    .filter(function (event) {
      return event.date >= today;
    })
    .forEach(function (event) {
      eventSelect.innerHTML +=
        '<option value="' + event.id + '">' + event.name +
        " - " + formatPrice(event.price) + "</option>";
    });

  // Preselect the event when arriving from a details page
  const preselected = new URLSearchParams(window.location.search).get("event");
  if (preselected) {
    eventSelect.value = preselected;
  }

  function findEvent(id) {
    return eventsData.find(function (event) {
      return event.id === Number(id);
    });
  }

  function updateTotal() {
    const event = findEvent(eventSelect.value);
    const tickets = Number(ticketsInput.value);

    if (!event) {
      totalBox.textContent = "Select an event";
      return;
    }

    if (!Number.isInteger(tickets) || tickets < 1) {
      totalBox.textContent = "Enter the number of tickets";
      return;
    }

    totalBox.textContent = formatPrice(event.price * tickets);
  }

  eventSelect.addEventListener("change", updateTotal);
  ticketsInput.addEventListener("input", updateTotal);
  updateTotal();

  function setError(id, message) {
    document.getElementById(id + "-error").textContent = message;
  }

  form.addEventListener("submit", function (submitEvent) {
    submitEvent.preventDefault();

    form.querySelectorAll(".error").forEach(function (el) {
      el.textContent = "";
    });

    const name = document.getElementById("book-name").value.trim();
    const phone = document.getElementById("book-phone").value.trim();
    const email = document.getElementById("book-email").value.trim();
    const eventId = eventSelect.value;
    const tickets = Number(ticketsInput.value);

    let isValid = true;

    if (name.length < 3) {
      setError("book-name", "Please enter your full name (at least 3 letters).");
      isValid = false;
    }

    if (!/^[0-9+\s-]{10,15}$/.test(phone)) {
      setError("book-phone", "Enter a valid phone number (10 to 15 digits).");
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("book-email", "Enter a valid email address.");
      isValid = false;
    }

    if (eventId === "") {
      setError("book-event", "Please choose an event.");
      isValid = false;
    }

    if (!Number.isInteger(tickets) || tickets < 1 || tickets > 10) {
      setError("book-tickets", "Choose between 1 and 10 tickets.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const event = findEvent(eventId);
    const total = event.price * tickets;
    const reference = "TK-" + String(Date.now()).slice(-6);

    const bookings = JSON.parse(localStorage.getItem("eventBookings")) || [];
    bookings.push({
      reference: reference,
      name: name,
      phone: phone,
      email: email,
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      tickets: tickets,
      total: total,
      status: total === 0 ? "confirmed" : "awaiting payment"
    });
    localStorage.setItem("eventBookings", JSON.stringify(bookings));

    if (total === 0) {
      window.location.href = "confirmation.html?ref=" + reference;
    } else {
      window.location.href = "payment.html?ref=" + reference;
    }
  });
})();