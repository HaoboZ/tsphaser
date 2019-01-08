import { chatInfo, roomInfo } from '../../../shared/events';
import Group from '../../../shared/group';
import config from '../../config';
import Room from '../../connect/room';
import Socket from '../../connect/socket';

export function ChatEvents(): chatInfo.events.client.global {
	return {
		[ roomInfo.join ]: ( roomId, { roomType, roomAdmin, roomMaxClients, roomCreationTime, clientsData } ) => {
			let room = Room.Group.get( roomId );
			if ( room || roomType !== chatInfo.type ) return;
			
			room = new ChatRoom( roomId, roomAdmin, roomMaxClients, roomCreationTime, clientsData );
			
			Socket.events.emit( roomInfo.join, room );
			if ( config.debug ) console.log( `joined room ${room.id}` );
		}
	};
}

export default class ChatRoom extends Room {
	
	public clients: Group<chatInfo.clientData>;
	
	public log: Array<{ clientId, clientName, message }> = [];
	
	constructor( id: string, admin: string, maxClients: number, timeCreated: number, clients: { [ id: string ]: chatInfo.clientData } ) {
		super( id, admin, maxClients, timeCreated, clients );
		
		this.events.on( roomInfo.clientJoin,
			( client ) => {
				let message = `${client.clientName} joined the room`,
				    data    = { clientId: client.clientId, clientName: client.clientName, message };
				this.log.unshift( data );
				this.events.emit( chatInfo.message, data );
			}
		);
		this.events.on( roomInfo.clientLeave,
			( client ) => {
				let message = `${client.clientName} left the room`,
				    data    = { clientId: client.id, clientName: client.clientName, message };
				this.log.unshift( data );
				this.events.emit( chatInfo.message, data );
			}
		);
	}
	
	protected roomEvents(): chatInfo.events.client.local {
		return {
			...super.roomEvents(),
			[ chatInfo.message ]: ( roomId, { clientId, clientName, message } ) => {
				if ( this.id !== roomId ) return;
				
				let data = { clientId, clientName, message };
				this.log.unshift( data );
				this.events.emit( chatInfo.message, data );
			}
		};
	}
	
	public send( message ) {
		this.emit( chatInfo.message, { message } );
	}
	
}
