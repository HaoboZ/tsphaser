import * as React from 'react';
import Socket from '../connect/socket';
import Interface from '../interface/interface';
import Room from '../connect/room';

import ChatRoom from '../examples/chatRoom';

export default class Menu extends Phaser.Scene {
	
	room: ChatRoom;
	
	constructor() {
		super( 'Menu' );
	}
	
	public create() {
		Socket.init( this.sys.game );
		Room.join( 'chatTest' );
		
		this.sys.game.events.on( 'join', ( room ) => this.room = room );
		
		this.input.keyboard.on( 'keydown', ( e: KeyboardEvent ) => this.room.send( e.key ) );
		Interface.render( <p>Hi there</p> );
	}
	
}
