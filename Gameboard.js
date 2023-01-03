const Gameboard = (() => {
    const board = [[null, null , null],
    [null, null, null],
    [null, null, null]]

    let currentPlayer = "x";

    const changeTurns = () => {
        if (check() || draw()) return;
        currentPlayer = currentPlayer === "x" ? "o" : "x";
    }

    const isEmpty = (x, y) => {
        return board[x][y] == null;
    }

    const isSymbol = (x, y) => {
        return board[x][y] === currentPlayer;
    }

    const horizontalCheck = () => {
        for (let i = 0; i < 3; i++) {
            if (isSymbol(0, i) && isSymbol(1, i) && isSymbol(2, i)) return true;
        }
        return false;
    }

    const verticalCheck = () => {
        for (let i = 0; i < 3; i++) {
            if (isSymbol(i, 0) && isSymbol(i, 1) && isSymbol(i, 2)) return true;
        }
        return false;
    }

    const diagonalCheck = () => {
        return (isSymbol(0, 0) && isSymbol(1, 1) && isSymbol(2, 2)) || (isSymbol(2, 0) && isSymbol(1, 1) && isSymbol(0, 2));
    }

    const check = () => {
        if (horizontalCheck() || verticalCheck() || diagonalCheck()) {
            events.emit("game ended", currentPlayer == "x" ? 0 : 2)
            return true;
        }; 
        return false;
    }

    const draw = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (isEmpty(i, j)) return false;
            }
        }
        events.emit("game ended", 1);
        return true;
    }

    const place = (x, y) => {
        if (!isEmpty(x, y)) return false; 
        board[x][y] = currentPlayer; 
        changeTurns();
        events.emit("redraw", {});
        return true;
    }

    const getCell = (x, y) => {
        return board[x][y];
    }

    const clear = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = null;
            }
        }
        currentPlayer = "x";
    }

    const generateMove = () => {
        if (check() || draw()) return;
        let x = Math.floor(Math.random() * 3);
        let y = Math.floor(Math.random() * 3);
        while (!isEmpty(x, y)) {
            x = Math.floor(Math.random() * 3);
            y = Math.floor(Math.random() * 3);
        }
        place(x, y);
    }

    events.on("game ended", (result) => {events.emit("clear", {});});
    events.on("clear", clear);

    return { 
        place, getCell, generateMove, clear
    }

})();