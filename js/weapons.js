document.addEventListener("DOMContentLoaded", () => {
  // === DOM Elements ===
  const overlay = document.getElementById("activate-overlay");
  const introSound = document.getElementById("introSound");
  const music = document.getElementById("audio");
  const glitchScreen = document.getElementById("intro-screen");
  const playPauseBtn = document.getElementById("play-pause");
  const seekBar = document.getElementById("seek-bar");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration");
  const searchInput = document.getElementById("searchbar");
  const searchButton = document.getElementById("search-button");
  const resetButton = document.getElementById("reset-button");
  const spinner = document.getElementById("loading-spinner");
  const characterContainer = document.getElementById("character-container");
  const suggestions = document.getElementById("suggestions");

  let introCompleted = false;
  let musicStarted = false;
  let isSeeking = false;

  // === Format Time ===
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // === Music Setup ===
  music.addEventListener("canplaythrough", () => {
    durationDisplay.textContent = formatTime(music.duration);
    seekBar.max = music.duration;
    seekBar.step = 0.1;
  }, { once: true });

  seekBar.addEventListener("mousedown", () => (isSeeking = true));
  seekBar.addEventListener("mouseup", () => (isSeeking = false));
  seekBar.addEventListener("input", () => {
    music.currentTime = seekBar.value;
  });

  music.addEventListener("timeupdate", () => {
    if (!isSeeking) {
      currentTimeDisplay.textContent = formatTime(music.currentTime);
      seekBar.value = music.currentTime;
      const percent = (music.currentTime / music.duration) * 100;
      seekBar.style.background = `linear-gradient(to right, #14c256 ${percent}%, #08500c ${percent}%)`;
    }
  });

  // === Glitch Intro Sequence ===
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    glitchScreen.classList.add("active");
    introSound.currentTime = 0;
    introSound.play().catch((err) => console.warn("Intro sound failed:", err));

    setTimeout(() => {
      glitchScreen.style.animation = "fadeOut 1s ease forwards";
    }, 4000);

    setTimeout(() => {
      glitchScreen.style.display = "none";
    }, 5000);

    introSound.addEventListener("ended", () => {
      setTimeout(() => {
        music.currentTime = 0;
        music.play().catch((err) => console.warn("Music playback failed:", err));
        playPauseBtn.textContent = "Pause";
        introCompleted = true;
        setTimeout(() => {
          musicStarted = true;
        }, 1500);
      }, 1000);
    }, { once: true });
  }, { once: true });

  // === Music Controls ===
  playPauseBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      playPauseBtn.textContent = "Pause";
    } else {
      music.pause();
      playPauseBtn.textContent = "Play";
    }
  });

  // === Character Cards ===
  const renderSeries = (series) => {
    characterContainer.innerHTML = "";
    series.forEach((series) => {
      const card = document.createElement("div");
      card.className = "character-card";

      const cardInner = document.createElement("div");
      cardInner.className = "character-card-inner";

      const cardFront = document.createElement("div");
      cardFront.className = "character-card-front";
      cardFront.innerHTML = `
        <img src="${series.thumbnail.path}.${series.thumbnail.extension}" alt="${series.title}">
        <h3>${series.title}</h3>
      `;

      const cardBack = document.createElement("div");
      cardBack.className = "character-card-back";
      cardBack.innerHTML = `
        <p><strong>${series.title}</strong></p>
        <p>${series.description || "No description available."}</p>
        <p>Appears in ${series.comics.available} comics</p>
      `;

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);

      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
      });

      characterContainer.appendChild(card);
    });
  };

  // === Autocomplete Suggestions Only ===
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!introCompleted || !musicStarted || !query) return;

    fetch(`http://localhost:3000/series?nameStartsWith=${query}`)
      .then((res) => res.json())
      .then((data) => {
        const results = data?.data?.results || [];
        suggestions.innerHTML = "";
        results.slice(0, 5).forEach((char) => {
          const li = document.createElement("li");
          li.textContent = char.title;
          li.addEventListener("click", () => {
            searchInput.value = char.title;
            suggestions.innerHTML = "";
          });
          suggestions.appendChild(li);
        });
      })
      .catch((err) => console.warn("Autocomplete fetch failed:", err));
  });

  // === Search Button Triggers Results ===
  const handleSearch = async (query) => {
    if (!introCompleted || !musicStarted || !query) return;
    spinner.classList.remove("hidden");

    try {
      const response = await fetch(
        `http://localhost:3000/events?nameStartsWith=${query}`
      );
      const data = await response.json();
      const results = data?.data?.results || [];

      if (results.length > 0) {
        renderSeries(results);
        suggestions.innerHTML = "";
      } else {
        characterContainer.innerHTML = "<p>No match found.</p>";
      }
    } catch (err) {
      console.warn("Search failed:", err);
      characterContainer.innerHTML = "<p>Search error. Try again later.</p>";
    } finally {
      spinner.classList.add("hidden");
    }
  };

  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    handleSearch(query);
  });

  // === Reset ===
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    characterContainer.innerHTML = "";
    suggestions.innerHTML = "";
  });

  let events = [];

