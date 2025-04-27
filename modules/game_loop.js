import { Bunny } from "./bunny.js";
import { Vector2D } from "./vector2d.js";

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

function draw(deltaT, gameObjects) {
  for (const object of gameObjects) {
    object.draw(deltaT, ctx);
  }
}

function update(deltaT, gameObjects) {
  for (const object of gameObjects) {
    object.update(deltaT);
  }
}

var previousTimeStamp = 0;
let gameObjects = [
  new Bunny(new Vector2D(-20, 150), document.getElementById("cookie_sprite_sheet"), false),
  new Bunny(new Vector2D(-20, 200), document.getElementById("gizmo_sprite_sheet"), true)
];
function gameLoop(timestamp) {
  let deltax = timestamp - previousTimeStamp;
  previousTimeStamp = timestamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update(deltax, gameObjects);
  draw(deltax, gameObjects);
  requestAnimationFrame((timestamp_next) => gameLoop(timestamp_next));
}

async function startGameLoop() {
  loadResources();
  initResizeCanvasTask();
  requestAnimationFrame((timestamp_next) => gameLoop(timestamp_next));
}

export { startGameLoop };