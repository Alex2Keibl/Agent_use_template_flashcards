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

const period7Button = document.getElementById("period-7-button");
const period30Button = document.getElementById("period-30-button");
const periodAllButton = document.getElementById("period-all-button");
const summaryBox = document.getElementById("summary");
const painAverageText = document.getElementById("pain-average");
const painLowestText = document.getElementById("pain-lowest");
const painHighestText = document.getElementById("pain-highest");
const fatigueAverageText = document.getElementById("fatigue-average");
const fatigueLowestText = document.getElementById("fatigue-lowest");
const fatigueHighestText = document.getElementById("fatigue-highest");
const badDaysCountText = document.getElementById("bad-days-count");
const loadFileButton = document.getElementById("load-file-button");
const fileInput = document.getElementById("file-input");
const importMessage = document.getElementById("import-message");
const chartBox = document.getElementById("chart-box");
const chartSvg = document.getElementById("chart");

// F8: Size of the drawing area inside the SVG (in SVG units, see viewBox="0 0 600 300")
const chartLeft = 50;
const chartRight = 580;
const chartTop = 20;
const chartBottom = 250;

// F4: Date of the entry whose "Delete?" question is currently shown (null = none)
let dateToConfirmDelete = null;

// F7: Selected period in days (7 or 30). 0 means "All".
let selectedPeriodDays = 0;

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

// Turns a Date object into text in the format "YYYY-MM-DD"
function formatDateAsText(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Returns today's date as text in the format "YYYY-MM-DD"
function getTodayAsText() {
  return formatDateAsText(new Date());
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

// Returns the first date of the period as "YYYY-MM-DD".
// Example: 7 days → today and the 6 days before.
function getPeriodStartText(days) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  return formatDateAsText(startDate);
}

// Returns only the entries inside the selected period
function getEntriesInPeriod(allEntries) {
  if (selectedPeriodDays === 0) {
    return allEntries;
  }

  const startText = getPeriodStartText(selectedPeriodDays);
  const entriesInPeriod = [];
  for (let i = 0; i < allEntries.length; i++) {
    if (allEntries[i].date >= startText) {
      entriesInPeriod.push(allEntries[i]);
    }
  }
  return entriesInPeriod;
}

// Highlights the button of the selected period (aria-pressed="true")
function updatePeriodButtons() {
  period7Button.setAttribute("aria-pressed", String(selectedPeriodDays === 7));
  period30Button.setAttribute("aria-pressed", String(selectedPeriodDays === 30));
  periodAllButton.setAttribute("aria-pressed", String(selectedPeriodDays === 0));
}

// Runs when a period button is clicked
function selectPeriod(days) {
  selectedPeriodDays = days;
  render();
}

// Returns a list of numbers, e.g. all pain values: getLevels(list, "pain") → [4, 6, 7]
function getLevels(entryList, fieldName) {
  const levels = [];
  for (let i = 0; i < entryList.length; i++) {
    levels.push(entryList[i][fieldName]);
  }
  return levels;
}

// Returns the average of a list of numbers
function calculateAverage(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum = sum + numbers[i];
  }
  return sum / numbers.length;
}

// Returns the smallest number of a list
function findLowest(numbers) {
  let lowest = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < lowest) {
      lowest = numbers[i];
    }
  }
  return lowest;
}

// Returns the biggest number of a list
function findHighest(numbers) {
  let highest = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > highest) {
      highest = numbers[i];
    }
  }
  return highest;
}

// Counts the "bad days": pain or fatigue is 7 or higher
function countBadDays(entryList) {
  let count = 0;
  for (let i = 0; i < entryList.length; i++) {
    if (entryList[i].pain >= 7 || entryList[i].fatigue >= 7) {
      count = count + 1;
    }
  }
  return count;
}

// F6: Fills the summary cards with the numbers for the given entries
function renderSummary(entryList) {
  const painLevels = getLevels(entryList, "pain");
  const fatigueLevels = getLevels(entryList, "fatigue");

  // toFixed(1) shows the average with one decimal place, e.g. 5.3
  painAverageText.textContent = calculateAverage(painLevels).toFixed(1);
  painLowestText.textContent = findLowest(painLevels);
  painHighestText.textContent = findHighest(painLevels);

  fatigueAverageText.textContent = calculateAverage(fatigueLevels).toFixed(1);
  fatigueLowestText.textContent = findLowest(fatigueLevels);
  fatigueHighestText.textContent = findHighest(fatigueLevels);

  badDaysCountText.textContent = countBadDays(entryList);
}

