import * as React from 'react';
import config from './config';
import Chat from './examples/chat/chat';
import Load from './load';


export default class Game extends React.PureComponent {
	
	componentDidMount() {
		const game = new Phaser.Game( {
			type:     Phaser.AUTO,
			// @ts-ignore
			pixelArt: true,
			scale:    {
				mode:       Phaser.Scale.FIT,
				parent:     'phaser-game',
				autoCenter: Phaser.Scale.CENTER_BOTH,
				...config.size
			},
			physics:  {
				default: 'arcade',
				arcade:  {
					debug: config.debug
				}
			},
			scene:    [ Load, Chat ]
		} );
		
		game.scene.start( 'Load', { start: 'Chat' } );
	}
	
	public render() {
		return <div id='phaser-game'/>;
	}
	
}

