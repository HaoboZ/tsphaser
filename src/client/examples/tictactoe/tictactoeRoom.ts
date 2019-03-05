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
			if ( config.debug ) console.log( `joined tictactoe room ${room.id}` );
		}
	};
}

export default class TictactoeRoom extends Room {
	
	public clients: Group<tictactoeInfo.clientData>;
	
	public board = [];
	public first: string;
	public turn: boolean;
	
	public playing = false;
	
	constructor( ...args ) {
		// @ts-ignore
		super( ...args );
		
		for ( let y = 0; y < 3; ++y )
			this.board[ y ] = [ 0, 0, 0 ];
	}
	
	protected roomEvents(): tictactoeInfo.events.client.local {
		return {
			...super.roomEvents(),
			[ tictactoeInfo.start ]: ( roomId, { first } ) => {
				for ( let y = 0; y < 3; ++y )
					this.board[ y ] = [ 0, 0, 0 ];
				
				this.first = first;
				this.turn = this.first === Socket.id;
				this.playing = true;
				
				this.events.emit( tictactoeInfo.start );
			},
			[ tictactoeInfo.play ]:  ( roomId, { player, x, y } ) => {
				this.board[ y ][ x ] = player;
				this.turn = !this.turn;
				
				this.events.emit( tictactoeInfo.play, player, x, y );
			},
			[ tictactoeInfo.over ]:  ( roomId, { winner } ) => {
				if ( winner )
					alert( 'The winner is ' + this.clients.get( winner ).clientName );
				else
					alert( 'No one wins' );
				this.playing = false;
				this.events.emit( tictactoeInfo.over );
			}
		};
	}
	
}
