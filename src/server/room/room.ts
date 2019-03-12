import { EventEmitter } from 'events';
import { clientInfo, roomInfo } from '../../shared/data';
import { ERROR, error } from '../../shared/error';
import Group from '../../shared/group';
import config from '../config';
import Client from '../connect/client';
import Socket from '../connect/socket';
import RoomClient from './roomClient';

export function RoomEvents( client: Client ): roomInfo.events.server.global {
	return {
		[ roomInfo.join ]: ( { roomId, password }, returnId ) => {
			const room = Room.Group.get( roomId );
			if ( !room ) return;
			
			room.join( client, password, returnId );
		}
	};
}

type constructor = {
	/**
	 * If no id is given, will generate a unique random 5 alphanumeric code.
	 */
	id?: string
	password?: string
	admin?: string
	maxClients?: number
	remove?: boolean
};

export default class Room<T extends RoomClient> {
	
	public static Group = new Group<Room<any> | any>();
	
	public type = roomInfo.type;
	protected baseClient = RoomClient;
	
	public id: roomInfo.id;
	protected password: string;
	public admin: string;
	public maxClients: number;
	public remove: boolean;
	/**
	 * Timestamp in milliseconds.
	 */
	public timeCreated: number;
	public clients = new Group<T>();
	
	public events = new EventEmitter();
	
	get data(): roomInfo.roomData {
		const clients: { [ id: string ]: clientInfo.clientData } = {};
		this.clients.iterate( ( item, id ) => {
			clients[ id ] = item.data;
		} );
		return {
			roomId:           this.id,
			roomType:         this.type,
			roomAdmin:        this.admin,
			roomMaxClients:   this.maxClients,
			roomCreationTime: this.timeCreated,
			clientsData:      clients
		};
	}
	
	constructor( { id, password, admin, maxClients = 50, remove = true }: constructor ) {
		this.id = id;
		while ( !this.id && !Room.Group.get( this.id ) )
			this.id = Math.random().toString( 36 ).substring( 2, 7 );
		this.password = password;
		this.admin = admin;
		this.maxClients = maxClients;
		this.remove = remove;
		this.timeCreated = Date.now();
		
		Room.Group.add( this.id, this );
		this.onCreate();
		
		if ( config.debug ) console.log( `room ${this.id} created` );
	}
	
	protected roomEvents( roomClient: RoomClient ): roomInfo.events.server.local {
		const client = roomClient.client;
		
		return {
			[ clientInfo.disconnect ]: () => {
				this.leave( client, true );
			},
			[ roomInfo.leave ]:        ( roomId, args, returnId ) => {
				if ( this.id !== roomId ) return;
				
				this.leave( client, undefined, undefined, returnId );
			}
		};
	}
	
	protected onCreate() {
	};
	
	protected onRemove() {
	};
	
	/**
	 * @param client
	 * @param password
	 * @param returnId
	 */
	public join( client: Client, password?: string, returnId?: string ) {
		const { socket } = client;
		
		// verify password
		if ( !this.canJoin( client, password ) ) return error( socket, ERROR.UnableJoinRoom );
		
		socket.join( this.id, ( err ) => {
			if ( err ) return error( socket, ERROR.UnableJoinRoom );
			
			const roomClient = this.clients.add( client.id, new this.baseClient( client ) as T );
			client.rooms.add( this.id, this );
			roomClient.events = this.roomEvents( roomClient );
			client.multiOn( () => roomClient.events );
			
			// confirm joined room
			this.socketEmit( client, roomInfo.join, this.data );
			if ( returnId ) this.socketEmit( client, returnId );
			
			// tell other clients
			this.socketRoomEmit( client, roomInfo.clientJoin, roomClient.data );
			
			this.events.emit( roomInfo.join, roomClient );
			if ( config.debug ) console.log( `${client.id} joined room ${this.id}` );
		} );
	}
	
	/**
	 * @param client
	 * @param disconnect
	 * @param close
	 * @param returnId
	 */
	public leave( client: Client, disconnect?: boolean, close?: boolean, returnId?: string ) {
		if ( !this.hasClient( client ) ) return error( client.socket, ERROR.ClientNotInRoom );
		
		client.socket.leave( this.id, ( err ) => {
			if ( err ) return error( client.socket, ERROR.UnableLeaveRoom );
			
			const roomClient = this.clients.remove( client.id );
			client.rooms.remove( this.id );
			if ( config.debug ) console.log( `${client.id} left room ${this.id}` );
			
			// remove listeners
			for ( const event in roomClient.events )
				client.socket.removeListener( event, roomClient.events[ event ] );
			
			// remove all clients if admin leaves
			if ( this.admin === client.id )
				this.clients.iterate( ( item ) => {
					this.leave( item.client, false, true );
				} );
			
			// removes room if all clients leave
			if ( this.remove && !this.clients.count ) {
				Room.Group.remove( this.id );
				this.onRemove();
				if ( config.debug ) console.log( `removed room ${this.id}` );
			}
			
			// confirm leave room
			if ( !disconnect ) {
				this.socketEmit( client, roomInfo.leave );
				if ( returnId ) this.socketEmit( client, returnId );
			}
			
			// tell other clients
			if ( !close ) this.socketRoomEmit( client, roomInfo.clientLeave, roomClient.data );
			
			this.events.emit( roomInfo.leave, roomClient );
		} );
	}
	
	public canJoin( client: Client, password: string ) {
		return !this.hasClient( client )
			&& ( !this.password || this.password === password )
			&& ( this.maxClients > this.clients.count );
	}
	
	public hasClient( client: Client ) {
		let hasClient = false;
		this.clients.iterate( ( item ) => {
			if ( item.client === client ) return hasClient = true;
		} );
		return hasClient;
	}
	
	/**
	 * Emits to all in room.
	 *
	 * @param event
	 * @param args
	 */
	public roomEmit( event: string, args?: any ) {
		Socket.io.in( this.id ).emit( event, this.id, args );
	}
	
	/**
	 * Emits to client.
	 *
	 * @param client
	 * @param event
	 * @param args
	 */
	public socketEmit( client: Client, event: string, args?: any ) {
		client.socket.emit( event, this.id, args );
	}
	
	/**
	 * Emits to all except client in room.
	 *
	 * @param client
	 * @param event
	 * @param args
	 */
	public socketRoomEmit( client: Client, event: string, args?: any ) {
		client.socket.in( this.id ).emit( event, this.id, args );
	}
	
}
