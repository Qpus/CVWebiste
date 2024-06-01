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
  clickButton.disabled = !playerNameInput.value.trim();
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
      timer = null; // Reset timer variable
      const playerName = playerNameInput.value.trim();
      if (playerName) {
        saveScore(playerName, score);
        alert(`Game over! ${playerName}, your score is ${score}`);
      } else {
        alert("Please enter your name to save your score.");
      }
      newGameButton.style.visibility = "visible";
      clickButton.disabled = true; // Disable click button after game ends
    }
  }, 1000);
}

function saveScore(name, score) {
  fetch("http://ec2-174-129-96-21.compute-1.amazonaws.com:3000/save-score", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score: 100 }),
  })
    .then((response) => {
      console.log(
        "Request sent, but no response data available in no-cors mode."
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  // fetch("http://ec2-174-129-96-21.compute-1.amazonaws.com:3000/save-score", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ name, score }),
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok " + response.statusText);
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log("Score saved:", data);
  //     fetchScores();
  //   })
  //   .catch((error) => {
  //     console.error("Error saving score:", error);
  //   });
}

function fetchScores() {
  fetch("http://ec2-174-129-96-21.compute-1.amazonaws.com:3000/get-scores")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      bestScoresList.innerHTML = "";
      data.forEach((scoreItem, index) => {
        const li = document.createElement("li");
        li.textContent = `#${index + 1}: ${scoreItem.name} - ${
          scoreItem.score
        } - ${scoreItem.date}`;
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
  clearInterval(timer); // Clear any existing timer
  timer = null;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  clickButton.disabled = true;
  playerNameInput.value = "";
  newGameButton.style.visibility = "hidden";
  fetchScores();
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

fetchScores();
