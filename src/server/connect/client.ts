import * as SocketIO from 'socket.io';
import Socket from './socket';

import config from '../config';
import Room from './room';

export default class Client {
	
	private static list: { [ id: string ]: Client } = {};
	
	public socket: SocketIO.Socket;
	
	public data: any = {};
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		if ( config.debug ) console.log( `${this.socket.id} connected` );
		
		Client.list[ this.socket.id ] = this;
		
		// initial data
		this.data.id = this.socket.id;
		
		socket.on( 'disconnect', this.disconnect );
		socket.on( 'join', this.join );
	}
	
	private join = ( id: string, password: string ) => {
		// verify if possible to join
		let room = Room.list[ id ];
		if ( !room )
			room = new Room( id, password );
		
		if ( !room || room.canJoin( password ) )
			this.socket.join( id, ( err ) => {
				if ( err ) {
					this.error( err );
					return;
				}
				
				room.join( this );
			} );
	};
	
	private disconnect = () => {
		if ( config.debug ) console.log( `${this.socket.id} disconnected` );
		
		// remove this player from our clients list
		delete Client.list[ this.socket.id ];
		
		// emit leave to all clients
		Socket.io.emit( 'leave', this.socket.id );
	};
	
	public modify( obj: any, remove?: boolean ) {
		if ( remove )
			for ( let p in obj )
				delete this.data[ p ];
		else
			Object.assign( this.data, obj );
	}
	
	
	private error( err? ) {
		this.socket.emit( 'error', err );
	}
	
}
