import { AnimatedSprite } from 'bottlecap';

class Player {
  constructor(ctx, assets) {
    this.speed = 100;
    this.sprite = new AnimatedSprite(ctx, assets.image.playerSprite, 6, 1, 0, 0, 64, 64);
    this.sprite.addAnimation("default", 0, 5, 80);
    this.sprite.play("default");
  }

  update(dt, direction) {
    this.sprite.position.x += direction.x * this.speed * dt;
    this.sprite.position.y += direction.y * this.speed * dt;

    this.sprite.flipX = direction.x === -1;
    this.sprite.update(dt);
  }
}

export default Player;
