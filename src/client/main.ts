import Load from './load';

const game = new Phaser.Game(1280, 720, Phaser.AUTO);

game.state.add('Load', Load);

game.state.start('Load');
