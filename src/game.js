import * as Bottlecap from 'bottlecap';

import Player from './player.js';
import Coin from './coin.js';

class MyGame extends Bottlecap.Game {
  constructor() {
    super();
    this.score = 0;
    this.loaded = false;
    this.coins = [];
    this.player = null;
    this.assets = null;
  }

  init() {
    this.setupCanvas();
    this.setupCamera();
    this.loaderSetup();
    console.log('Game Initialized');
  }

  setupCanvas() {
    this.canvas = Bottlecap.createCanvas(window.innerWidth, window.innerHeight, 'lightgreen');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    document.body.appendChild(this.canvas);
  }

  setupCamera() {
    this.camera = new Bottlecap.Camera(this.ctx);
  }

  loaderSetup() {
    this.loader = new Bottlecap.Loader();
    this.loader.on('load', this.onLoadingComplete.bind(this));
    this.loader.on('error', this.onLoadingError.bind(this));

    this.loader
      .addImage('coin', './coin.png')
      .addImage('playerSprite', './player.png')
      .addSound('coinpickup', './coin-pickup.wav')
      .load();
  }

  onLoadingComplete(assets) {
    this.assets = assets;
    this.createPlayer();
    this.createCoins();
    this.loaded = true;
  }

  onLoadingError(error) {
    console.error('Loading error:', error);
    this.loaded = false;
  }

  createPlayer() {
    this.player = new Player(this.ctx, this.assets);
  }

  createCoins() {
    for (let i = 0; i < 20; i++) {
      const x = Bottlecap.Utils.randomInt(100, this.canvas.width - 100);
      const y = Bottlecap.Utils.randomInt(100, this.canvas.height - 100);
      const coin = new Coin(this.ctx, this.assets, x, y);
      this.coins.push(coin);
    }
  }

  update(dt) {
    if (!this.loaded) return;

    const direction = Bottlecap.Keyboard.getDirection();
    this.player.update(dt, direction);

    this.coins.forEach(coin => {
      if (coin.visible && this.checkCoinCollision(coin)) {
        coin.visible = false;
        this.score += 10;
        Bottlecap.Sound.play(null, this.assets.sound.coinpickup);
      }
      coin.update(dt);
    });

    this.camera.lookAt(this.player.sprite.position.x, this.player.sprite.position.y);
    this.camera.update(dt);
  }

  checkCoinCollision(coin) {
    return coin.visible && Bottlecap.Collision.rectInRect(
      coin.sprite.position.x, coin.sprite.position.y, coin.sprite.size.x, coin.sprite.size.y,
      this.player.sprite.position.x, this.player.sprite.position.y, this.player.sprite.size.x, this.player.sprite.size.y
    );
  }

  render() {
    if (!this.loaded) {
      this.renderLoadingError();
      return;
    }

    this.clearCanvas();
    this.camera.attach();
    this.renderCoins();
    this.player.sprite.render();
    this.camera.detach();

    this.renderScore();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderCoins() {
    this.coins.forEach(coin => {
      if (coin.visible) coin.sprite.render();
    });
  }

  renderScore() {
    this.ctx.fillStyle = "#000";
    this.ctx.font = "32px sans-serif";
    this.ctx.fillText(`Score: ${this.score}`, 32, 32 + 20);
  }

  renderLoadingError() {
    this.clearCanvas();
    this.ctx.font = "32px sans-serif";
    this.ctx.fillStyle = '#ff0000';
    const text = "Error loading assets!";
    const textWidth = this.ctx.measureText(text).width;
    this.ctx.fillText(
      text,
      this.canvas.width / 2 - textWidth / 2,
      this.canvas.height / 2
    );
  }
}

export default MyGame;
