import { chatEvents, roomEvents } from '../../../shared/events';
import config from '../../config';
import Room from '../../connect/room';
import RoomGroup from '../../connect/room.group';
import Socket from '../../connect/socket';

export function ChatEvents() {
	Socket.socket.on( roomEvents.join,
		( { roomId, roomType, roomAdmin, roomMaxClients, roomCreationTime, clientsData } ) => {
			let room = RoomGroup.get( roomId );
			if ( room || roomType !== chatEvents.type ) return;
			
			room = new ChatRoom( roomId, clientsData );
			
			Socket.events.emit( roomEvents.join, room );
			if ( config.debug ) console.log( `joined room ${room.id}` );
		}
	);
	Socket.socket.on( roomEvents.client.join,
		( { roomId, clientId, clientName } ) => {
			let room = RoomGroup.get( roomId ) as ChatRoom;
			if ( !room ) return;
			
			let message = `${clientName} joined the room`,
				 data    = { clientId, message };
			room.log.push( data );
			room.events.emit( chatEvents.message, data );
		}
	);
	Socket.socket.on( roomEvents.client.leave,
		( { roomId, clientId, clientName } ) => {
			let room = RoomGroup.get( roomId ) as ChatRoom;
			if ( !room ) return;
			
			let message = `${clientName} left the room`,
				 data    = { clientId, message };
			room.log.push( data );
			room.events.emit( chatEvents.message, data );
		}
	);
	Socket.socket.on( chatEvents.message, ( { roomId, clientId, name, message } ) => {
		let room = RoomGroup.get( roomId ) as ChatRoom;
		if ( !room ) return;
		
		let data = { clientId, name, message };
		room.log.push( data );
		room.events.emit( chatEvents.message, data );
	} );
}

export default class ChatRoom extends Room {
	
	public log = [];
	
	public send( message ) {
		this.emit( chatEvents.message, { message } );
	}
	
}
