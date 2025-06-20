import { Application, Assets } from "pixi.js";
import { state } from "./state.js";
import { setupPlayer, movePlayer } from "./player.js";
import {
  createScoreText,
  createHealthBar,
  updateHealthBar,
  explosion,
  gameOverScreen,
} from "./ui.js";
import { spawnEnemies, moveEnemies } from "./enemies.js";
import { shootLasers, moveLasers } from "./lasers.js";
import { checkCollisions } from "./collisions.js";

let scoreText, healthBar, enemyTexture;
const app = new Application();

export async function initGame() {

  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    antialias: true,
    resolution: 1,
    preference: "webgl",
  });

  document.body.appendChild(app.canvas);

  // enemyTexture = await Assets.load('/image/enemy_spaceship.png');

  scoreText = createScoreText();
  app.stage.addChild(scoreText);

  state.player = await setupPlayer();
  app.stage.addChild(state.player);

  healthBar = createHealthBar(state);
  app.stage.addChild(healthBar);

  window.addEventListener("keydown", (e) => (state.keys[e.code] = true));
  window.addEventListener("keyup", (e) => (state.keys[e.code] = false));

  app.ticker.add(gameLoop);
}

function gameLoop() {
  const now = Date.now();
  state.lastTimeShot = shootLasers(state, app);
  state.lasers = moveLasers(state.lasers, app);

  if (now - state.lastEnemySpawn > state.enemyRespawnTimer) {
    spawnEnemies(app, state, enemyTexture);
    state.lastEnemySpawn = now;
  }
  state.enemies = moveEnemies(state.enemies, app);

  movePlayer(state.player, state.keys, app.screen.width, app.screen.height);

  updateHealthBar(healthBar, state);
  checkCollisions(state, app, scoreText, lowerPlayerHealth);
}

function lowerPlayerHealth(state) {
  state.playerHealth -= 10;
  if (state.playerHealth <= 0) {
    explosion(state.player.x, state.player.y, app);
    gameOverScreen(app, state);
    app.ticker.stop();
  }
}
