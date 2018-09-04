import * as SocketIO from 'socket.io';
import Room from './room';

import config from '../config';

export default class Client {
	
	public static list: { [ id: string ]: Client } = {};
	
	public socket: SocketIO.Socket;
	public id: string;
	public rooms: { [ id: string ]: Room } = {};
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		this.id = this.socket.id;
		if ( config.debug ) console.log( `${this.id} connected` );
		
		Client.list[ this.id ] = this;
		
		socket.on( 'disconnect', this.disconnect );
		Room.init( this );
	}
	
	private disconnect = () => {
		if ( config.debug ) console.log( `${this.id} disconnected` );
		
		// leave all rooms
		for ( let room in this.rooms )
			this.rooms[ room ].leave( this.id, true );
		
		// remove this player from our clients list
		delete Client.list[ this.id ];
	};
	
}
