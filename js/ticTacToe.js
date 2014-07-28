(function() {
    'use strict';

    var gameboard = [];
    var numberOfRows = 3;
    var numberOfColumns = 3;
    var numberOfSquares = 9;
    var playerImages = ['url(./img/cat.png)',
        'url(./img/dog.png)'];
    var playerTypes = ['Cats',
        'Dogs'];
    var currentPlayer = 0;
    var isGameOver = false;
    var numSquaresClicked = 0;

    resetGame();
    setUpGUI();

    //Game Logic ---------------------
    function resetGame() {
        isGameOver = false;
        numSquaresClicked = 0;
        currentPlayer = getRandomInt(0, 1);

        setCurrentPlayerImage();

        var message = document.getElementById('message');
        if (message) {
            document.getElementsByTagName('body')[0].removeChild(message);
        }
        var cells = document.getElementsByTagName('td');

        for (var row = 0; row < numberOfRows; row += 1) {
            gameboard[row] = [];
            for (var column = 0; column < numberOfColumns; column += 1) {
                gameboard[row][column] = -1;
                cells[row * numberOfRows + column].style.backgroundImage = 'none';
            }
        }
    }

    function isOccupied(gameboard, position) {
        return gameboard[position.row][position.column] !== -1;
    }

    function changePlayer() {
        currentPlayer = (currentPlayer + 1) % 2;
        setCurrentPlayerImage();
    }

    function gameHasWinner() {
        var winnerOfLine;

        //Check across rows
        for (var row = 0; row < numberOfRows; row += 1) {
            winnerOfLine = gameboard[row][0];
            if (winnerOfLine === -1) {
                continue;
            }
            for (var column = 0; column < numberOfColumns; column += 1) {
                if (gameboard[row][column] !== winnerOfLine) {
                    winnerOfLine = -1;
                    break;
                }
            }
            if (winnerOfLine !== -1) {
                gameOver(winnerOfLine);
                return true;
            }
        }

        //Check down columns
        for (column = 0; column < numberOfColumns; column += 1) {
            winnerOfLine = gameboard[0][column];
            if (winnerOfLine === -1) {
                continue;
            }
            for (row = 0; row < numberOfRows; row += 1) {
                if (gameboard[row][column] !== winnerOfLine) {
                    winnerOfLine = -1;
                    break;
                }
            }
            if (winnerOfLine !== -1) {
                gameOver(winnerOfLine);
                return true;
            }
        }

        //Check diagonals
        winnerOfLine = gameboard[0][0];
        if (winnerOfLine !== -1 &&
            winnerOfLine === gameboard[1][1] &&
            winnerOfLine === gameboard[2][2])
        {
            gameOver(winnerOfLine);
            return true;
        }

        winnerOfLine = gameboard[0][2];
        if (winnerOfLine !== -1 &&
            winnerOfLine === gameboard[1][1] &&
            winnerOfLine === gameboard[2][0])
        {
            gameOver(winnerOfLine);
            return true;
        }

        return false;
    }

    function gameOver(winner) {
        var messageText = "It's a draw! We can't leave things like this, can we?";

        if (winner !== -1) {
            messageText = playerTypes[winner] +
                ' rule; ' +
                playerTypes[(winner + 1) % 2] +
                ' drool!';
        }
        var messageNode = document.createElement('p');
        messageNode.textContent = messageText;
        messageNode.setAttribute('id', 'message');
        document.getElementsByTagName('body')[0].appendChild(messageNode);
        isGameOver = true;
    }

    //GUI Code ----------------------
    function setCurrentPlayerImage() {
        var images = document.getElementsByTagName('img');
        var imageID;

        for (var index = 0; index < images.length; index += 1) {
            imageID = images[index].getAttribute('id');
            if (imageID === 'player' + (currentPlayer + 1)) {
                images[index].setAttribute('class', 'currentPlayer');
            } else {
                images[index].className = '';
            }
        }
    }

    function setUpGUI() {
        var cells = document.getElementsByTagName('td');

        for (var index = 0; index < numberOfSquares; index += 1) {
            cells[index].addEventListener('click', function() {
                squareClicked(this);
            });
        }
        document
            .getElementById('newGame')
            .addEventListener('click', function() {
                resetGame();
            });
    }

    function squareClicked(element) {
        if (isGameOver) {
            return;
        }

        var position = getRowAndColumnFromTableCell(element);

        if (!isOccupied(gameboard, position)) {
            element.style.backgroundImage = playerImages[currentPlayer];
            gameboard[position.row][position.column] = currentPlayer;
            if (!gameHasWinner()) {
                numSquaresClicked += 1;
                if (numSquaresClicked === numberOfSquares) {
                    isGameOver = true;
                    gameOver(-1);
                }
                changePlayer();
            }
        }
    }

    function getRowAndColumnFromTableCell(element) {
        var cells = document.getElementsByTagName('td');
        var cellIndex,
            position = {};

        cellIndex = Array.prototype.indexOf.call(cells, element);
        position.row = Math.floor(cellIndex / numberOfRows);
        position.column = cellIndex % numberOfRows;
        return position;
    }

    function getTableCellFromRowAndColumn(row, column) {
        var cells = document.getElementsByTagName('td');
        return cells[row * numberOfRows + column];
    }

    //Utilities 
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}());