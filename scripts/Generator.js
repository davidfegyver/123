class Generator {
  generateGame(numOfSteps, gridSizeX, gridSizeY) {
    const endNum = this._randInt(-10, +30);

    const game = {
      gridSizeX,
      gridSizeY,
      board: new Array(gridSizeX * gridSizeY).fill(endNum),
      firstCell: {
        x: 0,
        y: 0,
      },
      steps: numOfSteps,
    };

    let i = 0;

    let currentCell = {
      x: this._randInt(0, gridSizeY - 1),
      y: this._randInt(0, gridSizeX - 1),
    };
    let lastCell = {};
    while (i < numOfSteps) {
      const onerandom = this._stepOneRandom(
        currentCell.x,
        currentCell.y,
        gridSizeX,
        gridSizeY
      );
      if (onerandom) {
        lastCell = currentCell;
        currentCell = onerandom;
        --game.board[currentCell.y * gridSizeY + currentCell.x];

        i++;
      }
    }

    game.firstCell = lastCell;

    return game;
  }

  _stepOneRandom(fromX, fromY, gridSizeX, gridSizeY) {
    const XorY = this._getXorY();

    let x = XorY ? fromX + this._getRandomDirection() : fromX;
    let y = XorY ? fromY : fromY + this._getRandomDirection();

    const validOnXAxis = x >= 0 && x < gridSizeY;
    const validOnYAxis = y >= 0 && y < gridSizeX;

    if (validOnXAxis && validOnYAxis) {
      return {
        x,
        y,
      };
    }

    return false;
  }

  _getXorY() {
    return Math.random() < 0.5;
  }
  _getRandomDirection() {
    return Math.random() < 0.5 ? -1 : 1;
  }
  _randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
