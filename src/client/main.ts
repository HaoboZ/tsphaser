import Sample from './cards/sample';
import config from './config';
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
	scene:    [ Load, Sample ]
} );
