import * as SocketIO from 'socket.io';
import Room from './room';
import ChatRoom from '../examples/chatRoom';

import config from '../config';

export default class Client {
	
	public static list: { [ id: string ]: Client } = {};
	
	private static _name = 0;
	
	public socket: SocketIO.Socket;
	public id: string;
	public rooms: { [ id: string ]: Room } = {};
	
	public data = { name: `client ${++Client._name}` };
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		this.id = this.socket.id;
		if ( config.debug ) console.log( `${this.id} connected` );
		
		Client.list[ this.id ] = this;
		
		socket.on( 'disconnect', this.disconnect );
		Room.init( this );
		ChatRoom.init( this );
	}
	
	/**
	 * @event disconnect
	 */
	private disconnect() {
		let socket = this as any as SocketIO.Socket,
			 client = Client.list[ socket.id ];
		if ( config.debug ) console.log( `${client.id} disconnected` );
		
		// leave all rooms
		for ( let room in client.rooms )
			client.rooms[ room ].leave( client.id, true );
		
		// remove this player from our clients list
		delete Client.list[ client.id ];
	};
	
}