// Creates an SVG element (e.g. "line") with the given attributes and adds it to the chart.
// SVG elements need createElementNS instead of createElement.
function addSvgElement(tagName, attributes) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  for (const name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
  chartSvg.appendChild(element);
  return element;
}

// Returns the y position for a level from 0 to 10 (0 = bottom, 10 = top)
function getChartY(level) {
  const chartHeight = chartBottom - chartTop;
  return chartBottom - (level / 10) * chartHeight;
}

// Returns the x position of the point number "index" when there are "count" points
function getChartX(index, count) {
  if (count === 1) {
    return (chartLeft + chartRight) / 2;
  }
  const step = (chartRight - chartLeft) / (count - 1);
  return chartLeft + index * step;
}

// Draws the y-axis: grey lines and numbers for 0, 2, 4, 6, 8, 10
function drawYAxis() {
  for (let level = 0; level <= 10; level = level + 2) {
    const y = getChartY(level);
    addSvgElement("line", { x1: chartLeft, y1: y, x2: chartRight, y2: y, class: "chart-grid" });
    const label = addSvgElement("text", { x: chartLeft - 12, y: y + 5, class: "chart-label", "text-anchor": "end" });
    label.textContent = level;
  }
}

// Draws the dashed line at 7 with the label "bad day"
function drawBadDayLine() {
  const y = getChartY(7);
  addSvgElement("line", { x1: chartLeft, y1: y, x2: chartRight, y2: y, class: "chart-bad-day" });
  const label = addSvgElement("text", { x: chartRight, y: y - 6, class: "chart-label", "text-anchor": "end" });
  label.textContent = "bad day";
}

// Writes the dates under the x-axis (only some of them if there are many)
function drawXLabels(entryList) {
  // Show at most about 7 dates, so they do not overlap
  const labelStep = Math.ceil(entryList.length / 7);

  for (let i = 0; i < entryList.length; i = i + labelStep) {
    const x = getChartX(i, entryList.length);
    const label = addSvgElement("text", { x: x, y: chartBottom + 30, class: "chart-label", "text-anchor": "middle" });
    // Show only month and day, e.g. "11-14" instead of "2026-11-14"
    label.textContent = entryList[i].date.slice(5);
  }
}

// Draws one line (pain or fatigue) with a small dot for every day
function drawDataLine(entryList, fieldName) {
  // Add the line first, so the dots are drawn on top of it
  const line = addSvgElement("polyline", { class: fieldName + "-line" });

  let points = "";
  for (let i = 0; i < entryList.length; i++) {
    const x = getChartX(i, entryList.length);
    const y = getChartY(entryList[i][fieldName]);
    points = points + x + "," + y + " ";
    addSvgElement("circle", { cx: x, cy: y, r: 5, class: fieldName + "-point" });
  }
  line.setAttribute("points", points);
}

// F8: Draws the whole chart for the given entries (they come newest first)
function renderChart(entryList) {
  // Remove the old drawing first
  chartSvg.innerHTML = "";

  // The chart goes from left (oldest) to right (newest), so we reverse a copy
  const oldestFirst = entryList.slice().reverse();

  drawYAxis();
  drawBadDayLine();
  drawXLabels(oldestFirst);
  drawDataLine(oldestFirst, "pain");
  drawDataLine(oldestFirst, "fatigue");
}

// Shows the friendly message instead of the summary and the table
function showEmptyMessage() {
  if (entries.length === 0) {
    emptyMessage.textContent = "No entries yet. Save your first day above.";
  } else {
    emptyMessage.textContent = "No entries in this period. Try a longer period.";
  }
  emptyMessage.hidden = false;
  summaryBox.hidden = true;
  chartBox.hidden = true;
  entryTable.hidden = true;
}

