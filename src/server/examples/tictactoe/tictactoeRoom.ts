import { tictactoeInfo } from '../../../shared/events';
import Client from '../../connect/client';
import Room from '../../room/room';
import TictactoeClient from './tictactoeClient';

enum tictactoeState {
	WAIT,
	PLAY
}

export function TictactoeEvents( client: Client ): tictactoeInfo.events.server.global {
	return {
		[ tictactoeInfo.join ]: ( args, returnId ) => {
			let room = Room.Group.getFirst( ( room: TictactoeRoom ) =>
				room.type !== tictactoeInfo.type ? false : room.clients.count === 1
			) as TictactoeRoom;
			if ( !room ) room = new TictactoeRoom( { maxClients: 2 } );
			
			room.join( client, undefined, returnId );
		}
	};
}

class TictactoeRoom extends Room<TictactoeClient> {
	
	public type = tictactoeInfo.type;
	protected baseClient = TictactoeClient;
	
	public state: tictactoeState;
	
	public board = [];
	public x: string;
	public turn: string;
	
	get data() {
		return {
			...super.data,
			board: this.board
		};
	}
	
	protected roomEvents( tttClient: TictactoeClient ): tictactoeInfo.events.server.local {
		let client = tttClient.client;
		return {
			...super.roomEvents( tttClient ),
			[ tictactoeInfo.start ]: ( roomId, args, returnId ) => {
				if ( this.id !== roomId ) return;
				if ( this.state !== tictactoeState.WAIT ) return;
				if ( tttClient.ready ) return;
				
				tttClient.ready = true;
				this.socketEmit( client, returnId );
				for ( let client in this.clients )
					if ( !( this.clients[ client ] as TictactoeClient ).ready ) return;
				
				this.reset();
			},
			[ tictactoeInfo.play ]:  ( roomId, { x, y } ) => {
				if ( this.id !== roomId ) return;
				if ( this.state !== tictactoeState.PLAY ) return;
				
				if ( this.play( client.id, x, y ) ) {
					this.state = tictactoeState.WAIT;
					this.roomEmit( tictactoeInfo.over, { winner: client.id } );
				}
			}
		};
	}
	
	public reset() {
		for ( let y = 0; y < 3; ++y ) {
			this.board[ y ] = [ 0, 0, 0 ];
		}
		this.x = this.turn = TictactoeRoom.randProp( this.clients );
		
		this.state = tictactoeState.PLAY;
		this.roomEmit( tictactoeInfo.play, { first: this.turn } );
	}
	
	public play( player: string, x: number, y: number ) {
		if ( this.board[ y ][ x ] && this.turn !== player ) return false;
		
		this.board[ y ][ x ] = player;
		this.turn = Object.keys( this.clients ).find( value => value !== player );
		
		this.roomEmit( tictactoeInfo.play, { clientId: player, x, y, turn: this.turn } );
		return this.check( player, x, y );
	}
	
	public check( player: string, x: number, y: number ) {
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
	
	public static randProp( obj: Object ): string {
		let arr = Object.keys( obj );
		return arr[ Math.floor( ( Math.random() * arr.length ) ) ];
	}
	
}
