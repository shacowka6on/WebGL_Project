import { Assets, Sprite } from "pixi.js";

const PLAYER_SPEED = 2;
export async function setupPlayer() {
  const texture = await Assets.load("/images/player_spaceship.png");
  const player = new Sprite(texture);
  player.x = 375;
  player.y = 500;
  player.width = 75;
  player.height = 70;
  return player;
}
export function movePlayer(player, keys, screenWidth, screenHeight) {
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= PLAYER_SPEED;
  }
  if (keys["ArrowRight"] && player.x + player.width < screenWidth) {
    player.x += PLAYER_SPEED;
  }
  if (keys["ArrowUp"] && player.y > 0) {
    player.y -= PLAYER_SPEED;
  }
  if (keys["ArrowDown"] && player.y + player.height < screenHeight) {
    player.y += PLAYER_SPEED;
  }
}
