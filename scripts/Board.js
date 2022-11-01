class Board {
  constructor() {
    this.boardDom = document.getElementById("gameBoard");

    this.reset();
    this._setupControls();
  }

  _moveLeft() {
    if (this.selectedCellX > 0) {
      this.moveTo(this.selectedCellX - 1, this.selectedCellY);
    }
  }
  _moveRight() {
    if (this.selectedCellX < this.gridSizeY - 1) {
      this.moveTo(this.selectedCellX + 1, this.selectedCellY);
    }
  }
  _moveUp() {
    if (this.selectedCellY > 0) {
      this.moveTo(this.selectedCellX, this.selectedCellY - 1);
    }
  }
  _moveDown() {
    if (this.selectedCellY < this.gridSizeX - 1) {
      this.moveTo(this.selectedCellX, this.selectedCellY + 1);
    }
  }
  moveTo(x, y) {
    this._unselectCurrentCell();

    const newCell = this._getCell(x, y);
    newCell.classList.add("selectedCell");
    newCell.innerText = parseInt(newCell.innerText) + 1;
    this.selectedCellX = x;
    this.selectedCellY = y;

    if (this._isWin()) this._handleWin();
    this._step();
  }

  _unselectCurrentCell() {
    this._getCell(this.selectedCellX, this.selectedCellY).classList.remove(
      "selectedCell"
    );
  }

  _getSelectedCell() {
    return this.cells.filter((cell) => cell.classList.includes("selected"))[0];
  }

  _step() {
    this.steps++;

    const remainingSteps = this.maxSteps - this.steps;

    document.getElementById("steps").innerText = remainingSteps;

    const warningTreshold = this.maxSteps * 0.2;

    if (warningTreshold == 0) warningTreshold = -10;

    if (remainingSteps < warningTreshold) {
      document.getElementById("steps").classList.add("warning");
    }
    if (remainingSteps == 0 && !this._isWin()) this._handleLose();
  }

  _handleLose() {
    alert("loser");
  }

  _isWin() {
    const value = this.cells[0].innerText;

    return this.cells.every((cell) => cell.innerText == value);
  }

  setupGame(game) {
    this.reset();
    this.gridSizeX = game.gridSizeX;
    this.gridSizeY = game.gridSizeY;

    document.getElementById("steps").innerText = this.maxSteps = game.steps;
    this._setupCells(game.board);
    this._setupSize();

    this._getCell(game.firstCell.x, game.firstCell.y).classList.add(
      "selectedCell"
    );

    this.selectedCellX = game.firstCell.x;
    this.selectedCellY = game.firstCell.y;

    this.startTime = Date.now();
    this.clock = setInterval(() => this.tick(), 1000);
  }

  reset() {
    this.boardDom.innerHTML = "";

    document.getElementById("steps").classList.remove("warning");

    this.steps = 0;
    this.startTime = 0;

    this.selectedCellX = 0;
    this.selectedCellY = 0;

    this.cells = [];

    document.getElementById("time").innerText = "0:00";
    if (this.clock) clearInterval(this.clock);
    this.clock = undefined;
  }

  tick() {
    const time = Math.floor((Date.now() - this.startTime) / 1000);

    const minutes = Math.floor(time / 60);
    console.log(minutes);
    const seconds = (time - minutes * 60).toString().padStart(2, "0");
    document.getElementById("time").innerText = `${minutes}:${seconds}`;
  }

  _setupCells(cells) {
    for (let i = 0; i < cells.length; i++) {
      const newCell = document.createElement("div");
      newCell.classList.add("cell");

      newCell.innerText = cells[i];
      this.boardDom.appendChild(newCell);

      this.cells.push(newCell);
    }
  }
  _setupSize() {
    this.boardDom.style[
      "grid-template-columns"
    ] = `repeat(${this.gridSizeY}, minmax(0, 1fr))`;
    this.boardDom.style[
      "grid-template-rows"
    ] = `repeat(${this.gridSizeX}, minmax(0, 1fr));`;
  }

  _getCell(x, y) {
    return this.cells[y * this.gridSizeY + x];
  }

  _handleWin() {
    alert("gg");
  }

  _setupControls() {
    document.addEventListener("keydown", (e) => {
      if (e.keyCode == 37) this._moveLeft();
      if (e.keyCode == 38) this._moveUp();
      if (e.keyCode == 39) this._moveRight();
      if (e.keyCode == 40) this._moveDown();
    });
    document.addEventListener("swiped", (e) => {
      if (e.detail.dir == "up") this._moveUp();
      if (e.detail.dir == "down") this._moveDown();
      if (e.detail.dir == "right") this._moveRight();
      if (e.detail.dir == "left") this._moveLeft();
    });
    gameControl.on("connect", (gamepad) => {
      gamepad
        .before("button0", () => this._moveUp())
        .before("button1", () => this._moveDown())
        .before("button2", () => this._moveRight())
        .before("button3", () => this._moveLeft());
    });
  }
}
