// Pain and Fatigue Diary
// The JavaScript code is added step by step (see SPEC.md, features F1–F10).

// All diary entries. Each entry is an object like:
// { date: "2026-11-14", pain: 6, fatigue: 7, sleep: 6.5, note: "bad night" }
// sleep is null if it was left empty.
const entries = [];

// Get the HTML elements we need
const entryForm = document.getElementById("entry-form");
const dateInput = document.getElementById("date-input");
const painInput = document.getElementById("pain-input");
const painValue = document.getElementById("pain-value");
const fatigueInput = document.getElementById("fatigue-input");
const fatigueValue = document.getElementById("fatigue-value");
const sleepInput = document.getElementById("sleep-input");
const noteInput = document.getElementById("note-input");
const formMessage = document.getElementById("form-message");

// Returns today's date as text in the format "YYYY-MM-DD"
function getTodayAsText() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Shows the current number of both sliders next to their labels
function showSliderValues() {
  painValue.textContent = painInput.value;
  fatigueValue.textContent = fatigueInput.value;
}

// Empties the form and sets the date back to today
function resetForm() {
  entryForm.reset();
  dateInput.value = getTodayAsText();
  showSliderValues();
}

// Checks if a pain or fatigue value is a whole number from 0 to 10
function isValidLevel(level) {
  if (Number.isInteger(level) === false) {
    return false;
  }
  if (level < 0 || level > 10) {
    return false;
  }
  return true;
}

// Reads all form fields and returns them as one entry object
function readEntryFromForm() {
  let sleepHours = null;
  if (sleepInput.value !== "") {
    sleepHours = Number(sleepInput.value);
  }

  const entry = {
    date: dateInput.value,
    pain: Number(painInput.value),
    fatigue: Number(fatigueInput.value),
    sleep: sleepHours,
    note: noteInput.value.trim()
  };
  return entry;
}

// Returns the position of the entry with this date, or -1 if there is none
function findEntryIndexByDate(date) {
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].date === date) {
      return i;
    }
  }
  return -1;
}

// Adds the entry, or replaces the old one with the same date.
// Returns true if an old entry was replaced.
function saveEntry(entry) {
  const existingIndex = findEntryIndexByDate(entry.date);

  if (existingIndex === -1) {
    entries.push(entry);
    return false;
  }

  entries[existingIndex] = entry;
  return true;
}

// Returns an error text if the entry is not valid, or "" if it is fine
function checkEntry(entry) {
  if (entry.date === "") {
    return "Please choose a date.";
  }
  if (isValidLevel(entry.pain) === false || isValidLevel(entry.fatigue) === false) {
    return "Pain and fatigue must be between 0 and 10.";
  }
  return "";
}

// Runs when the "Save entry" button is clicked
function handleEntrySubmit(event) {
  // Stop the browser from reloading the page
  event.preventDefault();

  const entry = readEntryFromForm();
  const errorText = checkEntry(entry);
  if (errorText !== "") {
    formMessage.textContent = errorText;
    return;
  }

  const wasReplaced = saveEntry(entry);
  if (wasReplaced) {
    formMessage.textContent = "Entry for " + entry.date + " was updated.";
  } else {
    formMessage.textContent = "Entry for " + entry.date + " was saved.";
  }
  resetForm();
}

entryForm.addEventListener("submit", handleEntrySubmit);
painInput.addEventListener("input", showSliderValues);
fatigueInput.addEventListener("input", showSliderValues);

// When the page opens: prepare the form (date = today)
resetForm();
