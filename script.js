const questions = [
  {
    questionText: "Which of the following provides the basic structure of sites?",
    options: ["1. javaScript", "2. HTML", "3. CSS", "4. Google Docs"],
    answer: "2. HTML",
  },
  {
    questionText: "What is CSS NOT used for?",
    options: [
      "1. creating the document's design",
      "2. control presentation",
      "3. Formatting",
      "4. Layout",
    ],
    answer: "1. Creating the document's design",
  },
  {
    questionText:
      "Which of the following is a Programming language?",
    options: ["1. Excel", "2. Word", "3. Power Point", "4. javaScript"],
    answer: "4. javaScript",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Through what school are you taking this course?",
    options: ["1. Coding Dojo", "2. Rutgers University", "3. Flar Iron", "4. App Academy"],
    answer: "2. Rutgers University",
  },
];

const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");

function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

function hideResultText() {
  resultDiv.style.display = "none";
}

var intervalID;
var time;
var currentQuestion;

document.querySelector("#start-button").addEventListener("click", startQuiz);

function startQuiz() {
  hideCards();
  questionCard.removeAttribute("hidden");

  currentQuestion = 0;
  displayQuestion();

  time = questions.length * 10;

  intervalID = setInterval(countdown, 1000);

  displayTime();
}

function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}

const timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}

function displayQuestion() {
  let question = questions[currentQuestion];
  let options = question.options;

  let h2QuestionElement = document.querySelector("#question-text");
  h2QuestionElement.textContent = question.questionText;

  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    let optionButton = document.querySelector("#option" + i);
    optionButton.textContent = option;
  }
}

document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

function optionIsCorrect(optionButton) {
  return optionButton.textContent === questions[currentQuestion].answer;
}

function checkAnswer(eventObject) {
  let optionButton = 
eventObject.target
;
  resultDiv.style.display = "block";
  if (optionIsCorrect(optionButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResultText, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResultText, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      time = 0;
      displayTime();
      endQuiz();
    }
  }

  currentQuestion++;
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

const score = document.querySelector("#score");

function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");

submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  event.preventDefault();

  if (!inputElement.value) {
    alert("Please enter your initials before pressing submit!");
    return;
  }

  let leaderboardItem = {
    initials: inputElement.value,
    score: time,
  };

  updateStoredLeaderboard(leaderboardItem);

  hideCards();
  leaderboardCard.removeAttribute("hidden");

  renderLeaderboard();
}

function updateStoredLeaderboard(leaderboardItem) {
  let leaderboardArray = getLeaderboard();
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

function getLeaderboard() {
  let storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}

function renderLeaderboard() {
  let sortedLeaderboardArray = sortLeaderboard();
  const highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedLeaderboardArray.length; i++) {
    let leaderboardEntry = sortedLeaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}

function sortLeaderboard() {
  let leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }

  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return leaderboardArray;
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

function clearHighscores() {
  localStorage.clear();
  renderLeaderboard();
}

const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}

const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  clearInterval(intervalID);

  time = undefined;
  displayTime();

  renderLeaderboard();
} 