// letiables to store event input fields and reminder list
let eventDateInput = document.getElementById("eventDate");
let eventTitleInput = document.getElementById("eventTitle");
let eventDescriptionInput = document.getElementById("eventDescription");
let reminderList = document.getElementById("reminderList");

// Counter to generate unique event IDs
let eventIdCounter = 1;

// Function to add events
function addEvent() {
	let date = eventDateInput.value;
	let title = eventTitleInput.value;
	let description = eventDescriptionInput.value;

	if (date && title) {
		// Create a unique event ID
		let eventId = eventIdCounter++;

		events.push(
			{
				id: eventId, date: date,
				title: title,
				description: description
			}
		);
		showCalendar(currentMonth, currentYear);
		eventDateInput.value = "";
		eventTitleInput.value = "";
		eventDescriptionInput.value = "";
		displayReminders();
	}
}

// Function to delete an event by ID
function deleteEvent(eventId) {
	// Find the index of the event with the given ID
	let eventIndex =
		events.findIndex((event) =>
			event.id === eventId);

	if (eventIndex !== -1) {
		// Remove the event from the events array
		events.splice(eventIndex, 1);
		showCalendar(currentMonth, currentYear);
		displayReminders();
	}
}

// Function to display reminders
function displayReminders() {
	reminderList.innerHTML = "";
	for (let i = 0; i < events.length; i++) {
		let event = events[i];
		let eventDate = new Date(event.date);
		if (eventDate.getMonth() === currentMonth &&
			eventDate.getFullYear() === currentYear) {
			let listItem = document.createElement("li");
			listItem.innerHTML =
				`<strong>${event.title}</strong> - 
			${event.description} on 
			${eventDate.toLocaleDateString()}`;

			// Add a delete button for each reminder item
			let deleteButton =
				document.createElement("button");
			deleteButton.className = "delete-event";
			deleteButton.textContent = "Delete";
			deleteButton.onclick = function () {
				deleteEvent(event.id);
			};

			listItem.appendChild(deleteButton);
			reminderList.appendChild(listItem);
		}
	}
}

// Function to generate a range of 
// years for the year select input
function generate_year_range(start, end) {
	let years = "";
	for (let year = start; year <= end; year++) {
		years += "<option value='" +
			year + "'>" + year + "</option>";
	}
	return years;
}

// Initialize date-related letiables
today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

createYear = generate_year_range(1970, 2050);

document.getElementById("year").innerHTML = createYear;

let calendar = document.getElementById("calendar");

let months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
let days = [
	"Sun", "Mon", "Tue", "Wed",
	"Thu", "Fri", "Sat"];

$dataHead = "<tr>";
for (dhead in days) {
	$dataHead += "<th data-days='" +
		days[dhead] + "'>" +
		days[dhead] + "</th>";
}
$dataHead += "</tr>";

