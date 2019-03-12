import { chatInfo, roomInfo } from '../../../shared/data';
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
			if ( config.debug ) console.log( `joined chat room ${room.id}` );
		}
	};
}

export default class ChatRoom extends Room<chatInfo.clientData> {
	
	public log: Array<{ clientId, name, message }> = [];
	
	constructor( id: string, admin: string, maxClients: number, timeCreated: number, clients: { [ id: string ]: chatInfo.clientData } ) {
		super( id, admin, maxClients, timeCreated, clients );
		
		this.events.on( roomInfo.clientJoin,
			( client ) => {
				const message = `${client.name} joined the room`,
				    data    = { clientId: client.clientId, name: client.name, message };
				this.log.unshift( data );
				this.events.emit( chatInfo.message, data );
			}
		);
		this.events.on( roomInfo.clientLeave,
			( client ) => {
				const message = `${client.name} left the room`,
				    data    = { clientId: client.id, name: client.name, message };
				this.log.unshift( data );
				this.events.emit( chatInfo.message, data );
			}
		);
	}
	
	protected roomEvents(): chatInfo.events.client.local {
		return {
			...super.roomEvents(),
			[ chatInfo.message ]: ( roomId, { clientId, name, message } ) => {
				if ( this.id !== roomId ) return;
				
				const data = { clientId, name, message };
				this.log.unshift( data );
				this.events.emit( chatInfo.message, data );
			}
		};
	}
	
	public send( message ) {
		this.emit( chatInfo.message, { message } );
	}
	
}
