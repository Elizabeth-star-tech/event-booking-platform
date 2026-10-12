(function () {
  const content = document.getElementById("payment-content");
  const missing = document.getElementById("payment-missing");

  if (!content) {
    return;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatPrice(price) {
    return price === 0 ? "Free" : "KSh " + price.toLocaleString();
  }

  const reference = new URLSearchParams(window.location.search).get("ref");
  const bookings = JSON.parse(localStorage.getItem("eventBookings")) || [];
  const index = bookings.findIndex(function (b) {
    return b.reference === reference;
  });

  if (index === -1) {
    missing.hidden = false;
    return;
  }

  const booking = bookings[index];

  // Free or already paid bookings go straight to the ticket
  if (booking.total === 0 || booking.status === "paid") {
    window.location.href = "confirmation.html?ref=" + reference;
    return;
  }

  content.hidden = false;

  document.getElementById("pay-summary").innerHTML = `
    <h2>Order summary</h2>
    <p class="summary-event">${escapeHtml(booking.eventName)}</p>
    <p>${booking.tickets} ${booking.tickets === 1 ? "ticket" : "tickets"}</p>
    <p>Booking reference: <strong>${escapeHtml(booking.reference)}</strong></p>
    <p class="summary-total">Total: <strong>${formatPrice(booking.total)}</strong></p>
  `;

  const payLabel = "Pay " + formatPrice(booking.total);
  const cardBtn = document.getElementById("card-pay-btn");
  const mpesaBtn = document.getElementById("mpesa-pay-btn");
  cardBtn.textContent = payLabel;
  mpesaBtn.textContent = payLabel;

  // Switch between Card and M-Pesa
  const cardForm = document.getElementById("card-form");
  const mpesaForm = document.getElementById("mpesa-form");
  const tabCard = document.getElementById("method-card");
  const tabMpesa = document.getElementById("method-mpesa");

  function showMethod(method) {
    const isCard = method === "card";
    cardForm.hidden = !isCard;
    mpesaForm.hidden = isCard;
    tabCard.classList.toggle("active", isCard);
    tabMpesa.classList.toggle("active", !isCard);
  }

  tabCard.addEventListener("click", function () {
    showMethod("card");
  });
  tabMpesa.addEventListener("click", function () {
    showMethod("mpesa");
  });

  // Format the card number as 1234 5678 9012 3456
  const numberInput = document.getElementById("card-number");
  numberInput.addEventListener("input", function () {
    const digits = numberInput.value.replace(/\D/g, "").slice(0, 16);
    numberInput.value = digits.replace(/(.{4})/g, "$1 ").trim();
  });

  // Format the expiry as MM/YY
  const expiryInput = document.getElementById("card-expiry");
  expiryInput.addEventListener("input", function () {
    const digits = expiryInput.value.replace(/\D/g, "").slice(0, 4);
    expiryInput.value =
      digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  });

  function setError(id, message) {
    document.getElementById(id + "-error").textContent = message;
  }

  function clearErrors(form) {
    form.querySelectorAll(".error").forEach(function (el) {
      el.textContent = "";
    });
  }

  // Pretend to process the payment, then mark the booking as paid.
  // Card details are never saved: only the payment method is recorded.
  function completePayment(method, button) {
    button.disabled = true;
    button.textContent = "Processing...";

    setTimeout(function () {
      bookings[index].status = "paid";
      bookings[index].paymentMethod = method;
      localStorage.setItem("eventBookings", JSON.stringify(bookings));
      window.location.href = "confirmation.html?ref=" + reference;
    }, 1500);
  }

  cardForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(cardForm);

    const name = document.getElementById("card-name").value.trim();
    const number = numberInput.value.replace(/\s/g, "");
    const expiry = expiryInput.value;
    const cvv = document.getElementById("card-cvv").value;
    let isValid = true;

    if (name.length < 3) {
      setError("card-name", "Enter the name on the card.");
      isValid = false;
    }

    if (!/^\d{16}$/.test(number)) {
      setError("card-number", "Enter a 16-digit card number.");
      isValid = false;
    }

    const expiryMatch = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!expiryMatch) {
      setError("card-expiry", "Use the format MM/YY.");
      isValid = false;
    } else {
      const month = Number(expiryMatch[1]);
      const year = 2000 + Number(expiryMatch[2]);
      const now = new Date();
      const expired =
        year < now.getFullYear() ||
        (year === now.getFullYear() && month < now.getMonth() + 1);

      if (expired) {
        setError("card-expiry", "This card has expired.");
        isValid = false;
      }
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      setError("card-cvv", "Enter the 3 or 4 digit CVV.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    completePayment("Card", cardBtn);
  });

  mpesaForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(mpesaForm);

    const phone = document.getElementById("mpesa-phone").value.trim();

    if (!/^(?:\+254|254|0)[17]\d{8}$/.test(phone.replace(/\s/g, ""))) {
      setError("mpesa-phone", "Enter a valid Kenyan number, like 0712345678.");
      return;
    }

    completePayment("M-Pesa", mpesaBtn);
  });
})();