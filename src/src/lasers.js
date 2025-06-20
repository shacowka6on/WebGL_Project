import { Graphics } from "pixi.js";

const LASER_SPEED = 5;
const LASER_COOLDOWN = 200;

export function shootLasers(state, app) {
  if (state.keys["Space"] && Date.now() - state.lastTimeShot > LASER_COOLDOWN) {
    const laser = createLaser(state.player);
    app.stage.addChild(laser);
    state.lasers.push(laser);
    return Date.now();
  }
  return state.lastTimeShot;
}

export function createLaser(player) {
  const laser = new Graphics();
  laser.rect(0, 0, 5, 20);
  laser.fill(0x00aaff);
  laser.x = player.x + player.width / 2;
  laser.y = player.y - 15;
  laser.width = 5;
  laser.height = 20;
  return laser;
}

export function moveLasers(lasers, app) {
  for (let laser of lasers) {
    laser.y -= LASER_SPEED;
  }
  return lasers.filter((laser) => {
    if (laser.y + laser.height < 0) {
      app.stage.removeChild(laser);
      return false;
    }
    return true;
  });
}
