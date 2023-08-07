const startChecker = (() => {
    let hasStarted = false;
    let computerOpponent = false;

    const hasGameStarted = () => hasStarted;

    const start = () => hasStarted = true;

    const isVsComputer = () => computerOpponent;

    const playVsComputer = () => computerOpponent = true;

    const toggleDisabled = (val) => {
        const p2Field = document.querySelector("#player2-name")
        p2Field.disabled = val == 'yes' ? true : false;
    }

    return {hasGameStarted, start, isVsComputer, playVsComputer, toggleDisabled}
})();

const launch = () => {
    const player1Name = document.querySelector('#player1-name');
    const player2Name = document.querySelector('#player2-name');
    const playComputer = document.querySelector('#computer')
    const form = document.querySelector('.modal');

    form.classList.add('hidden');
    startChecker.start();

    if (player1Name.value.length > 0) {
        gameController.changePlayerName(1, player1Name.value);
        gameStart.setMessage(`~ Make your move, ${player1Name.value} ~`);
    } else {
        gameStart.setMessage(`~ Make your move, Player X ~`);
    }
    if (player2Name.value.length > 0) {
        gameController.changePlayerName(2, player2Name.value);
    }
    
    if (playComputer.value == 'yes') startChecker.playVsComputer();

}


const Player = (name, sign) => {
    this.name = name;
    this.sign = sign;

    const changeName = (newName) => {
        name = newName;
    }

    const getSign = () => sign;
    
    const getName = () => name;

    return { getSign, getName, changeName };
}

const gameBoard = (() => {
    const board = ['','','','','','','','',''];

    const setField = (index, sign) => board[index] = sign;

    const getField = (index) => board[index];

    const resetFields = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    }
    return {setField, getField, resetFields}
})();

const gameStart = (() => {
    const cells = document.querySelectorAll('.cell');
    const messageElement = document.querySelector('.message');
    const restartButton = document.querySelector('#restart');

    cells.forEach(each => {
        each.addEventListener('click',(event) => {
            if (event.target.innerHTML == '' && !gameController.getIsOver() && startChecker.hasGameStarted()) {
                gameController.playRound(parseInt(event.target.id));
                updateBoard();
            }
        });
    })

    restartButton.addEventListener('click', (event) => {
        gameBoard.resetFields();
        gameController.reset();
        updateBoard();
    })

    const updateBoard = () => {
        for (let i = 0; i < 9; i++) {
            cells[i].innerHTML = gameBoard.getField(i);
        }
    }

    const setMessage = (msg) => {
        messageElement.innerHTML = msg;
    }

    return { setMessage }
})();

const gameController = (() => {
    const playerX = Player('Player X', "X");
    const playerO = Player('Player O', "O");
    const gameover = document.querySelector('.gameover');
    let round = 1;
    let isOver = false;

    const playRound = (chosenIndex) => {
        gameBoard.setField(chosenIndex, getPlayerSign());
        if (checkWinner(chosenIndex)) {
            isOver = true;
            gameover.classList.remove('hidden');
            gameStart.setMessage(`~ ${getPlayerName()} has taken the victory! ~`);
            return;
        }
        round++;
        if (round == 10) {
            gameStart.setMessage("~ It's a stalemate! ~");
            isOver = true;
            return;
        }
        gameStart.setMessage(`~ Make your move, ${getPlayerName()} ~`);
        ifCompPlayRound();
    }

    const ifCompPlayRound = () => {
        if (startChecker.isVsComputer() && round % 2 == 0) {
            let move;
            do {
                move = Math.floor(Math.random() * 9)
            } while (gameBoard.getField(move))
            playRound(move);
        }
    }

    const changePlayerName = (player, name) => {
        player == 1 ? playerX.changeName(name) : playerO.changeName(name);;
    }

    const getPlayerName = () => {
        return round % 2 == 1 ? playerX.getName() : playerO.getName();
    }

    const getPlayerSign = () => {
        return round % 2 == 1 ? playerX.getSign() : playerO.getSign();
    }

    const reset = () => {
        round = 1;
        gameover.classList.add('hidden');
        isOver = false;
        gameStart.setMessage(`~ Make your move, ${getPlayerName()} ~`);
    }

    const checkWinner = (chosenIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
        const possibleWins = winConditions.filter(each => {
            return each.includes(chosenIndex);
        })
        return possibleWins.some(each => {
            return each.every(index => {
                return gameBoard.getField(index) == getPlayerSign();
            })
        })

    }

    const getIsOver = () => {
        return isOver;
    }

    return { playRound, reset, getIsOver, changePlayerName}
})();