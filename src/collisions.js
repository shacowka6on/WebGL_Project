import { hitTestRectangle } from "./utils.js";
import { updateScoreText, explosion } from "./ui.js";

export function checkCollisions(state, app, scoreText, lowerPlayerHealth) {
  const { player, enemies, lasers } = state;

  for (let enemy of enemies) {
    let now = Date.now();
    if (hitTestRectangle(player, enemy) && (now - state.lastTimePlayerGotHit) > 700) {
      lowerPlayerHealth(state);
      // console.log(state.playerHealth)
      state.lastTimePlayerGotHit = now;
      return;
    }
  }

  for (let laser of lasers) {
    for (let enemy of enemies) {
      if (hitTestRectangle(laser, enemy)) {
        explosion(enemy.x,enemy.y,app);
        app.stage.removeChild(enemy);
        app.stage.removeChild(laser);
        state.enemies = enemies.filter((e) => e !== enemy);
        state.lasers = lasers.filter((l) => l !== laser);
        state.score += 10;
        updateScoreText(scoreText, state.score);
        return;
      }
    }
  }
}
