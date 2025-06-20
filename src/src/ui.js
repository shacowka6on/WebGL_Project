import {
  Text,
  Graphics,
  AnimatedSprite,
  Assets,
  Texture,
  TextStyle,
  Container,
} from "pixi.js";

export function createScoreText() {
  const scoreText = new Text({ text: "Score: 0", style: { fill: 0xffffff } });
  scoreText.x = 10;
  scoreText.y = 10;
  return scoreText;
}

export function updateScoreText(scoreText, score) {
  scoreText.text = `Score: ${score}`;
}

export function createHealthBar(state) {
  const healthBar = new Graphics();
  healthBar.rect(0, 0, 50, 5);
  healthBar.fill(0x00ff00);
  healthBar.x = state.player.x;
  healthBar.y = state.player.y + 50;
  return healthBar;
}

export function updateHealthBar(healthBar, state) {
  healthBar.clear();

  const health = Math.max(0, state.playerHealth);
  const width = health * 0.75;

  healthBar.rect(0, 0, width, 5);
  if (health < 25) {
    healthBar.fill(0xff0000);
  } else if (health < 50) {
    healthBar.fill(0xff6600);
  } else if (health < 75) {
    healthBar.fill(0xffaa00);
  } else if (health > 75) {
    healthBar.fill(0x00ff00);
  }

  healthBar.x = state.player.x;
  healthBar.y = state.player.y + 75;
}

export async function explosion(x, y, app) {
  await Assets.load("https://pixijs.com/assets/spritesheet/mc.json");

  const explosionTextures = [];
  let i;

  for (i = 0; i < 26; i++) {
    const texture = Texture.from(`Explosion_Sequence_A ${i + 1}.png`);

    explosionTextures.push(texture);
  }

  const explosion = new AnimatedSprite(explosionTextures);

  explosion.x = x;
  explosion.y = y;
  explosion.anchor.set(0.5);
  explosion.rotation = Math.random() * Math.PI;
  explosion.scale.set(0.75 + Math.random() * 0.5);

  explosion.animationSpeed = 0.5;
  explosion.loop = false;
  explosion.play();

  explosion.onComplete = () => {
    app.stage.removeChild(explosion);
    explosion.destroy();
  };

  app.stage.addChild(explosion);
}

export function gameOverScreen(app, state) {
  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 55,
    fontStyle: "italic",
    fontWeight: "bold",
    stroke: { color: "#4a1850", width: 5, join: "round" },
    dropShadow: {
      color: "#000000",
      blur: 4,
      angle: Math.PI / 6,
      distance: 6,
    },
    wordWrap: true,
    wordWrapWidth: 440,
  });
  const gameOverText = new Text({
    text: `GAME OVER\n\t\tScore:${state.score}`,
    style,
  });
  gameOverText.x = app.screen.width / 3.5;
  gameOverText.y = app.screen.height / 3;
  createButton(app);
  app.stage.addChild(gameOverText);
}
function createButton(app) {

  const buttonView = new Container();

  const buttonBg = new Graphics().rect(0, 0, 150, 50).fill("#4a1850");

  const text = new Text({ text: "Play Again", style: { fontSize: 20 } });
  text.anchor.set(0.5);

  text.x = buttonBg.width / 2;
  text.y = buttonBg.height / 2;

  buttonView.x = app.screen.width / 2.5;
  buttonView.y = (app.screen.height + 150) / 2;
  
  buttonView.eventMode = 'static';
  buttonView.cursor = 'pointer';
  
  buttonView.on('pointerdown', () => {
    location.reload();
  });

  buttonView.addChild(buttonBg, text);
  app.stage.addChild(buttonView);
}
