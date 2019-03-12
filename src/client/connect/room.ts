import { clientInfo, roomInfo } from '../../shared/data';
import Group from '../../shared/group';
import config from '../config';
import Socket from './socket';

export function RoomEvents(): roomInfo.events.client.global {
	return {
		[ roomInfo.join ]: ( roomId, { roomType, roomAdmin, roomMaxClients, roomCreationTime, clientsData } ) => {
			let room = Room.Group.get( roomId );
			if ( room || roomType !== roomInfo.type ) return;
			
			room = new Room( roomId, roomAdmin, roomMaxClients, roomCreationTime, clientsData );
			
			Socket.events.emit( roomInfo.join, room );
			if ( config.debug ) console.log( `joined room ${room.id}` );
		}
	};
}

export default class Room<T extends clientInfo.clientData> {
	
	public static Group = new Group<Room<any>>();
	
	public id: string;
	public admin: string;
	public maxClients: number;
	public timeCreated: number;
	public clients = new Group<T>();
	
	public events = new Phaser.Events.EventEmitter();
	
	private readonly _events: Object;
	
	constructor( id: string, admin: string, maxClients: number, timeCreated: number, clients: { [ id: string ]: clientInfo.clientData } ) {
		this.id = id;
		this.admin = admin;
		this.maxClients = maxClients;
		this.timeCreated = timeCreated;
		for ( const id in clients )
			this.clients.add( id, clients[ id ] as T );
		
		this._events = this.roomEvents();
		for ( const event in this._events )
			Socket.socket.on( event, this._events[ event ] );
		
		Room.Group.add( this.id, this );
	}
	
	protected roomEvents(): roomInfo.events.client.local {
		return {
			[ roomInfo.leave ]:       ( roomId ) => {
				if ( this.id !== roomId ) return;
				
				Room.Group.remove( this.id );
				for ( const event in this._events )
					Socket.socket.off( event, this._events[ event ] );
				
				this.events.emit( roomInfo.leave, this );
				if ( config.debug ) console.log( `left room ${this.id}` );
			},
			[ roomInfo.clientJoin ]:  ( roomId, clientData ) => {
				if ( this.id !== roomId ) return;
				
				this.clients.add( clientData.clientId, clientData as T );
				
				this.events.emit( roomInfo.clientJoin, clientData );
				if ( config.debug ) console.log( `${clientData.clientId} joined room ${this.id}` );
			},
			[ roomInfo.clientLeave ]: ( roomId, { clientId } ) => {
				if ( this.id !== roomId ) return;
				
				const client = this.clients.get( clientId );
				this.clients.remove( clientId );
				
				this.events.emit( roomInfo.clientLeave, client );
				if ( config.debug ) console.log( `${clientId} left room ${this.id}` );
			}
		};
	}
	
	public emit( event: string, args?: any, fn?: Function ) {
		let returnId: string;
		if ( fn ) {
			returnId = Math.random().toString( 36 ).substring( 2, 12 );
			Socket.socket.once( returnId, fn );
		}
		Socket.socket.emit( event, this.id, { ...args }, returnId );
	}
	
}
