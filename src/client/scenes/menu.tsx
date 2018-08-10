import * as React from 'react';
import Interface from '../interface/interface';

import './style.less';

export default class Menu extends Phaser.Scene {
	
	constructor() {
		super( { key: 'Menu' } );
	}
	
	public create() {
		Interface.render( <div className='center'>
			<button
				className='txt'
				onClick={() => {
					this.scene.start( 'Flood' );
					Interface.clean();
				}}>
				Flood
			</button>
			<button
				className='txt'
				onClick={() => {
					this.scene.start( 'Topdown' );
					Interface.clean();
				}}>
				Topdown
			</button>
		</div> );
	}
	
}
