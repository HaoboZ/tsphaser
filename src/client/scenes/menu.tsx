import * as React from 'react';
import Interface from '../interface/interface';

import { Button } from 'react-bootstrap/lib';

export default class Menu extends Phaser.Scene {
	
	constructor() {
		super( { key: 'Menu' } );
	}
	
	public create() {
		Interface.render( <div className='h-100 row align-items-center'>
			<div className='mx-auto'>
				<Button
					onClick={() => {
						this.scene.start( 'Flood' );
						Interface.unmount();
					}}>
					Flood
				</Button>
				<Button
					onClick={() => {
						this.scene.start( 'Topdown' );
						Interface.unmount();
					}}>
					Topdown
				</Button>
				<Button
					onClick={() => {
						this.scene.start( 'Multi' );
						Interface.unmount();
					}}>
					Multi
				</Button>
			</div>
		</div> );
	}
	
}
