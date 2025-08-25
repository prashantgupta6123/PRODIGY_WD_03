let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let aiPlayer = "O";
let gameOver = false;
let gameMode = "";
let aiThinking = false;
const statusText = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const winLine = document.getElementById("winLine");

function startGame(mode) {
  gameMode = mode;
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameBoard").style.display = "block";
  resetGame();
}

cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const index = cell.dataset.index;
    if (board[index] === "" && !gameOver && !aiThinking) {
      makeMove(index, currentPlayer);
      if (!gameOver && gameMode === "ai" && currentPlayer === "O") {
        aiThinking = true;
        statusText.textContent = "AI Thinking...";
        setTimeout(aiTurn, 1000);
      }
    }
  });
});

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  checkWinner(player);
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (!gameOver && !(gameMode === "ai" && currentPlayer === aiPlayer)) {
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function aiTurn() {
  let bestMove = findBestMove();
  makeMove(bestMove, aiPlayer);
  aiThinking = false;
  if (!gameOver) statusText.textContent = "Player X's Turn";
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = aiPlayer;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  let winner = getWinner(newBoard);
  if (winner === aiPlayer) return 10 - depth;
  if (winner === "X") return depth - 10;
  if (!newBoard.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = aiPlayer;
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      cells[a].classList.add("winning");
      cells[b].classList.add("winning");
      cells[c].classList.add("winning");
      drawWinLine(pattern);
      statusText.textContent = `Player ${player} Wins! 🎉`;
      gameOver = true;
      return;
    }
  }
  if (!board.includes("")) {
    statusText.textContent = "It's a Draw 😅";
    gameOver = true;
  }
}

function getWinner(bd) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of winPatterns) {
    if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return bd[a];
  }
  return null;
}

function drawWinLine(pattern) {
  const positions = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
    { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
    { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }
  ];
  const start = positions[pattern[0]];
  const end = positions[pattern[2]];
  const boardRect = document.getElementById("board").getBoundingClientRect();
  const cellSize = boardRect.width / 3;

  const x1 = start.x * cellSize + cellSize / 2;
  const y1 = start.y * cellSize + cellSize / 2;
  const x2 = end.x * cellSize + cellSize / 2;
  const y2 = end.y * cellSize + cellSize / 2;

  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const distance = Math.hypot(x2 - x1, y2 - y1);

  winLine.style.left = `${x1}px`;
  winLine.style.top = `${y1}px`;
  winLine.style.transform = `rotate(${angle}deg)`;
  winLine.style.width = "0";

  setTimeout(() => {
    winLine.style.width = `${distance}px`;
  }, 100);
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  currentPlayer = "X";
  aiThinking = false;
  winLine.style.width = "0";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winning");
  });
  statusText.textContent = "Player X's Turn";
}

function backToMenu() {
  resetGame();
  document.getElementById("gameBoard").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}