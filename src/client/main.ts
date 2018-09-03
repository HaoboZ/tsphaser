import Load from './scenes/load';
import Menu from './menu/menu';

import config from './config';

new Phaser.Game( {
	type:    Phaser.AUTO,
	width:   config.width,
	height:  config.height,
	parent:  'screen',
	physics: {
		default: 'arcade',
		arcade:  {
			debug: false
		}
	},
	scene:   [ Load, Menu ]
} );
