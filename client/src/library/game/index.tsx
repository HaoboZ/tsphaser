import * as React from 'react';

import config from '../../config';
import Load from './load';


interface Props {
	scene: Phaser.Types.Core.GameConfig['scene']
	config?: Phaser.Types.Core.GameConfig
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
			scene:   [ Load ].concat( props.scene as [] ),
			...props.config
		} );
		
		game.scene.start( 'Load' );
	}, [] );
	
	return <div id='phaser-game' style={{ zIndex: -1 }}/>;
}
