import Load from './scenes/load';
import Menu from './scenes/menu';
import Flood from './scenes/flood';
import Topdown from './scenes/topdown';

import config from './config';

import '../common/string';

const gameConfig: GameConfig = {
	type:    Phaser.WEBGL,
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
	scene:   [ Load, Menu, Flood, Topdown ]
};

new Phaser.Game( gameConfig );
