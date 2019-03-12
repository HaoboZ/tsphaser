import config from './config';
import Chat from './examples/chat/chat';
import Movement from './examples/movement/movement';
import Tictactoe from './examples/tictactoe/tictactoe';
import Load from './load';

new Phaser.Game( {
	type:     Phaser.AUTO,
	// @ts-ignore
	pixelArt: true,
	scale:    {
		mode:       Phaser.Scale.FIT,
		parent:     'screen',
		autoCenter: Phaser.Scale.CENTER_BOTH,
		...config.size
	},
	physics:  {
		default: 'arcade',
		arcade:  {
			debug: config.debug
		}
	},
	scene:    [ Load, Chat, Tictactoe, Movement ]
} );
