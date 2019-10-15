'use strict'
var EMPTY = ' ';
var MINE = '&#128163';
var FLAG = '&#127988';
var BULB = '&#128161';

var PLAYING = 'img/happy.png';
var LOSE = 'img/crying.png';
var WIN = 'img/superhero.png';
var STAR = 'img/star.png'

var gBoard;
var gFind;
var glifes;

var gHintIdx;
var gHintMode;

var isMenual;
var setMinesCount;

var clockInterval;
var glowInterval;

var gLevel = {
    size: 4,
    mine: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0
}


/////////////////////////////////////////////////////////////////////////////////////
function init() {
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    glifes = 3;
    gFind = 3;
    gHintIdx = 2;
    gMinePos = [];
    isFirstClick = true;
    gHintMode = false;
    isMenual = false;
    setMinesCount = 0;

    document.querySelector('.play-button').src = PLAYING;

    renderhints()

    document.querySelector('h4 span').innerText = gFind;
    document.querySelector('h3 span').innerText = glifes;
    if (clockInterval) clearInterval(clockInterval);
    if (glowInterval) clearInterval(glowInterval);

    var elTime = document.querySelector('h3.time');
    elTime.innerHTML = '';

    gBoard = buildBoard();
    printMat(gBoard, '.board-container');
    console.table(gBoard);
    gGame.isOn = true;
}

//////////////////////////////////////////////////////////////////////////////
function renderhints() {
    var elHints = document.querySelectorAll('.hint')

    for (var i = 0; i < elHints.length; i++) {
        elHints[i].src = STAR
        elHints[i].classList.remove('hiden')
    }

}

/////////////////////////////////////////////////////////////////////////////////////
function createCell() {
    return {
        minesAroundCount: 1,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = createCell();
        }
    }

    return board;
}

/////////////////////////////////////////////////////////////////////////////////////
function cellClicked(ev, elCell, i, j) {
    if (!gGame.isOn) return;
    if (isMenual) {
        setMineMenual(i,j);
        return;
    }
    if (isFirstClick) {
        startClock();
        turnToMine(gBoard, i, j);
        isFirstClick = false;
    }
    if (ev.button === 0) { /// left mouse click
        if (gBoard[i][j].isMarked) return;
        if (gBoard[i][j].isShown) return;

        var elHint = document.querySelectorAll('.hint');
        if (gHintMode) {
            hintfoo(i, j);
            elHint[gHintIdx].classList.add('hiden')
            gHintMode = false;
            gHintIdx--;
            return;
        }

        elCell.classList.add('revealed');
        gBoard[i][j].isShown = true;
        gGame.shownCount++;

        var mineCount = gBoard[i][j].minesAroundCount;
        if (gBoard[i][j].isMine === true) {
            elCell.innerHTML = MINE;
            glifes--;
            gGame.markedCount++;
            gGame.shownCount--;
            document.querySelector('h3 span').innerText = glifes;
            if (glifes === 0) gameover();
            checkGameOver();
            return;
        }
        mineCount = setMinesNegsCount(gBoard, i, j)
        elCell.innerHTML = mineCount;
        if (mineCount === 0) {
            revielNegs(i, j, gBoard)
        }

    } else if (ev.button === 2) { //// right mouse click, no number 1 beacuse its the middle button
        if (gBoard[i][j].isShown) return;

        if (gBoard[i][j].isMarked) {
            gGame.markedCount--;
            elCell.innerHTML = EMPTY;
            gBoard[i][j].isMarked = false;
        } else {
            gGame.markedCount++;
            elCell.innerHTML = FLAG;
            gBoard[i][j].isMarked = true;
        }

    }
    checkGameOver();
}

//////////////////////////////////////////////////////////////////////////////////
function startClock() {
    var time = 0;
    clockInterval = setInterval(function () {
        time += 100;
        var showTime = (time / 1000).toFixed(1)
        var elTime = document.querySelector('h3.time');
        elTime.innerHTML = showTime;
    }, 100)

}

//////////////////////////////////////////////////////////////////////////////////
function checkGameOver() {
    if (gGame.markedCount + gGame.shownCount === gLevel.size ** 2) {
        gMinePos = [];
        isFirstClick = true;
        clearInterval(clockInterval);
        clearInterval(glowInterval);
        document.querySelector('.play-button').src = WIN;
        gGame.isOn = false;
    }

    gGame.markedCount + gGame.shownCount === gLevel.size ** 2
}

function gameover() {
    document.querySelector('.play-button').src = LOSE;
    clearInterval(clockInterval);
    clearInterval(glowInterval)
    isFirstClick = true;
    gMinePos = [];
    revialAllMines();
    gGame.isOn = false;
}

////////////////////////////////////////////////////////////////////////////
function revialAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.innerHTML = MINE;
                elCell.isShown = true;
                elCell.classList.add('revealed');
            }

        }
    }
}

/////////////////////////////////////////////////////////////
function changeSizeSmall() {

    gLevel.size = 4;
    gLevel.mine = 2;
    init();
}

function changeSizeMidium() {
    gLevel.size = 8;
    gLevel.mine = 12;
    init();
}

function changeSizeBig() {
    gLevel.size = 12;
    gLevel.mine = 30;
    init();
}

function hintClick() {
    gHintMode = true;
}

/////////////////////////////////////////////////////////////////////////
function safeClick() {
    gFind--;
    if (gFind > -1 && !isFirstClick) {
        document.querySelector('h4 span').innerText = gFind;
        var pos = getRndEmptyHidenPos();
        markSafeSpot(pos);
    }

}

function markSafeSpot(pos) {
    var elCell = document.querySelector(`.cell${pos.i}-${pos.j}`);
    elCell.classList.add('glow');
    glowInterval = setInterval(function () {
        elCell.classList.remove('glow');
        clearInterval(glowInterval)
    }, 3000);
}

function getRndEmptyHidenPos() {
    var i = getRandomInteger(0, gBoard.length - 1);
    var j = getRandomInteger(0, gBoard.length - 1);
    while (gBoard[i][j].isMine || gBoard[i][j].isShown) {
        i = getRandomInteger(0, gBoard.length - 1);
        j = getRandomInteger(0, gBoard.length - 1);
    }
    return { i: i, j: j }
}

//////////////////////////////////////////////////////////////
function menualyClick() {
    init();
    isMenual = true;
    isFirstClick = false;

}

function setMineMenual(i,j) {
    if (setMinesCount < gLevel.mine ) {
        if (!gBoard[i][j].isMine) {
            gBoard[i][j].isMine = true;
            setMinesCount++;
            renderCell({ i: i, j: j }, MINE);
        }
        if (setMinesCount === gLevel.mine) {
            isMenual = false;
            setTimeout(unrevealBoard,200)
        }
    }
}

function unrevealBoard () {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            renderCell({ i: i, j: j }, '')
        }
    }
}