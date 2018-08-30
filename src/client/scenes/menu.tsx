import * as React from 'react';
import Socket from '../connect/socket';
import Interface from '../interface/interface';

export default class Menu extends Phaser.Scene {
	
	constructor() {
		super( 'Menu' );
	}
	
	public create() {
		Socket.init( this.sys.game );
		
		Interface.render(
			<div className='d-flex justify-content-center w-100 h-100 align-items-center'>
				<button
					style={{ fontSize: 30 }}
					onClick={() => {
						Interface.unmount();
						this.scene.start( 'Game' );
					}}
				>
					Play
				</button>
			</div>
		);
	}
	
}
