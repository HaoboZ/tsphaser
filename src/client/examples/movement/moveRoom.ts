import { moveInfo, roomInfo } from '../../../shared/data';
import config from '../../config';
import Room from '../../connect/room';
import Socket from '../../connect/socket';

export function MoveEvents(): moveInfo.events.client.global {
	return {
		[ roomInfo.join ]: ( roomId, { roomType, roomAdmin, roomMaxClients, roomCreationTime, clientsData } ) => {
			let room = Room.Group.get( roomId );
			if ( room || roomType !== moveInfo.type ) return;
			
			room = new MoveRoom( roomId, roomAdmin, roomMaxClients, roomCreationTime, clientsData );
			
			Socket.events.emit( roomInfo.join, room );
			if ( config.debug ) console.log( `joined movement room ${room.id}` );
		}
	};
}

export default class MoveRoom extends Room<moveInfo.clientData> {
	
	protected roomEvents(): moveInfo.events.client.local {
		return {
			...super.roomEvents(),
			[ moveInfo.move ]: ( roomId, { clientData } ) => {
				if ( this.id !== roomId ) return;
				
				for ( const id in clientData ) {
					const client = this.clients.get( id );
					client.x = clientData[ id ].x;
					client.y = clientData[ id ].y;
				}
				
				this.events.emit( 'sync' );
			}
		};
	}
	
}
