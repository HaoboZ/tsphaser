import { ERROR, error } from './socket';
import Client from './client';

import config from '../config';

/**
 * events
 *   roomJoin
 *   roomLeave
 *   clientEnter
 *   clientExit
 */
export default class Room {
	
	public static list: { [ id: string ]: Room } = {};
	
	public id: string;
	protected password: string;
	public name: string;
	protected admin: string;
	
	protected remove: boolean;
	protected timestamp: number;
	
	public clients: { [ id: string ]: Client } = {};
	
	public static init( client: Client ) {
		client.socket.on( 'joinRoom', this.joinRoom );
		client.socket.on( 'leaveRoom', this.leaveRoom );
	}
	
	private static joinRoom( id: string, password?: string ) {
		let socket = this as any as SocketIO.Socket,
			 room   = Room.list[ id ];
		if ( !room ) {
			error( socket, ERROR.RoomExist );
			return;
		}
		
		room.join( socket.id, password );
	}
	
	private static leaveRoom( id: string ) {
		let socket = this as any as SocketIO.Socket,
			 room   = Room.list[ id ];
		if ( !room ) {
			error( socket, ERROR.RoomExist );
			return;
		}
		
		if ( room.clients[ socket.id ] )
			room.leave( socket.id );
	}
	
	constructor( name: string, password?: string, remove: boolean = true, admin?: string ) {
		do {
			this.id = Math.random().toString( 36 ).substring( 2, 7 );
		} while ( Room.list.hasOwnProperty( this.id ) );
		this.password = password;
		this.name = name;
		this.admin = admin;
		
		this.remove = remove;
		this.timestamp = Date.now();
		
		Room.list[ this.id ] = this;
		if ( config.debug ) console.log( `room ${this.id} created` );
	}
	
	public join( id: string, password: string ) {
		let client     = Client.list[ id ],
			 { socket } = client;
		
		// verify password
		if ( !this.canJoin( id, password ) ) {
			error( socket, ERROR.Permission );
			return;
		}
		
		socket.join( this.id, ( err ) => {
			if ( err ) {
				error( socket, err );
				return;
			}
			
			this.clients[ id ] = client;
			client.rooms[ this.id ] = this;
			
			// confirm joined room
			socket.emit( 'roomJoin', this.id, Object.keys( this.clients ) );
			// tell other clients
			socket.in( this.id ).emit( 'clientEnter', this.id, id );
			if ( config.debug ) console.log( `${id} joined room ${this.name}` );
		} );
	}
	
	public leave( id: string, disconnect?: boolean, close?: boolean ) {
		let { socket } = Client.list[ id ];
		socket.leave( this.id, ( err ) => {
			
			if ( err ) {
				error( socket, err );
				return;
			}
			
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
			if ( config.debug ) console.log( `${id} left room ${this.name}` );
		} );
	}
	
	private canJoin( id: string, password: string ) {
		return !this.clients.hasOwnProperty( id )
			&& ( !this.password || this.password === password );
	}
	
}
