const grid = $(".grid");
const scoreDisplay = $("#score");
const startBtn = $("#start-button");
let squares = Array.from(document.querySelectorAll(".grid div"));
const width = 10;

//define tetrominoes
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const theTetrominoes = [
  lTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
];

//generate random tetrominoes
let currentPosition = 2;
let currentRotation = 0;
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];
console.log(current);

//move the tetromino down
function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("tetromino");
  });
}

function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetromino");
  });
}

function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}
timerId = setInterval(moveDown, 500);

//if one block of the tetromino reaches the bottom or another tetromino,
//freeze the entire tetromino and draw a new one
function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );
    currentPosition = 2;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    random = nextRandom;
    current = theTetrominoes[random][currentRotation];
    draw();
  }
}

//move the tetromine to the left and right
function moveLeft() {
  undraw();
  //prevent tetrominoes from moving out of the frame
  const atLeftEdge = current.some(
    (index) => (currentPosition + index) % 10 == 0
  );
  if (!atLeftEdge) {
    currentPosition -= 1;
  }
  //prevent tetrominoes from moving into another tetromino
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }
  draw();
}

function moveRight() {
  undraw();
  //prevent tetrominoes from moving out of the frame
  const atRightEdge = current.some(
    (index) => (currentPosition + index) % width == width - 1
  );
  if (!atRightEdge) {
    currentPosition += 1;
  }
  //prevent tetrominoes from moving into another tetromino
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}

//assign functions to keycodes
function control(e) {
  if (e.keycode == 37) {
    moveLeft();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}

document.addEventListener("keyup", control);
