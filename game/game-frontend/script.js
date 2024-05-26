let score = 0;
let timeLeft = 10;
let timer;

const clickButton = document.getElementById("click-button");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const bestScoresList = document.getElementById("best-scores");
const newGameButton = document.getElementById("new-game-button");
const playerNameInput = document.getElementById("player-name");
const themeToggle = document.getElementById("theme-toggle");

playerNameInput.addEventListener("input", () => {
  if (playerNameInput.value.trim()) {
    clickButton.disabled = false;
  } else {
    clickButton.disabled = true;
  }
});

clickButton.addEventListener("click", () => {
  if (timeLeft === 10 && !timer) {
    startGame();
  }
  if (timeLeft > 0) {
    score++;
    scoreDisplay.textContent = score;
  }
});

newGameButton.addEventListener("click", startNewGame);
themeToggle.addEventListener("change", toggleTheme);

function startGame() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timeDisplay.textContent = timeLeft;
    } else {
      clearInterval(timer);
      const playerName = playerNameInput.value.trim();
      if (playerName) {
        saveScore(playerName, score);
        alert(`Game over! ${playerName}, your score is ${score}`);
      } else {
        alert("Please enter your name to save your score.");
      }
      newGameButton.style.display = "block";
    }
  }, 1000);
}

function saveScore(name, score) {
  fetch("http://your-home-server-ip:3000/save-score", {
    // Replace 'your-home-server-ip' with your home server's IP address
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, score: score }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Score saved:", data);
      fetchScores();
    })
    .catch((error) => {
      console.error("Error saving score:", error);
    });
}

function fetchScores() {
  fetch("http://localhost:3000/get-scores") // Replace 'your-home-server-ip' with your home server's IP address
    .then((response) => response.json())
    .then((data) => {
      bestScoresList.innerHTML = "";
      data.forEach((scoreItem, index) => {
        const li = document.createElement("li");
        li.textContent = `#${index + 1}: ${scoreItem.name} - ${
          scoreItem.score
        }`;
        bestScoresList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching scores:", error);
    });
}

function startNewGame() {
  score = 0;
  timeLeft = 10;
  timer = null;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  clickButton.disabled = true;
  playerNameInput.value = "";
  newGameButton.style.display = "none";
  fetchScores();
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

fetchScores();
