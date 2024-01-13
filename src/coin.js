import { AnimatedSprite } from 'bottlecap';

class Coin {
  constructor(ctx, assets, x, y) {
    this.visible = true;
    this.sprite = new AnimatedSprite(ctx, assets.image.coin, 18, 1, x, y, 16, 16);
    this.sprite.addAnimation("spin", 0, 8, 30);
    this.sprite.play("spin");
  }

  update(dt) {
    this.sprite.update(dt);
  }
}

export default Coin;
