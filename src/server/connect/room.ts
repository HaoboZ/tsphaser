import { ERROR, error } from '../../shared/error';
import { roomEvents, socketEvents } from '../../shared/events';
import config from '../config';
import Client from './client';
import RoomGroup from './room.group';
import Socket from './socket';

export function RoomEvents( client: Client ) {
	client.socket.on( socketEvents.disconnect,
		() => {
			// leave all rooms
			for ( let room in client.rooms )
				client.rooms[ room ].leave( client, true );
		}
	);
	client.socket.on( roomEvents.join,
		( { roomId, password }: { roomId: string, password?: string } ) => {
			let room = RoomGroup.get( roomId );
			if ( !room ) return error( client.socket, ERROR.RoomExist );
			
			room.join( client, password );
		}
	);
	client.socket.on( roomEvents.leave,
		( { roomId }: { roomId: string } ) => {
			let room = RoomGroup.get( roomId );
			if ( !room ) return error( client.socket, ERROR.RoomExist );
			if ( !room.hasClient( client ) ) return error( client.socket, ERROR.ClientNotInRoom );
			
			room.leave( client );
		}
	);
}

export default class Room {
	
	public type = roomEvents.type;
	
	public id: string;
	protected password: string;
	public admin: string;
	public maxClients: number;
	public remove: boolean;
	
	public timeCreated: number;
	
	protected clients: { [ id: string ]: Client } = {};
	
	constructor( { id, password, admin, maxClients = 50, remove = true }: { id?, password?, admin?, maxClients?, remove? } ) {
		this.id = id;
		while ( !this.id && !RoomGroup.get( this.id ) )
			this.id = Math.random().toString( 36 ).substring( 2, 7 );
		this.password = password;
		this.admin = admin;
		this.maxClients = maxClients;
		this.remove = remove;
		
		this.timeCreated = Date.now();
		RoomGroup.add( this );
		
		if ( config.debug ) console.log( `room ${this.id} created` );
	}
	
	get data() {
		let clients = {};
		for ( let client in this.clients ) {
			clients[ client ] = ( this.clients[ client ] as Client ).data;
		}
		
		return {
			roomId:           this.id,
			roomType:         this.type,
			roomAdmin:        this.admin,
			roomMaxClients:   this.maxClients,
			roomCreationTime: this.timeCreated,
			clientsData:      clients
		};
	}
	
	/**
	 * @param client
	 * @param password
	 */
	public join( client: Client, password?: string ) {
		let { socket } = client;
		
		// verify password
		if ( !this.canJoin( client, password ) )
			return error( socket, ERROR.UnableJoinRoom );
		
		socket.join( this.id, ( err ) => {
			if ( err ) return error( socket, err );
			
			this.clients[ client.id ] = client;
			client.rooms[ this.id ] = this;
			
			// confirm joined room
			socket.emit( roomEvents.join, this.data );
			
			// tell other clients
			this.socketRoomEmit( client, roomEvents.client.join, client.data );
			
			if ( config.debug ) console.log( `${client.id} joined room ${this.id}` );
		} );
	}
	
	/**
	 * @param client
	 * @param disconnect
	 * @param close
	 */
	public leave( client: Client, disconnect?: boolean, close?: boolean ) {
		client.socket.leave( this.id, ( err ) => {
			if ( err ) return error( client.socket, err );
			
			delete this.clients[ client.id ];
			
			// remove all clients if admin leaves
			if ( this.admin === client.id )
				for ( let client in this.clients )
					this.leave( this.clients[ client ], false, true );
			
			// removes room if all clients leave
			if ( this.remove && !Object.keys( this.clients ).length ) RoomGroup.remove( this );
			
			// confirm leave room
			if ( !disconnect ) this.socketEmit( client, roomEvents.leave );
			
			// tell other clients
			if ( !close ) this.socketRoomEmit( client, roomEvents.client.leave, client.data );
			
			if ( config.debug ) console.log( `${client.id} left room ${this.id}` );
		} );
	}
	
	public canJoin( client: Client, password: string ) {
		return !this.hasClient( client )
			&& ( !this.password || this.password === password )
			&& ( this.maxClients > Object.keys( this.clients ).length );
	}
	
	public hasClient( client: Client ) {
		return this.clients.hasOwnProperty( client.id );
	}
	
	public roomEmit( event: string, args? ) {
		Socket.io.in( this.id ).emit( event, {
			roomId: this.id,
			...args
		} );
	}
	
	public socketEmit( client: Client, event: string, args? ) {
		client.socket.emit( event, {
			roomId: this.id,
			...args
		} );
	}
	
	public socketRoomEmit( client: Client, event: string, args? ) {
		client.socket.in( this.id ).emit( event, {
			roomId: this.id,
			...args
		} );
	}
	
}
