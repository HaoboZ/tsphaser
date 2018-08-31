import * as React from 'react';
import Socket from '../connect/socket';
import Interface from '../interface/interface';

export default class Menu extends Phaser.Scene {
	
	constructor() {
		super( 'Menu' );
	}
	
	public create() {
		Socket.init( this.sys.game );
		Socket.socket.emit( 'start' );
		
		Interface.render( <div className='d-flex justify-content-center w-100 h-100 align-items-center'>
			<h1 className='text-white'>
				Hello World
			</h1>
		</div> );
	}
	
}
