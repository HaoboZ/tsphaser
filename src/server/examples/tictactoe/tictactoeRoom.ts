import { roomInfo, tictactoeInfo } from '../../../shared/data';
import config from '../../config';
import Client from '../../connect/client';
import Room from '../../room/room';
import tictactoeClient from './tictactoeClient';
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
	
	public state: tictactoeState = tictactoeState.WAIT;
	
	public board = [];
	public first: string;
	public turn: string;
	
	protected roomEvents( tttClient: TictactoeClient ): tictactoeInfo.events.server.local {
		const client = tttClient.client;
		
		this.events.on( roomInfo.leave, () => {
			if ( this.state !== tictactoeState.PLAY ) return;
			
			this.state = tictactoeState.WAIT;
			this.clients.iterate( ( client: tictactoeClient ) =>
				client.ready = false );
			this.roomEmit( tictactoeInfo.over, { winner: 0 } );
		} );
		
		return {
			...super.roomEvents( tttClient ),
			[ tictactoeInfo.start ]: ( roomId, args, returnId ) => {
				if ( this.id !== roomId ) return;
				if ( this.state !== tictactoeState.WAIT ) return;
				if ( tttClient.ready ) return;
				if ( this.clients.count !== 2 ) return;
				
				tttClient.ready = true;
				this.socketEmit( client, returnId );
				if ( !this.clients.iterate( ( client: TictactoeClient ) => {
					if ( !client.ready ) return true;
				} ) ) return;
				
				this.reset();
			},
			[ tictactoeInfo.play ]:  ( roomId, { x, y } ) => {
				if ( this.id !== roomId ) return;
				if ( this.state !== tictactoeState.PLAY ) return;
				
				if ( this.play( client.id, x, y ) ) {
					this.state = tictactoeState.WAIT;
					this.clients.iterate( ( client: tictactoeClient ) =>
						client.ready = false );
					this.roomEmit( tictactoeInfo.over, { winner: this.tie ? 0 : client.id } );
				}
			}
		};
	}
	
	public reset() {
		for ( let y = 0; y < 3; ++y )
			this.board[ y ] = [ 0, 0, 0 ];
		
		this.first = this.turn = this.clients.random;
		
		this.state = tictactoeState.PLAY;
		if ( config.debug ) console.log( `${this.first} playing` );
		this.roomEmit( tictactoeInfo.start, { first: this.first } );
	}
	
	public play( player: string, x: number, y: number ) {
		if ( this.board[ y ][ x ] && this.turn !== player ) return false;
		
		this.board[ y ][ x ] = player;
		this.turn = this.clients.getFirst( value => value.client.id !== player ).client.id;
		
		this.roomEmit( tictactoeInfo.play, { player, x, y } );
		if ( config.debug ) console.log( `${this.turn} playing` );
		return this.check( player, x, y );
	}
	
	private check( player: string, x: number, y: number ) {
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
		
		return this.tie || row === 3 || col === 3 || diag1 === 3 || diag2 === 3;
	}
	
	private get tie() {
		for ( let y = 0; y < 3; ++y )
			for ( let x = 0; x < 3; ++x )
				if ( !this.board[ y ][ x ] ) return false;
		return true;
	}
	
}
