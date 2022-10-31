const state = new DataStore();
const board = new Board();
const generator = new Generator();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}

board._handleWin = function () {
  state.data.level[`${state.data.gridSizeX}x${state.data.gridSizeY}`]++;
  state.save();
  newGame();
};

function load() {
  state.load();

  const welcome = document.createElement("h2");
  welcome.innerText = `Welcome${state.data.returning ? " back" : ""}${
    state.data.nickname ? `, ${state.data.nickname}` : ""
  }!`;
  document.getElementById("title").appendChild(welcome);

  refreshTheme();
}

function play() {
  if (state.data.returning) {
    newGame();
    moveToScreen("title", "game");
  } else {
    moveToScreen("title", "instructions");
    state.data.returning = true;
    state.save();
  }
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

  const level = state.data.level;
  const returning = state.data.returning;

  state.data = {
    gridSizeX,
    gridSizeY,
    theme,
    nickname,
    level,
    returning,
  };

  state.save();
  newGame();
}

function newGame() {
  const level = generator.generateLevel(
    (state.data.level[`${state.data.gridSizeX}x${state.data.gridSizeY}`] ??= 2),
    state.data.gridSizeX,
    state.data.gridSizeY
  );
  state.save();
  board.setupLevel(level);
}

function understood() {
  newGame();

  moveToScreen("instructions", "game");
}

function moveToScreen(current, next) {
  document.getElementById(current).classList.add("hidden");
  document.getElementById(next).classList.remove("hidden");
}

function refreshTheme(num) {
  document.body.classList = "";
  document.body.classList.add(`theme${num ? num : state.data.theme}`);
}
