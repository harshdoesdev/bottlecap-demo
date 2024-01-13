import { DOM } from 'bottlecap';
import MyGame from './src/game.js'
import './style.css'

DOM.ready(() => {
    const game = new MyGame();
    game.run();
});
