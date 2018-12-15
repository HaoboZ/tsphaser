import { roomEvents } from '../../shared/events';
import config from '../config';
import RoomGroup from './room.group';
import Socket from './socket';

export function RoomEvents() {
	Socket.socket.on( roomEvents.join,
		( { roomId, roomType, roomAdmin, roomMaxClients, roomCreationTime, clientsData }: { roomId: string, roomType: string, roomAdmin, roomMaxClients, roomCreationTime, clientsData } ) => {
			let room = RoomGroup.get( roomId );
			if ( room || roomType !== roomEvents.type ) return;
			
			room = new Room( roomId, clientsData );
			
			Socket.events.emit( roomEvents.join, room );
			if ( config.debug ) console.log( `joined room ${room.id}` );
		}
	);
	Socket.socket.on( roomEvents.leave,
		( { roomId }: { roomId: string } ) => {
			let room = RoomGroup.get( roomId );
			if ( !room ) return;
			
			RoomGroup.remove( room.id );
			
			Socket.events.emit( roomEvents.leave, room );
			if ( config.debug ) console.log( `left room ${room.id}` );
		}
	);
	Socket.socket.on( roomEvents.client.join,
		( { roomId, clientId, clientName }: { roomId: string, clientId, clientName } ) => {
			let room = RoomGroup.get( roomId );
			if ( !room ) return;
			
			room.clients[ clientId ] = { name: clientName };
			
			room.events.emit( roomEvents.client.join, clientId );
			if ( config.debug ) console.log( `${clientId} joined room ${room.id}` );
		}
	);
	Socket.socket.on( roomEvents.client.leave,
		( { roomId, clientId }: { roomId: string, clientId: string } ) => {
			let room = RoomGroup.get( roomId );
			if ( !room || !room.clientInRoom( clientId ) ) return;
			
			delete room.clients[ clientId ];
			
			room.events.emit( roomEvents.client.leave, clientId );
			if ( config.debug ) console.log( `${clientId} left room ${room.id}` );
		}
	);
}

export default class Room {
	
	public id: string;
	
	public clients: { [ id: string ]: any };
	
	public events = new Phaser.Events.EventEmitter();
	
	constructor( id: string, clients: any ) {
		this.id = id;
		this.clients = clients;
		
		RoomGroup.add( this );
	}
	
	public clientInRoom( id: string ) {
		return this.clients.hasOwnProperty( id );
	}
	
	public emit( event: string, args?: any ) {
		Socket.socket.emit( event, { roomId: this.id, ...args } );
	}
	
}