document.getElementById("thead-month").innerHTML = $dataHead;

monthAndYear =
	document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

// Function to navigate to the next month
function next() {
	currentYear = currentMonth === 11 ?
		currentYear + 1 : currentYear;
	currentMonth = (currentMonth + 1) % 12;
	showCalendar(currentMonth, currentYear);
}

// Function to navigate to the previous month
function previous() {
	currentYear = currentMonth === 0 ?
		currentYear - 1 : currentYear;
	currentMonth = currentMonth === 0 ?
		11 : currentMonth - 1;
	showCalendar(currentMonth, currentYear);
}

// Function to jump to a specific month and year
function jump() {
	currentYear = parseInt(selectYear.value);
	currentMonth = parseInt(selectMonth.value);
	showCalendar(currentMonth, currentYear);
}

// Function to display the calendar
function showCalendar(month, year) {
	let firstDay = new Date(year, month, 1).getDay();
	tbl = document.getElementById("calendar-body");
	tbl.innerHTML = "";
	monthAndYear.innerHTML = months[month] + " " + year;
	selectYear.value = year;
	selectMonth.value = month;

	let date = 1;
	for (let i = 0; i < 6; i++) {
		let row = document.createElement("tr");
		for (let j = 0; j < 7; j++) {
			if (i === 0 && j < firstDay) {
				cell = document.createElement("td");
				cellText = document.createTextNode("");
				cell.appendChild(cellText);
				row.appendChild(cell);
			} else if (date > daysInMonth(month, year)) {
				break;
			} else {
				cell = document.createElement("td");
				cell.setAttribute("data-date", date);
				cell.setAttribute("data-month", month + 1);
				cell.setAttribute("data-year", year);
				cell.setAttribute("data-month_name", months[month]);
				cell.className = "date-picker";
				cell.innerHTML = "<span>" + date + "</span>";
        cell.addEventListener("click", () => {
  const selectedDate = `${cell.dataset.month_name} ${cell.dataset.date}, ${cell.dataset.year}`;
  alert("You clicked: " + selectedDate);
});

				if (
					date === today.getDate() &&
					year === today.getFullYear() &&
					month === today.getMonth()
				) {
					cell.className = "date-picker selected";
				}

				// Check if there are events on this date
				if (hasEventOnDate(date, month, year)) {
					cell.classList.add("event-marker");
					cell.appendChild(
						createEventTooltip(date, month, year)
				);
				}

				row.appendChild(cell);
				date++;
			}
		}
		tbl.appendChild(row);
	}

	displayReminders();
}

// Function to create an event tooltip
function createEventTooltip(date, month, year) {
	let tooltip = document.createElement("div");
	tooltip.className = "event-tooltip";
	let eventsOnDate = getEventsOnDate(date, month, year);
	for (let i = 0; i < eventsOnDate.length; i++) {
		let event = eventsOnDate[i];
		let eventDate = new Date(event.date);
		let eventText = `<strong>${event.title}</strong> - 
			${event.description} on 
			${eventDate.toLocaleDateString()}`;
		let eventElement = document.createElement("p");
		eventElement.innerHTML = eventText;
		tooltip.appendChild(eventElement);
	}
	return tooltip;
}

// Function to get events on a specific date
function getEventsOnDate(date, month, year) {
	return events.filter(function (event) {
		let eventDate = new Date(event.date);
		return (
			eventDate.getDate() === date &&
			eventDate.getMonth() === month &&
			eventDate.getFullYear() === year
		);
	});
}

// Function to check if there are events on a specific date
function hasEventOnDate(date, month, year) {
	return getEventsOnDate(date, month, year).length > 0;
}

// Function to get the number of days in a month
function daysInMonth(iMonth, iYear) {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

// Call the showCalendar function initially to display the calendar
showCalendar(currentMonth, currentYear);})
