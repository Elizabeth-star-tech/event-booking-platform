(function () {
  const searchInput = document.getElementById("event-search");
  const categoryFilter = document.getElementById("category-filter");
  const typeFilter = document.getElementById("type-filter");
  const dateFilter = document.getElementById("date-filter");
  const resetBtn = document.getElementById("reset-filters");
  const noEvents = document.getElementById("no-events");
  const eventCount = document.getElementById("event-count");

  if (!searchInput || !window.displayEvents) {
    return;
  }

  function filterEvents() {
    const searchText = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const type = typeFilter.value;
    const fromDate = dateFilter.value;

    const result = eventsData.filter(function (event) {
      const matchesName = event.name.toLowerCase().includes(searchText);
      const matchesCategory = category === "all" || event.category === category;

      let matchesType = true;
      if (type === "free") {
        matchesType = event.price === 0;
      } else if (type === "paid") {
        matchesType = event.price > 0;
      }

      const matchesDate = fromDate === "" || event.date >= fromDate;

      return matchesName && matchesCategory && matchesType && matchesDate;
    });

    window.displayEvents(result);
    noEvents.hidden = result.length > 0;
    eventCount.textContent =
      result.length + (result.length === 1 ? " event found" : " events found");
  }

  searchInput.addEventListener("input", filterEvents);
  categoryFilter.addEventListener("change", filterEvents);
  typeFilter.addEventListener("change", filterEvents);
  dateFilter.addEventListener("change", filterEvents);

  resetBtn.addEventListener("click", function () {
    searchInput.value = "";
    categoryFilter.value = "all";
    typeFilter.value = "all";
    dateFilter.value = "";
    filterEvents();
  });

  filterEvents();
})();