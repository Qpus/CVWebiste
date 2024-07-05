document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const clickBtn = document.getElementById("clickBtn");
  const nameInput = document.getElementById("name");
  const gameArea = document.getElementById("gameArea");
  const timeLeft = document.getElementById("timeLeft");
  const scoreDisplay = document.getElementById("score");
  const scoresList = document.getElementById("scoresList");

  let score = 0;
  let timer;

  startBtn.addEventListener("click", () => {
    const playerName = nameInput.value.trim();
    if (!playerName) {
      alert("Please enter your name");
      return;
    }

    score = 0;
    scoreDisplay.textContent = score;
    gameArea.style.display = "block";
    nameInput.style.display = "none";
    startBtn.style.display = "none";

    let time = 10;
    timeLeft.textContent = time;
    timer = setInterval(() => {
      time--;
      timeLeft.textContent = time;
      if (time === 0) {
        clearInterval(timer);
        gameArea.style.display = "none";
        submitScore(playerName, score);
        nameInput.style.display = "block";
        startBtn.style.display = "block";
        fetchScores();
      }
    }, 1000);
  });

  clickBtn.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;
  });

  function submitScore(name, score) {
    fetch("http://54.82.204.172:3000/submit-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, score }),
    });
  }

  function fetchScores() {
    fetch("http://54.82.204.172:3000/get-scores")
      .then((response) => response.json())
      .then((data) => {
        scoresList.innerHTML = "";
        data.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = `${item.name}: ${item.score}`;
          scoresList.appendChild(li);
        });
      });
  }

  fetchScores();
});
