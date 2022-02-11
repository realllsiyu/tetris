const grid = $(".grid");
const scoreDisplay = $("#score");
let timerId;
let squares = Array.from($(".grid div"));
const width = 10;
let nextRandom = 0;
const displaySquares = Array.from($(".next div"));
const displayWidth = 4;
let displayIndex = 0;

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
    currentPosition = 4;
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    draw();
    displayShape();
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

//rotation
function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) {
    currentRotation = 0;
  }
  current = theTetrominoes[random][currentRotation];
  draw();
}

//assign functions to keycodes
function control(e) {
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}
document.addEventListener("keyup", control);

//display the coming tetrominoes
const nextTetrominoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
  [0, 1, displayWidth, displayWidth + 1], //oTetromino
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
];

function displayShape() {
  displaySquares.forEach((square) => {
    square.classList.remove("tetromino");
  });
  nextTetrominoes[nextRandom].forEach((index) => {
    displaySquares[displayIndex + index].classList.add("tetromino");
  });
}

$("#start-button").on("click", function () {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    timerId = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    displayShape();
  }
});

//scores
function addScore() {
  for (var i = 0; i < 999; i++) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];
    if (row.every((index) => squares[index].classList.contains("taken"))) {
      score += 10;
      console.log(score);
      $("#score").text(score);
      row.forEach(index=>squares[index].classList.remove("taken"))
    }
  }

