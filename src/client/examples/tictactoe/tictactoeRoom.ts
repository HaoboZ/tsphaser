import { roomInfo, tictactoeInfo } from '../../../shared/events';
import Group from '../../../shared/group';
import config from '../../config';
import Room from '../../connect/room';
import Socket from '../../connect/socket';

export function TictactoeEvents() {
	Socket.socket.on( roomInfo.join,
		( roomId, { roomType, roomAdmin, roomMaxClients, roomCreationTime, clientsData }: roomInfo.roomData ) => {
			let room = Room.Group.get( roomId );
			if ( room || roomType !== tictactoeInfo.room.type ) return;
			
			room = new TictactoeRoom( roomId, roomAdmin, roomMaxClients, roomCreationTime, clientsData );
			
			Socket.events.emit( tictactoeInfo.room.join, room );
			if ( config.debug ) console.log( `joined room ${room.id}` );
		}
	);
}

export default class TictactoeRoom extends Room {
	
	public clients: Group<tictactoeInfo.clientData>;
	
	public board = [];
	public first: string;
	public turn: string;
	
	protected roomEvents() {
		return {
			...super.roomEvents(),
			[ tictactoeInfo.start ]: ( roomId, { first } ) => {
				for ( let y = 0; y < 3; ++y ) {
					this.board[ y ] = [ 0, 0, 0 ];
				}
				this.turn = this.first = first;
				
				this.events.emit( tictactoeInfo.start );
			},
			[ tictactoeInfo.play ]:  ( roomId, { clientId, x, y, turn } ) => {
				this.board[ y ][ x ] = clientId;
				this.turn = turn;
				
				this.events.emit( tictactoeInfo.play, clientId, x, y );
			},
			[ tictactoeInfo.over ]:  ( roomId, { winner } ) => {
				this.events.emit( tictactoeInfo.over, winner );
			}
		};
	}
	
}
