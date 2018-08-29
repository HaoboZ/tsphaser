import * as React from 'react';
import Interface from '../interface/interface';

export default class Menu extends Phaser.Scene {
	
	constructor() {
		super( 'Menu' );
	}
	
	public create() {
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
