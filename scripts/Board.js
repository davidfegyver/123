class Board {
    constructor() {
        this.boardDom = document.getElementById("gameBoard")

        this.reset()
        this._setupControls()
    }

    _moveLeft() {
        if (this.selectedCellX > 0) {
            this.moveTo(this.selectedCellX - 1, this.selectedCellY)
        }
    }
    _moveRight() {
        if (this.selectedCellX < this.gridSizeY - 1) {
            this.moveTo(this.selectedCellX + 1, this.selectedCellY)
        }
    }
    _moveUp() {
        if (this.selectedCellY > 0) {
            this.moveTo(this.selectedCellX, this.selectedCellY - 1)
        }
    }
    _moveDown() {
        if (this.selectedCellY < this.gridSizeX - 1) {
            this.moveTo(this.selectedCellX, this.selectedCellY + 1)
        }
    }
    moveTo(x, y) {
        this._unselectCurrentCell()

        const newCell = this._getCell(x, y)
        newCell.classList.add("selectedCell")
        newCell.innerText = parseInt(newCell.innerText) + 1
        this.selectedCellX = x
        this.selectedCellY = y

        this._addStep()
        if (this._isWin()) this._handleWin()
    }

    _unselectCurrentCell() {
        this._getCell(this.selectedCellX, this.selectedCellY).classList.remove("selectedCell")
    }

    _getSelectedCell() {
        return this.cells.filter(cell => cell.classList.includes("selected"))[0]
    }

    _addStep() {
        this.stepCount++
        document.getElementById("steps").innerText = this.stepCount


    }

    _isWin() {
        const value = this.cells[0].innerText

        return this.cells.every(cell => cell.innerText == value)
    }

    setupLevel(level) {
        this.reset()
        this.gridSizeX = level.gridSizeX
        this.gridSizeY = level.gridSizeY
        this._setupCells(level.board)
        this._setupSize();


        this._getCell(level.firstCell.x, level.firstCell.y).classList.add("selectedCell")

        this.selectedCellX = level.firstCell.x
        this.selectedCellY = level.firstCell.y
    }

    reset() {
        this.boardDom.innerHTML = ""

        this.stepCount = 0
        this.startTime = 0

        this.selectedCellX = 0
        this.selectedCellY = 0

        this.cells = []
    }

    _setupCells(cells) {
        for (let i = 0; i < cells.length; i++) {
            const newCell = document.createElement("div")
            newCell.classList.add("cell")

            newCell.innerText = cells[i]
            this.boardDom.appendChild(newCell)

            this.cells.push(newCell)
        }

    }
    _setupSize() {
        this.boardDom.style["grid-template-columns"] = `repeat(${this.gridSizeY}, minmax(0, 1fr))`
        this.boardDom.style["grid-template-rows"] = `repeat(${this.gridSizeX}, minmax(0, 1fr));`
    }

    _getCell(x, y) {
        return this.cells[y * this.gridSizeY + x]
    }

    _handleWin() {

        alert()
    }

    _setupControls() {
        document.addEventListener("keydown", e => {
            if (e.keyCode == 37) this._moveLeft();
            if (e.keyCode == 38) this._moveUp();
            if (e.keyCode == 39) this._moveRight();
            if (e.keyCode == 40) this._moveDown();
        });
        document.addEventListener("swiped", e => {
            if (e.detail.dir == "up") this._moveUp();
            if (e.detail.dir == "down") this._moveDown();
            if (e.detail.dir == "right") this._moveRight();
            if (e.detail.dir == "left") this._moveLeft();
        });
        gameControl.on('connect', gamepad => {
            gamepad
                .before('button0', () => this._moveUp())
                .before('button1', () => this._moveDown())
                .before('button2', () => this._moveRight())
                .before('button3', () => this._moveLeft())
        });
    }
}