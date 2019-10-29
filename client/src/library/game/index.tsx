import * as React from 'react';

import config from '../../config';
import Load from './load';


interface Props {
	config?: Phaser.Types.Core.GameConfig,
	scene?: { [ name: string ]: typeof Phaser.Scene }
}

export default function Game( props: Props ) {
	React.useEffect( () => {
		const game = new Phaser.Game( {
			title:   'TS Phaser',
			type:    Phaser.AUTO,
			render:  {
				pixelArt: true
			},
			scale:   {
				mode:       config.constantScale ? Phaser.Scale.FIT : Phaser.Scale.RESIZE,
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
			scene:   [ Load ],
			...props.config
		} );
		
		if ( 'scene' in props )
			for ( const scene in props.scene ) {
				game.scene.add( scene, props.scene[ scene ] );
			}
	}, [] );
	
	return <div id='phaser-game' style={{ zIndex: -1 }}/>;
}
