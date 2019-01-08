import { roomInfo, tictactoeInfo } from '../../../shared/events';
import Group from '../../../shared/group';
import config from '../../config';
import Room from '../../connect/room';
import Socket from '../../connect/socket';

export function TictactoeEvents(): tictactoeInfo.events.client.global {
	return {
		[ roomInfo.join ]: ( roomId, { roomType, roomAdmin, roomMaxClients, roomCreationTime, clientsData } ) => {
			let room = Room.Group.get( roomId );
			if ( room || roomType !== tictactoeInfo.type ) return;
			
			room = new TictactoeRoom( roomId, roomAdmin, roomMaxClients, roomCreationTime, clientsData );
			
			Socket.events.emit( tictactoeInfo.join, room );
			if ( config.debug ) console.log( `joined room ${room.id}` );
		}
	};
}

export default class TictactoeRoom extends Room {
	
	public clients: Group<tictactoeInfo.clientData>;
	
	public board = [];
	public first: string;
	public turn: string;
	
	protected roomEvents(): tictactoeInfo.events.client.local {
		return {
			...super.roomEvents(),
			[ tictactoeInfo.start ]: ( roomId, { x, o } ) => {
				for ( let y = 0; y < 3; ++y ) {
					this.board[ y ] = [ 0, 0, 0 ];
				}
				this.turn = this.first = x;
				
				this.events.emit( tictactoeInfo.start );
			},
			[ tictactoeInfo.play ]:  ( roomId, { player, x, y } ) => {
				this.board[ y ][ x ] = player;
				// this.turn = turn;
				
				this.events.emit( tictactoeInfo.play, player, x, y );
			},
			[ tictactoeInfo.over ]:  ( roomId, { winner } ) => {
				this.events.emit( tictactoeInfo.over, winner );
			}
		};
	}
	
}
