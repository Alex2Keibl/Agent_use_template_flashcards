// All saved word pairs. Each pair is an object: { english: "...", german: "..." }
const wordPairs = [];

// Get the HTML elements we need
const addForm = document.getElementById("add-form");
const englishInput = document.getElementById("english-input");
const germanInput = document.getElementById("german-input");
const formMessage = document.getElementById("form-message");
const wordList = document.getElementById("word-list");

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
}

// Empties both input fields and puts the cursor back in the English field
function clearForm() {
  englishInput.value = "";
  germanInput.value = "";
  englishInput.focus();
}

// Shows all word pairs from the wordPairs array in the list on the page
function showWordList() {
  // Remove the old list entries first, so nothing appears twice
  wordList.innerHTML = "";

  for (let i = 0; i < wordPairs.length; i++) {
    const pair = wordPairs[i];
    const listItem = document.createElement("li");
    listItem.textContent = pair.english + " – " + pair.german;
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
