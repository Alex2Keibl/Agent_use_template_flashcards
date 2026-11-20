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
const emptyMessage = document.getElementById("empty-message");
const entryTable = document.getElementById("entry-table");
const entryTableBody = document.getElementById("entry-table-body");

// F4: Date of the entry whose "Delete?" question is currently shown (null = none)
let dateToConfirmDelete = null;

// F5: Name under which the entries are stored in localStorage
const storageKey = "painFatigueEntries";

// Saves the entries array in localStorage (as JSON text)
function saveEntriesToStorage() {
  const entriesAsText = JSON.stringify(entries);
  localStorage.setItem(storageKey, entriesAsText);
}

// Loads saved entries from localStorage into the entries array
function loadEntriesFromStorage() {
  const entriesAsText = localStorage.getItem(storageKey);

  // Nothing saved yet (first visit)
  if (entriesAsText === null) {
    return;
  }

  const savedEntries = JSON.parse(entriesAsText);
  for (let i = 0; i < savedEntries.length; i++) {
    entries.push(savedEntries[i]);
  }
}

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
    saveEntriesToStorage();
    return false;
  }

  entries[existingIndex] = entry;
  saveEntriesToStorage();
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

// Compares two entries by date, so that the newest date comes first.
// "YYYY-MM-DD" texts can be compared directly ("2026-11-14" > "2026-11-02").
function compareNewestFirst(entryA, entryB) {
  if (entryA.date < entryB.date) {
    return 1;
  }
  if (entryA.date > entryB.date) {
    return -1;
  }
  return 0;
}

// Returns a sorted copy of all entries (newest first). The original array stays unchanged.
function getSortedEntries() {
  const sortedEntries = entries.slice();
  sortedEntries.sort(compareNewestFirst);
  return sortedEntries;
}

// Creates one table cell (<td>) with the given text
function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

// Returns the CSS class for a pain or fatigue level:
// 0–3 = low (green), 4–6 = medium (yellow), 7–10 = high (red)
function getSeverityClass(level) {
  if (level <= 3) {
    return "severity-low";
  }
  if (level <= 6) {
    return "severity-medium";
  }
  return "severity-high";
}

// Creates a table cell for a pain or fatigue level, coloured by severity
function createLevelCell(level) {
  const cell = createCell(level);
  cell.className = getSeverityClass(level);
  return cell;
}

// Removes the entry with this date from the entries array
function deleteEntryByDate(date) {
  const index = findEntryIndexByDate(date);
  if (index !== -1) {
    entries.splice(index, 1);
    saveEntriesToStorage();
  }
}

// Shows the "Delete?" question in the row of this entry
function askToDelete(date) {
  dateToConfirmDelete = date;
  render();
  // Put the keyboard focus on "No", so a keyboard user can answer right away
  document.getElementById("cancel-delete-button").focus();
}

// "Yes" was clicked: really delete the entry
function confirmDelete(date) {
  deleteEntryByDate(date);
  dateToConfirmDelete = null;
  render();
}

// "No" was clicked: hide the question again, nothing is deleted
function cancelDelete() {
  dateToConfirmDelete = null;
  render();
}

// Creates a small button with the given text and extra CSS class
function createSmallButton(text, extraClass) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.className = "small-button " + extraClass;
  return button;
}

// Puts the question "Delete?" with a "Yes" and a "No" button into the cell
function addConfirmButtons(cell, date) {
  const question = document.createElement("span");
  question.textContent = "Delete?";
  question.className = "confirm-question";

  const yesButton = createSmallButton("Yes", "");
  yesButton.addEventListener("click", function () {
    confirmDelete(date);
  });

  const noButton = createSmallButton("No", "outline-button");
  noButton.id = "cancel-delete-button";
  noButton.addEventListener("click", cancelDelete);

  cell.appendChild(question);
  cell.appendChild(yesButton);
  cell.appendChild(noButton);
}

// Creates the last cell of a row: a "Delete" button, or the "Delete?" question
function createDeleteCell(entry) {
  const cell = document.createElement("td");
  cell.className = "actions-cell";

  if (entry.date === dateToConfirmDelete) {
    addConfirmButtons(cell, entry.date);
    return cell;
  }

  const deleteButton = createSmallButton("Delete", "outline-button");
  deleteButton.setAttribute("aria-label", "Delete entry for " + entry.date);
  deleteButton.addEventListener("click", function () {
    askToDelete(entry.date);
  });
  cell.appendChild(deleteButton);
  return cell;
}

// Creates one table row (<tr>) for an entry
function createTableRow(entry) {
  let sleepText = "–";
  if (entry.sleep !== null) {
    sleepText = entry.sleep;
  }

  const row = document.createElement("tr");
  row.appendChild(createCell(entry.date));
  row.appendChild(createLevelCell(entry.pain));
  row.appendChild(createLevelCell(entry.fatigue));
  row.appendChild(createCell(sleepText));
  row.appendChild(createCell(entry.note));
  row.appendChild(createDeleteCell(entry));
  return row;
}

// Fills the table with the given entries
function renderTable(entriesToShow) {
  // Remove the old rows first, so nothing appears twice
  entryTableBody.innerHTML = "";

  for (let i = 0; i < entriesToShow.length; i++) {
    const row = createTableRow(entriesToShow[i]);
    entryTableBody.appendChild(row);
  }
}

// Draws everything on the right side of the page again.
// Is called after every change. (Summary and chart are added in later steps.)
function render() {
  const sortedEntries = getSortedEntries();

  // No entries: show the friendly message instead of an empty table
  if (sortedEntries.length === 0) {
    emptyMessage.hidden = false;
    entryTable.hidden = true;
    return;
  }

  emptyMessage.hidden = true;
  entryTable.hidden = false;
  renderTable(sortedEntries);
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
  render();
}

entryForm.addEventListener("submit", handleEntrySubmit);
painInput.addEventListener("input", showSliderValues);
fatigueInput.addEventListener("input", showSliderValues);

// When the page opens: load saved entries, prepare the form (date = today) and draw the table
loadEntriesFromStorage();
resetForm();
render();
