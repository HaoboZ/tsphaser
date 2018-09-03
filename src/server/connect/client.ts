import * as SocketIO from 'socket.io';
import Socket, { ERROR, error } from './socket';
import Room from './room';

import config from '../config';

export default class Client {
	
	private static list: { [ id: string ]: Client } = {};
	
	public socket: SocketIO.Socket;
	public id: string;
	public rooms: { [ id: string ]: Room } = {};
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		this.id = this.socket.id;
		if ( config.debug ) console.log( `${this.id} connected` );
		
		Client.list[ this.id ] = this;
		
		socket.on( 'disconnect', this.disconnect );
		socket.on( 'create', this.create );
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
	
	private create = ( name: string, password?: string ) => {
		// TODO: verify client can create one and whether to set admin
		new Socket.room( name, password, true, this.id );
	};
	
	private join = ( id: string, password?: string ) => {
		let room = Room.list[ id ];
		if ( !room ) error( this.socket, ERROR.NoRoom );
		
		room.join( this, password );
	};
	
}
