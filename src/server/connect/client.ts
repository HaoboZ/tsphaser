import * as SocketIO from 'socket.io';
import { ERROR, error } from './socket';

import Main from '../main';
import Room from './room';

import config from '../config';

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
		socket.on( 'create', this.create );
		socket.on( 'join', this.join );
		socket.on( 'start', () => this.join( Main.global.id ) );
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
		new Room( name, password, this.id );
	};
	
	private join = ( id: string, password?: string ) => {
		let room = Room.list[ id ];
		if ( !room ) error( this.socket, ERROR.NoRoom );
		
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
