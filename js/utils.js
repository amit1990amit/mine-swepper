'use strict'

var isFirstClick = true;
var BULB = '&#128161';

var gMinePos;

///////////////////////////////////////////////////////////////////
function printMat(mat, selector) {
    var strHTML = '<table  border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td onmousedown="cellClicked(event,this,${i},${j})" class="${className}"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

//////////////////////////////////////////////////////////////////////////////////////////
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

//////////////////////////////////////////////////////////////////////////////////////////

function hintfoo(cellI, cellJ) {
    // reviel cell and his negs
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isShown) continue;
            var elCell = document.querySelector(`.cell${i}-${j}`);
            elCell.classList.add('revealed');
            var mineCount = gBoard[i][j].minesAroundCount;
            mineCount = setMinesNegsCount(gBoard, i, j);
            renderCell({ i: i, j: j }, mineCount)
            if (gBoard[i][j].isMine) {
                renderCell({ i: i, j: j }, MINE)
            }

        }
    }
    // unreviel cell and his negs after one sec
    setTimeout(function () {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue;
                if (gBoard[i][j].isShown) continue;
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.classList.remove('revealed');
                renderCell({ i: i, j: j }, '')
            }
        } 
    },1000)
}

/////////////////////////////////////////////////////////////////////////////////
function turnToMine(board, i, j) {
    while (gLevel.mine > gMinePos.length) {
        var rndIdx1 = getRandomInteger(0, gLevel.size - 1)
        var rndIdx2 = getRandomInteger(0, gLevel.size - 1)
        if (gBoard[rndIdx1][rndIdx2].isMine || (i === rndIdx1 && j === rndIdx2)) {
            // rndIdx1 = getRandomInteger(0, gLevel.size - 1)
            // rndIdx2 = getRandomInteger(0, gLevel.size - 1)
            continue;
        }
        gMinePos.push({ i: rndIdx1, j: rndIdx2 })
        board[rndIdx1][rndIdx2].isMine = true;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
function setMinesNegsCount(board, cellI, cellJ) {
    var mineCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine === true) mineCount++;
        }
    }
    return mineCount;
}

////////////////////////////////////////////////////////////////////////
function revielNegs(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            revielNeg(i, j)

        }
    }
}

function revielNeg(i, j) {

    var mineCount = gBoard[i][j].minesAroundCount;
    mineCount = setMinesNegsCount(gBoard, i, j);
    renderCell({ i: i, j: j }, mineCount)
    var elCell = document.querySelector(`.cell${i}-${j}`)
    if (gBoard[i][j].isShown) return;
    elCell.classList.add('revealed');
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    if (mineCount === 0) {
        revielNegs(i, j, gBoard);
    }

}
///////////////////////////////////////////////////////////////////

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
