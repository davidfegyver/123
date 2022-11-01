const state = new DataStore();
const board = new Board();
const generator = new Generator();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}

function load() {
  state.load();

  const welcome = document.createElement("p");
  welcome.id = "welcome";
  welcome.innerText = `Welcome${state.data.returning ? " back" : ""}${
    state.data.nickname ? `, ${state.data.nickname}` : ""
  }!`;
  document.getElementById("title").appendChild(welcome);

  refreshTheme();
}

function play() {
  if (state.data.returning) {
    startGame();
    moveToScreen("title", "game");
  } else {
    setupFaq();
    moveToScreen("title", "instructions");
    state.data.returning = true;
    state.save();
  }
}

function startGame() {
  let game;
  let lastGame =
    state.data.lastGames[`${state.data.gridSizeX}x${state.data.gridSizeY}`];

  if (lastGame) {
    game = lastGame;
  } else {
    state.data.lastGames[`${state.data.gridSizeX}x${state.data.gridSizeY}`] =
      game = generator.generateGame(
        2,
        state.data.gridSizeX,
        state.data.gridSizeY
      );
    state.save();
  }

  document.getElementById("gameBoard").classList.add("fadeInAndOut");
  setTimeout(() => {
    board.setupGame(game);
  }, 600);

  setTimeout(() => {
    document.getElementById("gameBoard").classList.remove("fadeInAndOut");
  }, 1200);
}

function openSettings() {
  moveToScreen("game", "settings");

  document.getElementById("x").value = state.data.gridSizeX;
  document.getElementById("y").value = state.data.gridSizeY;
  document.getElementById("theme").value = state.data.theme;
  document.getElementById("nickname").value = state.data.nickname;
}

function closeSettings() {
  moveToScreen("settings", "game");

  const gridSizeX = document.getElementById("x").value;
  const gridSizeY = document.getElementById("y").value;
  const theme = document.getElementById("theme").value;
  const nickname = document.getElementById("nickname").value;

  const lastGames = state.data.lastGames;
  const returning = state.data.returning;

  state.data = {
    gridSizeX,
    gridSizeY,
    theme,
    nickname,
    lastGames,
    returning,
  };

  state.save();
  startGame();
}

function moveToScreen(current, next) {
  document.getElementById(current).classList.add("hidden");
  document.getElementById(next).classList.remove("hidden");
}

function refreshTheme(num) {
  document.body.classList = "";
  document.body.classList.add(`theme${num ? num : state.data.theme}`);
}

let i = 0;
const faq = [
  {
    question: "How to play?",
    answer:
      "Move the cursor around to select different cells in the grid. Selecting a square makes the number inside it increase by one. The goal is to make the numbers in all cells equal before you run out of steps.",
  },
  {
    question: "How can I select a cell?",
    answer:
      "You can move the cursor with the arrow keys on your keyboard, swiping on your touch screen, or by using an external controller, such as a gamepad or a dance mat.",
  },
  {
    question: "Can I install this as an application?",
    answer:
      'Yes! This game is a PWA, what means you can install it to your device as an application by clicking the "Add to your home screen" or similar button in your browser.',
  },
];
function setupFaq() {
  document.getElementById("question").innerText = faq[i].question;
  document.getElementById("answer").innerText = faq[i].answer;
}
function understood() {
  if (i + 1 < faq.length) {
    i++;
    return setupFaq();
  }
  startGame();

  moveToScreen("instructions", "game");
}

board._handleWin = function () {
  const lastLevel =
    state.data.lastGames[`${state.data.gridSizeX}x${state.data.gridSizeY}`]
      .steps;

  state.data.lastGames[`${state.data.gridSizeX}x${state.data.gridSizeY}`] =
    generator.generateGame(
      lastLevel + 1,
      state.data.gridSizeX,
      state.data.gridSizeY
    );
  state.save();

  startGame();
};

board._handleLose = function () {
  startGame();
};
