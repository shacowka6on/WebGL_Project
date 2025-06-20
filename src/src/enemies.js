import { Assets, Graphics, Sprite } from "pixi.js";

const ENEMY_SPEED = 1;

export async function createEnemy(app,enemyT) {
  const enemy = new Graphics
  enemy.rect(0,0,50,50);
  enemy.fill(0xf20000);
  // const enemyT = await Assets('/images/enemy_spaceship.png');
  // const enemy = new Sprite(enemyT);
  enemy.x = Math.random() * (app.screen.width - 40);
  //enemy.x = 250
  enemy.y = -50;
  enemy.width = 40;
  enemy.height = 40;
  return enemy;
}
export async function spawnEnemies(app, state, enemyTexture) {
  const enemy = await createEnemy(app, enemyTexture);
  state.enemies.push(enemy);
  app.stage.addChild(enemy);
}
export function moveEnemies(enemies, app) {
  for (const enemy of enemies) {
    enemy.y += ENEMY_SPEED;
  }
  return enemies.filter((enemy) => {
    if (enemy.y > app.screen.height) {
      app.stage.removeChild(enemy);
      return false;
    }
    return true;
  });
}
