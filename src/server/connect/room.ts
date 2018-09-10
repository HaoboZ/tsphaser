import { ERROR, error } from './socket';
import Client from './client';

import config from '../config';

export default abstract class Room {
	
	public static list: { [ id: string ]: Room } = {};
	
	public id: string;
	protected password: string;
	protected admin: string;
	
	public data: any;
	
	protected remove: boolean;
	protected timestamp: number;
	
	public clients: { [ id: string ]: Client } = {};
	
	public static init( client: Client ) {
		client.socket.on( 'joinRoom', this.join );
		client.socket.on( 'leaveRoom', this.leave );
	}
	
	/**
	 * @event joinRoom
	 *
	 * @param id
	 * @param password
	 */
	private static join( id: string, password?: string ) {
		let socket = this as any as SocketIO.Socket,
			 room   = Room.list[ id ];
		if ( !room ) return error( socket, ERROR.RoomExist );
		
		room.join( socket.id, password );
	}
	
	/**
	 * @event leaveRoom
	 *
	 * @param id
	 */
	private static leave( id: string ) {
		let socket = this as any as SocketIO.Socket,
			 room   = Room.list[ id ];
		if ( !room ) return error( socket, ERROR.RoomExist );
		if ( !room.clients[ socket.id ] ) return error( socket, ERROR.ClientInRoom );
		
		room.leave( socket.id );
	}
	
	constructor( name: string, password?: string, remove: boolean = true, admin?: string ) {
		do {
			this.id = Math.random().toString( 36 ).substring( 2, 7 );
		} while ( Room.list.hasOwnProperty( this.id ) );
		this.password = password;
		this.data = { name };
		this.admin = admin;
		
		this.remove = remove;
		this.timestamp = Date.now();
		
		Room.list[ this.id ] = this;
		if ( config.debug ) console.log( `room ${this.id} created` );
	}
	
	/**
	 * @emits roomJoin
	 *   room id
	 *   room data
	 *   all client data
	 * @emits clientEnter
	 *   room id
	 *   client id
	 *   client data
	 *
	 * @param id
	 * @param password
	 */
	public join( id: string, password: string ) {
		let client     = Client.list[ id ],
			 { socket } = client;
		
		// verify password
		if ( !this.canJoin( id, password ) )
			return error( socket, ERROR.Permission );
		
		socket.join( this.id, ( err ) => {
			if ( err ) return error( socket, err );
			
			this.clients[ id ] = client;
			client.rooms[ this.id ] = this;
			
			// confirm joined room
			let clients = {};
			for ( let client in this.clients ) {
				clients[ client ] = this.clients[ client ].data;
			}
			socket.emit( 'roomJoin', this.id, this.data, this.clients );
			// tell other clients
			socket.in( this.id ).emit( 'clientEnter', this.id, id, client.data );
			if ( config.debug ) console.log( `${id} joined room ${this.data.name}` );
		} );
	}
	
	/**
	 * @emits roomLeave
	 *   room id
	 * @emits clientExit
	 *   room id
	 *   client id
	 *
	 * @param id
	 * @param disconnect
	 * @param close
	 */
	public leave( id: string, disconnect?: boolean, close?: boolean ) {
		let { socket } = Client.list[ id ];
		socket.leave( this.id, ( err ) => {
			if ( err ) return error( socket, err );
			
			delete this.clients[ id ];
			
			// remove all clients if admin leaves
			if ( this.admin === id )
				for ( let client in this.clients )
					this.leave( this.clients[ client ].id, false, true );
			
			// removes room if all clients leave
			if ( this.remove && !Object.keys( this.clients ).length ) delete Room.list[ this.id ];
			
			// confirm leave room
			if ( !disconnect ) socket.emit( 'roomLeave', this.id );
			// tell other clients
			if ( !close ) socket.in( this.id ).emit( 'clientExit', this.id, id );
			if ( config.debug ) console.log( `${id} left room ${this.data.name}` );
		} );
	}
	
	private canJoin( id: string, password: string ) {
		return !this.clients.hasOwnProperty( id )
			&& ( !this.password || this.password === password );
	}
	
}
