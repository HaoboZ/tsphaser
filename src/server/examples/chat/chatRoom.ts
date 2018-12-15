import { ERROR, error } from '../../../shared/error';
import { chatEvents } from '../../../shared/events';
import Client from '../../connect/client';
import Room from '../../connect/room';
import RoomGroup from '../../connect/room.group';

export function ChatEvents( client: Client ) {
	client.socket.on( chatEvents.message, ( { roomId, message } ) => {
		let room = RoomGroup.get( roomId ) as ChatRoom;
		if ( !room ) return error( client.socket, ERROR.RoomExist );
		
		room.send( client, message );
	} );
}

export default class ChatRoom extends Room {
	
	public type = chatEvents.type;
	
	protected log = [];
	
	public send( client, message ) {
		let data = { clientId: client.id, name: client.name, message };
		
		this.log.push( data );
		this.roomEmit( chatEvents.message, data );
	}
	
}
