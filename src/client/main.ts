import config from './config';
import Chat from './examples/chat/chat';
import Load from './load';

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
	scene:   [ Load, Chat ]
} );