// Draws everything in the "My days" section again: summary, chart and table.
// Is called after every change.
function render() {
  updatePeriodButtons();
  const entriesToShow = getEntriesInPeriod(getSortedEntries());

  if (entriesToShow.length === 0) {
    showEmptyMessage();
    return;
  }

  emptyMessage.hidden = true;
  summaryBox.hidden = false;
  chartBox.hidden = false;
  entryTable.hidden = false;
  renderSummary(entriesToShow);
  renderChart(entriesToShow);
  renderTable(entriesToShow);
}

// ---------- F9: Load entries from a text file ----------
// File format (first line is the header, one line per day):
// date;pain;fatigue;sleep;note
// 2026-11-01;4;5;7;
// 2026-11-02;6;7;5.5;bad night

// Returns the part number "index" of a line without spaces, or "" if it is missing
function getPart(parts, index) {
  if (index >= parts.length) {
    return "";
  }
  return parts[index].trim();
}

// Turns a pain or fatigue text into a number. Empty text gives -1 (= not valid).
function parseLevel(text) {
  if (text === "") {
    return -1;
  }
  return Number(text);
}

// Checks if a text is a real date in the format "YYYY-MM-DD"
function isValidDateText(text) {
  if (text.length !== 10 || text.charAt(4) !== "-" || text.charAt(7) !== "-") {
    return false;
  }
  // Date.parse gives NaN ("not a number") for dates like "2026-13-45"
  return Number.isNaN(Date.parse(text)) === false;
}

// Checks if the sleep text is empty or a number from 0 to 24
function isValidSleepText(text) {
  if (text === "") {
    return true;
  }
  const hours = Number(text);
  return Number.isNaN(hours) === false && hours >= 0 && hours <= 24;
}

// Turns one line of the file into an entry object, or returns null if a value is wrong
function parseLine(line) {
  const parts = line.split(";");
  const date = getPart(parts, 0);
  const pain = parseLevel(getPart(parts, 1));
  const fatigue = parseLevel(getPart(parts, 2));
  const sleepText = getPart(parts, 3);

  if (isValidDateText(date) === false || isValidLevel(pain) === false ||
      isValidLevel(fatigue) === false || isValidSleepText(sleepText) === false) {
    return null;
  }

  let sleep = null;
  if (sleepText !== "") {
    sleep = Number(sleepText);
  }
  return { date: date, pain: pain, fatigue: fatigue, sleep: sleep, note: getPart(parts, 4) };
}

// Shows how many lines were imported, skipped (wrong values) or already existed
function showImportMessage(importedCount, skippedCount, existingCount) {
  let text = importedCount + " entries loaded.";
  if (skippedCount > 0) {
    text = text + " " + skippedCount + " lines skipped because of wrong values.";
  }
  if (existingCount > 0) {
    text = text + " " + existingCount + " days already existed and were kept.";
  }
  importMessage.textContent = text;
}

// Reads all lines of the file text and adds the valid, new entries
function importText(fileText) {
  const lines = fileText.split("\n");
  let importedCount = 0;
  let skippedCount = 0;
  let existingCount = 0;

  // Start at 1, because line 0 is the header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") {
      continue; // empty lines are simply ignored
    }

    const entry = parseLine(line);
    if (entry === null) {
      skippedCount = skippedCount + 1;
    } else if (findEntryIndexByDate(entry.date) !== -1) {
      existingCount = existingCount + 1; // existing entries stay unchanged
    } else {
      entries.push(entry);
      importedCount = importedCount + 1;
    }
  }

  saveEntriesToStorage();
  render();
  showImportMessage(importedCount, skippedCount, existingCount);
}

// Runs when a file was chosen in the file picker: reads it with FileReader
function handleFileChosen() {
  const file = fileInput.files[0];
  if (file === undefined) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", function () {
    importText(reader.result);
  });
  reader.readAsText(file);

  // Reset the file field, so the same file can be chosen again later
  fileInput.value = "";
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

period7Button.addEventListener("click", function () {
  selectPeriod(7);
});
period30Button.addEventListener("click", function () {
  selectPeriod(30);
});
periodAllButton.addEventListener("click", function () {
  selectPeriod(0);
});

// F9: The button opens the (invisible) file picker
loadFileButton.addEventListener("click", function () {
  fileInput.click();
});
fileInput.addEventListener("change", handleFileChosen);

// When the page opens: load saved entries, prepare the form (date = today) and draw the table
loadEntriesFromStorage();
resetForm();
render();
