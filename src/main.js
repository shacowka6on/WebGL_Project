import { Application, Sprite, Text, Assets, Graphics, Container } from "pixi.js";

(async () => {
  const BOUNDARY_Y_UPPER = 10;
  const BOUNDARY_Y_LOWER = 490;
  const BOUNDARY_X_LEFT = 10;
  const BOUNDARY_X_RIGHT = 700;
  const LASER_COOLDOWN = 200;
  const ENEMY_SPAWN_INTERVAL = 100;
  const LASER_SPEED = 5;
  const PLAYER_SPEED = 3;
  const ENEMY_SPEED = 2;
  const PLAYER_HEALTH = 10;

  let app, player, scoreText, state;
  let enemies = [];
  let keys = {};
  let lasers = [];
  let score = 0;
  let lastTimeShot = 0;
  let spawnTimer = 0;
  let lastTimePlayerHit = 0;

  const playerTexture = await Assets.load(
    "https://cdn-icons-png.flaticon.com/512/1702/1702046.png"
  );
  const enemyTexture = await Assets.load(
    "https://images.vexels.com/media/users/3/152291/isolated/preview/b24e3a7a428ffa5e38104ef0b9a67202-arcade-spaceship-icon.png"
  );

  app = new Application();
  await app.init({ width: 800, height: 600 });
  document.body.appendChild(app.canvas);

  player = new Sprite(playerTexture);
  player.width = 100;
  player.height = 100;
  player.x = 350;
  player.y = 450;
  player.health = PLAYER_HEALTH;
  app.stage.addChild(player);

  const healthBarBg = new Graphics();
  healthBarBg.rect(0, 0, 480, 8).fill(0xff0000);
  const healthBarFg = new Graphics();
  healthBarFg.rect(0, 0, 480, 8).fill(0x00ff00); 

  const healthBarContainer = new Container();
  healthBarContainer.addChild(healthBarBg);
  healthBarContainer.addChild(healthBarFg);
  healthBarContainer.x = (player.width - 60) / 2; 
  healthBarContainer.y = player.height + 450; 
  player.addChild(healthBarContainer);

  scoreText = new Text({
    text: `Score: ${score}`,
    style: {
      fill: 0xffffff,
      fontSize: 40,
    },
  });
  scoreText.x = 20;
  scoreText.y = 20;
  app.stage.addChild(scoreText);

  window.addEventListener("keydown", (e) => (keys[e.code] = true));
  window.addEventListener("keyup", (e) => (keys[e.code] = false));

  state = play;
  app.ticker.add((delta) => gameLoop(delta));

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
    movePlayer();
    spawnEnemies();
    shootLasers();
    moveEnemies();
    moveLasers();
    checkCollisions();
  }

  function gameOver(delta) {}

  function movePlayer() {
    if (keys["ArrowLeft"]) player.x -= PLAYER_SPEED;
    if (keys["ArrowRight"]) player.x += PLAYER_SPEED;
    if (keys["ArrowUp"]) player.y -= PLAYER_SPEED;
    if (keys["ArrowDown"]) player.y += PLAYER_SPEED;

    if (player.y < BOUNDARY_Y_UPPER) player.y = BOUNDARY_Y_UPPER;
    if (player.y > BOUNDARY_Y_LOWER) player.y = BOUNDARY_Y_LOWER;
    if (player.x < BOUNDARY_X_LEFT) player.x = BOUNDARY_X_LEFT;
    if (player.x > BOUNDARY_X_RIGHT) player.x = BOUNDARY_X_RIGHT;
  }

  function shootLasers() {
    if (keys["Space"] && Date.now() - lastTimeShot > LASER_COOLDOWN) {
      const laser = new Graphics();
      laser.rect(0, 0, 5, 20).fill(0xff0000);
      laser.x = player.x + player.width / 2;
      laser.y = player.y - 15;
      app.stage.addChild(laser);
      lasers.push(laser);
      lastTimeShot = Date.now();
    }
  }

  function moveLasers() {
    for (let laser of lasers) {
      laser.y -= LASER_SPEED;
    }
    lasers = lasers.filter((laser) => {
      if (laser.y + laser.height < 0) {
        app.stage.removeChild(laser);
        return false;
      }
      return true;
    });
  }

  function spawnEnemies() {
    spawnTimer++;
    if (spawnTimer > ENEMY_SPAWN_INTERVAL) {
      const enemy = new Sprite(enemyTexture);
      enemy.width = 80;
      enemy.height = 80;
      enemy.x = Math.random() * (app.screen.width - enemy.width);
      enemy.y = -enemy.height;
      app.stage.addChild(enemy);
      enemies.push(enemy);
      spawnTimer = 0;
    }
  }

  function moveEnemies() {
    for (let enemy of enemies) {
      enemy.y += ENEMY_SPEED;
    }
    enemies = enemies.filter((enemy) => enemy.y <= app.screen.height);
  }

  function checkCollisions() {
    for (let enemy of enemies) {
      if (hitTestRectangle(player, enemy)) {
        console.log(`Player hit! ${player.health}`);
        lowerPlayerHealth();
        return;
      }
    }

    for (let laser of lasers) {
      for (let enemy of enemies) {
        if (hitTestRectangle(laser, enemy)) {
          app.stage.removeChild(enemy);
          app.stage.removeChild(laser);
          enemies = enemies.filter((e) => e !== enemy);
          lasers = lasers.filter((l) => l !== laser);
          score += 10;
          scoreText.text = `Score: ${score}`;
          return;
        }
      }
    }
  }

  function lowerPlayerHealth() {
    if (Date.now() - lastTimePlayerHit > 500) {
      player.health -= 1;
      lastTimePlayerHit = Date.now();

      const healthRatio = player.health / PLAYER_HEALTH;
      healthBarFg.clear();
      healthBarFg.rect(0, 0, 480 * healthRatio, 8).fill(0x00ff00);

      if (player.health <= 0) {
        state = gameOver;
        showGameOverText();
      }
    }
  }

  function showGameOverText() {
    const gameOverText = new Text({
      text: "Game Over",
      style: {
        fill: 0xff0000,
        fontSize: 80,
      },
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
      height: r1.height - 20,
    };

    const r2Hitbox = {
      x: r2.x + 10,
      y: r2.y + 10,
      width: r2.width,
      height: r2.height,
    };

    return (
      r1Hitbox.x + r1Hitbox.width > r2Hitbox.x &&
      r1Hitbox.x < r2Hitbox.x + r2Hitbox.width &&
      r1Hitbox.y + r1Hitbox.height > r2Hitbox.y &&
      r1Hitbox.y < r2Hitbox.y + r2Hitbox.height
    );
  }
})();
