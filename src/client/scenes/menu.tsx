import * as React from 'react';
import Interface from '../interface/interface';

export default class Menu extends Phaser.Scene {
	
	constructor() {
		super( { key: 'Menu' } );
	}
	
	public create() {
		Interface.render(
			<div className='d-flex justify-content-center w-100 h-100 align-items-center'>
				<h1 className='text-white'>Hello World</h1>
			</div>
		);
	}
	
}
