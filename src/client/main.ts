import Load from './scenes/load';
import Menu from './scenes/menu';

import config from './config';

const gameConfig: GameConfig = {
	type:    Phaser.AUTO,
	width:   config.width,
	height:  config.height,
	parent:  'screen',
	physics: {
		default: 'arcade',
		arcade:  {
			debug:   false
		}
	},
	scene:   [ Load, Menu ]
};

new Phaser.Game( gameConfig );
