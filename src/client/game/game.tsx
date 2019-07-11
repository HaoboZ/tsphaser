import * as React from 'react';

import config from '../config';
import MovementScene from '../examples/movement/scene';
import TictactoeScene from '../examples/tictactoe/scene';
import Load from './load';


export default class Game extends React.PureComponent {
	
	componentDidMount() {
		const game = new Phaser.Game( {
			title:   'TS Phaser',
			type:    Phaser.AUTO,
			render:  {
				pixelArt: true
			},
			scale:   {
				mode:       config.constantScale ? Phaser.Scale.RESIZE : Phaser.Scale.FIT,
				parent:     'phaser-game',
				autoCenter: Phaser.Scale.CENTER_BOTH,
				...config.size
			},
			physics: {
				default: 'arcade',
				arcade:  {
					debug: config.debug
				}
			},
			scene:   [ Load, MovementScene, TictactoeScene ]
		} );
		
		game.scene.start( 'Load' );
	}
	
	public render() {
		return <div id='phaser-game'/>;
	}
	
}
