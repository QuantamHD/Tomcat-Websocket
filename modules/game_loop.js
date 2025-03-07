
let canvas = document.getElementById('game_window');
let ctx = canvas.getContext('2d');

async function loadResources() {
  // Wait for all images to be loaded:
  await Promise.all(
    Array.from(document.images).map(
      (image) =>
        new Promise((resolve) => image.addEventListener("load", resolve)),
    ),
  );
}

function initResizeCanvasTask() {
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resize, false);
}

// Load image
const image =document.getElementById("cookie_sprite_sheet");
var nextFrame = 125; // 125ms
var frameNumber = 0;
var x = 0
var y = 200;
function draw(deltax) {
  nextFrame -= deltax;
  if (nextFrame < 0) {
    frameNumber = (frameNumber + 1) % 5;
    nextFrame = 125 + Math.max(nextFrame, -125);
  }
  let rate =1.5/deltax;
  x = x + rate;
  y = y - rate;


  if (y < 10) {
    x = 0;
    y = 200;
  }
  console.log(frameNumber);
  ctx.drawImage(image, 20 * (frameNumber ), 0, 20, 20, Math.round(x), Math.round(y), 20, 20);
}

var previousTimeStamp = 0;
function gameLoop(timestamp) {
  let deltax = timestamp - previousTimeStamp;
  previousTimeStamp = timestamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(deltax);
  requestAnimationFrame((timestamp_next) => gameLoop(timestamp_next));
}

async function startGameLoop() {
  loadResources();
  initResizeCanvasTask();
  requestAnimationFrame((timestamp_next) => gameLoop(timestamp_next));
}

export { startGameLoop };