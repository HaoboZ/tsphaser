import Load from './scenes/load';
import Menu from './scenes/menu';
import Flood from './scenes/flood';
import Topdown from './scenes/topdown';
import Multi from './scenes/multi';

import config from './config';

const gameConfig: GameConfig = {
	type:    Phaser.AUTO,
	width:   config.width,
	height:  config.height,
	parent:  'screen',
	physics: {
		default: 'arcade',
		arcade:  {
			gravity: { y: 0 },
			debug:   false
		}
	},
	scene:   [ Load, Menu, Flood, Topdown, Multi ]
};

new Phaser.Game( gameConfig );
