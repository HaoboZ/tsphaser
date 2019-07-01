import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';

import { names } from '../constants';


export enum playResult {
	NONE,
	WIN,
	TIE,
	ERROR
}

export enum roomStatus {
	LOBBY,
	GAME
}

export class Player extends Schema {
	
	public id: string;
	
	constructor( id: string ) {
		super();
		this.id = id;
	}
	
	@type( 'string' )
	public name = names[ Math.floor( Math.random() * names.length ) ];
	
	@type( 'boolean' )
	public ready = false;
	
	@type( 'boolean' )
	public turn = false;
	
}


export default class TictactoeRoomState extends Schema {
	
	@type( { map: Player } )
	players = new MapSchema<Player>();
	
	status = roomStatus.LOBBY;
	
	// 0 for empty, 1 for cross, 2 for circle
	@type( [ 'number' ] )
	board = new ArraySchema<number>();
	
	@type( 'string' )
	cross: string;
	@type( 'string' )
	circle: string;
	
	// true for cross, false for circle
	@type( 'boolean' )
	turn = false;
	
	public addPlayer( id: string ): void {
		this.players[ id ] = new Player( id );
		
		if ( this.cross === undefined )
			this.cross = id;
		else
			this.circle = id;
	}
	
	public removePlayer( id: string ): void {
		delete this.players[ id ];
		
		if ( this.status === roomStatus.GAME )
			this.status = roomStatus.LOBBY;
		
		if ( this.cross === id )
			this.cross = undefined;
		if ( this.circle === id )
			this.circle = undefined;
	}
	
	public toggleReady( id: string ): boolean {
		if ( this.status !== roomStatus.LOBBY ) return undefined;
		
		const target = id === this.cross ? this.players[ this.cross ] : this.players[ this.circle ];
		target.ready = !target.ready;
		
		if ( !this.cross || !this.circle || !this.players[ this.cross ].ready || !this.players[ this.circle ].ready ) return false;
		
		this.status = roomStatus.GAME;
		for ( let i = 0; i < 9; ++i )
			this.board[ i ] = 0;
		
		if ( Math.random() >= 0.5 )
			[ this.cross, this.circle ] = [ this.circle, this.cross ];
		this.turn = true;
		this.players[ this.cross ].turn = true;
		this.players[ this.circle ].turn = false;
		
		return true;
	}
	
	public playLocation( id: string, index: number ): playResult {
		if ( this.status !== roomStatus.GAME ) return playResult.ERROR;
		
		let player: boolean;
		switch ( id ) {
		case this.cross:
			player = true;
			break;
		case this.circle:
			player = false;
			break;
		default:
			return playResult.ERROR;
		}
		
		if ( player !== this.turn )
			return playResult.ERROR;
		
		if ( this.board[ index ] !== 0 )
			return playResult.ERROR;
		
		this.board[ index ] = player ? 1 : 2;
		this.turn = !this.turn;
		this.players[ this.cross ].turn = this.turn;
		this.players[ this.circle ].turn = !this.turn;
		
		const res = this.check( player ? 1 : 2, index % 3, Math.floor( index / 3 ) );
		if ( res === playResult.WIN || res === playResult.TIE ) {
			this.players[ this.cross ].ready = false;
			this.players[ this.cross ].turn = false;
			this.players[ this.circle ].ready = false;
			this.players[ this.circle ].turn = false;
			this.status = roomStatus.LOBBY;
		}
		return res;
	}
	
	boardPos( x, y ) {
		return y * 3 + x;
	}
	
	private check( player: number, x: number, y: number ): playResult {
		let row = 0, col = 0, diag1 = 0, diag2 = 0;
		for ( let z = 0; z < 3; ++z ) {
			if ( this.board[ this.boardPos( z, y ) ] === player )
				++row;
			if ( this.board[ this.boardPos( x, z ) ] === player )
				++col;
			if ( x === y && this.board[ this.boardPos( z, z ) ] === player )
				++diag1;
			if ( x + y === 2 && this.board[ this.boardPos( 2 - z, z ) ] === player )
				++diag2;
		}
		
		if ( row === 3 || col === 3 || diag1 === 3 || diag2 === 3 ) return playResult.WIN;
		if ( this.tie ) return playResult.TIE;
		return null;
	}
	
	private get tie(): boolean {
		for ( let i = 0; i < 9; ++i )
			if ( !this.board[ i ] ) return false;
		return true;
	}
	
}
