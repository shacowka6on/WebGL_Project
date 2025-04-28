import { Application, Sprite, Text, Assets } from "pixi.js";

(async () => {
  // Constants
  const BOUNDARY_Y_UPPER = 10;
  const BOUNDARY_Y_LOWER = 500;
  const BOUNDARY_X_LEFT = 10;
  const BOUNDARY_X_RIGHT = 700;
  const LASER_COOLDOWN = 200;
  const ENEMY_SPAWN_INTERVAL = 100; // frames
  const PLAYER_SPEED = 3;
  const ENEMY_SPEED = 2;

  // Game variables
  let app, player, scoreText, state;
  let enemies = [];
  let keys = {};
  let score = 0;
  let lastTimeShot = 0;
  let spawnTimer = 0;

  // Load assets
  const playerTexture = await Assets.load('https://cdn-icons-png.flaticon.com/512/1702/1702046.png');
  const enemyTexture = await Assets.load('https://images.vexels.com/media/users/3/152291/isolated/preview/b24e3a7a428ffa5e38104ef0b9a67202-arcade-spaceship-icon.png');

  // Setup PIXI application
  app = new Application();
  await app.init({ width: 800, height: 600 });
  document.body.appendChild(app.canvas);

  // Create player
  player = new Sprite(playerTexture);
  player.width = 100;
  player.height = 100;
  player.x = 350;
  player.y = 450;
  app.stage.addChild(player);

  // Create score text
  scoreText = new Text(`Score: ${score}`, {
    fill: 0xffffff,
    fontSize: 40
  });
  scoreText.x = 20;
  scoreText.y = 20;
  app.stage.addChild(scoreText);

  // Keyboard input
  window.addEventListener("keydown", (e) => keys[e.code] = true);
  window.addEventListener("keyup", (e) => keys[e.code] = false);

  // Set initial game state
  state = play;
  app.ticker.add((delta) => gameLoop(delta));

  // Game loop
  function gameLoop(delta) {
    state(delta);
  }

  // Play state
  function play(delta) {
    movePlayer();
    spawnEnemies();
    moveEnemies();
    checkCollisions();
  }

  // Game Over state
  function gameOver(delta) {
    // You can add "Game Over" screen or stop input if you want
  }

  // Move player
  function movePlayer() {
    if (keys["ArrowLeft"]) player.x -= PLAYER_SPEED;
    if (keys["ArrowRight"]) player.x += PLAYER_SPEED;
    if (keys["ArrowUp"]) player.y -= PLAYER_SPEED;
    if (keys["ArrowDown"]) player.y += PLAYER_SPEED;

    // Boundaries
    if (player.y < BOUNDARY_Y_UPPER) player.y = BOUNDARY_Y_UPPER;
    if (player.y > BOUNDARY_Y_LOWER) player.y = BOUNDARY_Y_LOWER;
    if (player.x < BOUNDARY_X_LEFT) player.x = BOUNDARY_X_LEFT;
    if (player.x > BOUNDARY_X_RIGHT) player.x = BOUNDARY_X_RIGHT;
  }

  // Spawn enemies
  function spawnEnemies() {
    spawnTimer++;
    if (spawnTimer > ENEMY_SPAWN_INTERVAL) {
      const enemy = new Sprite(enemyTexture);
      enemy.width = 80;
      enemy.height = 80;
      enemy.x = Math.random() * (app.screen.width - enemy.width);
      enemy.y = -enemy.height; // Start above the screen
      app.stage.addChild(enemy);
      enemies.push(enemy);
      spawnTimer = 0;
    }
  }

  // Move enemies
  function moveEnemies() {
    for (let enemy of enemies) {
      enemy.y += ENEMY_SPEED;
    }
    // Optional: remove enemies that go off screen (optimization)
    enemies = enemies.filter(enemy => enemy.y <= app.screen.height);
  }

  // Check collisions
  function checkCollisions() {
    for (let enemy of enemies) {
      if (hitTestRectangle(player, enemy)) {
        console.log("Hit!");
        state = gameOver;
        showGameOverText();
        break;
      }
    }
  }

  // Show Game Over Text
  function showGameOverText() {
    const gameOverText = new Text('Game Over', {
      fill: 0xff0000,
      fontSize: 80
    });
    gameOverText.anchor.set(0.5);
    gameOverText.x = app.screen.width / 2;
    gameOverText.y = app.screen.height / 2;
    app.stage.addChild(gameOverText);
  }

  function hitTestRectangle(r1, r2) {
    const r1Hitbox = {
      x: r1.x + 10, 
      y: r1.y + 10, 
      width: r1.width - 20,
      height: r1.height - 20
    };
  
    const r2Hitbox = {
      x: r2.x + 10,
      y: r2.y + 10,
      width: r2.width - 20,
      height: r2.height - 20
    };
  
    return r1Hitbox.x + r1Hitbox.width > r2Hitbox.x &&
           r1Hitbox.x < r2Hitbox.x + r2Hitbox.width &&
           r1Hitbox.y + r1Hitbox.height > r2Hitbox.y &&
           r1Hitbox.y < r2Hitbox.y + r2Hitbox.height;
  }

})();
