import * as SocketIO from 'socket.io';

import config from '../config';
import Room from './room';

export default class Client {
	
	private static list: { [ id: string ]: Client } = {};
	
	public socket: SocketIO.Socket;
	public id: string;
	public rooms: { [ id: string ]: Room } = {};
	
	public data;
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		this.id = this.socket.id;
		if ( config.debug ) console.log( `${this.id} connected` );
		
		// initial data
		this.data = { id: this.id };
		
		Client.list[ this.id ] = this;
		
		socket.on( 'disconnect', this.disconnect );
		socket.on( 'join', this.join );
	}
	
	private disconnect = () => {
		if ( config.debug ) console.log( `${this.id} disconnected` );
		
		// leave all rooms
		for ( let room in this.rooms )
			this.rooms[ room ].leave( this, true );
		
		// remove this player from our clients list
		delete Client.list[ this.id ];
	};
	
	private join = ( roomId: string, password: string ) => {
		let room = Room.list[ roomId ];
		
		// creates a new room
		// TODO: verify client can create one
		if ( !room ) room = new Room( roomId, password, this.id );
		
		room.join( this, password );
	};
	
	public modify( obj: any, remove?: boolean ) {
		if ( remove )
			for ( let p in obj )
				delete this.data[ p ];
		else
			Object.assign( this.data, obj );
	}
	
}
