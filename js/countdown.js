(function () {
  const box = document.getElementById("countdown-box");

  if (!box) {
    return;
  }

  const nameEl = document.getElementById("countdown-name");
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  // Turns "2026-11-07" and "7:00 PM" into a real date and time
  function eventStart(event) {
    const match = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const isPM = match[3].toUpperCase() === "PM";

    if (isPM && hours !== 12) {
      hours += 12;
    }
    if (!isPM && hours === 12) {
      hours = 0;
    }

    const date = new Date(event.date + "T00:00:00");
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  function findNextEvent() {
    const now = new Date();

    const upcoming = eventsData
      .map(function (event) {
        return { event: event, start: eventStart(event) };
      })
      .filter(function (item) {
        return item.start > now;
      })
      .sort(function (a, b) {
        return a.start - b.start;
      });

    return upcoming.length > 0 ? upcoming[0] : null;
  }

  let next = findNextEvent();

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  function tick() {
    if (!next) {
      box.hidden = true;
      return;
    }

    const diff = next.start - new Date();

    if (diff <= 0) {
      next = findNextEvent();
      if (!next) {
        box.hidden = true;
        return;
      }
    }

    const remaining = next.start - new Date();
    const totalSeconds = Math.floor(remaining / 1000);

    nameEl.textContent = next.event.name;
    daysEl.textContent = Math.floor(totalSeconds / 86400);
    hoursEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    minutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    secondsEl.textContent = pad(totalSeconds % 60);
    box.hidden = false;
  }

  tick();
  setInterval(tick, 1000);
})();