// All saved word pairs. Each pair is an object: { english: "...", german: "..." }
const wordPairs = [];

// Get the HTML elements we need
const addForm = document.getElementById("add-form");
const englishInput = document.getElementById("english-input");
const germanInput = document.getElementById("german-input");
const formMessage = document.getElementById("form-message");
const wordList = document.getElementById("word-list");

// Name under which the word pairs are stored in localStorage
const storageKey = "wordPairs";

// Saves the wordPairs array in localStorage (as JSON text)
function saveWordPairs() {
  const pairsAsText = JSON.stringify(wordPairs);
  localStorage.setItem(storageKey, pairsAsText);
}

// Loads saved word pairs from localStorage into the wordPairs array
function loadWordPairs() {
  const pairsAsText = localStorage.getItem(storageKey);

  // Nothing saved yet (first visit)
  if (pairsAsText === null) {
    return;
  }

  const savedPairs = JSON.parse(pairsAsText);
  for (let i = 0; i < savedPairs.length; i++) {
    wordPairs.push(savedPairs[i]);
  }
}

// Checks if both input fields contain text (spaces alone do not count)
function inputsAreFilled(englishText, germanText) {
  if (englishText === "" || germanText === "") {
    return false;
  }
  return true;
}

// Adds a new word pair to the wordPairs array
function addWordPair(englishText, germanText) {
  const newPair = {
    english: englishText,
    german: germanText
  };
  wordPairs.push(newPair);
  saveWordPairs();
}

// Empties both input fields and puts the cursor back in the English field
function clearForm() {
  englishInput.value = "";
  germanInput.value = "";
  englishInput.focus();
}

// Removes the word pair at the given position and updates the list
function deleteWordPair(index) {
  wordPairs.splice(index, 1);
  saveWordPairs();
  showWordList();
}

// Creates one list row: the word pair text and a "Delete" button
function createListItem(pair, index) {
  const listItem = document.createElement("li");

  const pairText = document.createElement("span");
  pairText.textContent = pair.english + " – " + pair.german;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", function () {
    deleteWordPair(index);
  });

  listItem.appendChild(pairText);
  listItem.appendChild(deleteButton);
  return listItem;
}

// Shows all word pairs from the wordPairs array in the list on the page
function showWordList() {
  // Remove the old list entries first, so nothing appears twice
  wordList.innerHTML = "";

  for (let i = 0; i < wordPairs.length; i++) {
    const listItem = createListItem(wordPairs[i], i);
    wordList.appendChild(listItem);
  }
}

// Runs when the form is submitted
function handleFormSubmit(event) {
  // Stop the browser from reloading the page
  event.preventDefault();

  const englishText = englishInput.value.trim();
  const germanText = germanInput.value.trim();

  if (inputsAreFilled(englishText, germanText) === false) {
    formMessage.textContent = "Please fill in both fields.";
    return;
  }

  addWordPair(englishText, germanText);
  showWordList();
  clearForm();
  formMessage.textContent = "Added: " + englishText + " – " + germanText;
}

addForm.addEventListener("submit", handleFormSubmit);

// When the page opens: load saved pairs and show them
loadWordPairs();
showWordList();
