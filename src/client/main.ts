import Load from './scenes/load';
import Menu from './scenes/menu';

import config from './config';

const gameConfig: GameConfig = {
	type:            Phaser.AUTO,
	width:           config.width,
	height:          config.height,
	backgroundColor: '#000000',
	parent:          'screen',
	physics:         {
		default: 'arcade',
		arcade:  {
			gravity: { y: 0 },
			debug:   false
		}
	},
	scene:           [ Load, Menu ]
};

new Phaser.Game( gameConfig );
