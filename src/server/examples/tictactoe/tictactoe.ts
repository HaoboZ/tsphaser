import { ERROR, error } from '../../../shared/error';
import { tictactoeEvents } from '../../../shared/events';
import Client from '../../connect/client';
import RoomGroup from '../../connect/room.group';
import TictactoeRoom, { TictactoeRoomEvents } from './tictactoeRoom';

export function TictactoeEvents( client: Client ) {
	client.socket.on( tictactoeEvents.start, ( { roomId } ) => {
		let room = RoomGroup.get( roomId ) as TictactoeRoom;
		if ( !room ) return error( client.socket, ERROR.RoomExist );
		
		
	} );
	client.socket.on( tictactoeEvents.play, ( { roomId } ) => {
		let room = RoomGroup.get( roomId ) as TictactoeRoom;
		if ( !room ) return error( client.socket, ERROR.RoomExist );
		
	} );
	TictactoeRoomEvents( client );
}

export default class Tictactoe {
	
	board = [];
	
	constructor() {
		this.reset();
	}
	
	public reset() {
		for ( let y = 0; y < 3; ++y ) {
			this.board[ y ] = [ 0, 0, 0 ];
		}
	}
	
	public play( player, x, y ) {
		if ( this.board[ y ][ x ] )
			return false;
		
		this.board[ y ][ x ] = player;
		
		return this.check( player, x, y );
	}
	
	public check( player, x, y ) {
		let row = 0, col = 0, diag1 = 0, diag2 = 0;
		for ( let z = 0; z < 3; ++z ) {
			if ( this.board[ y ][ z ] === player )
				++row;
			if ( this.board[ z ][ x ] === player )
				++col;
			if ( x === y && this.board[ z ][ z ] === player )
				++diag1;
			if ( x + y === 2 && this.board[ z ][ 2 - z ] === player )
				++diag2;
		}
		return row === 3 || col === 3 || diag1 === 3 || diag2 === 3;
	}
	
	get data() {
		return { board: this.board };
	}
	
}
