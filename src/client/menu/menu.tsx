import * as React from 'react';
import Socket from '../connect/socket';
import Interface from '../interface/interface';


export default class Menu extends Phaser.Scene {
	
	constructor() {
		super( 'Menu' );
	}
	
	public create() {
		Socket.init( this.sys.game );
		
		Interface.render( <p>Hi there</p> );
	}
	
}
