import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import { names } from '../../../shared/constants';
import { state } from '../../../shared/tictactoe';


class Player extends Schema {
	
	@type( 'string' )
	public name = names[ Math.floor( Math.random() * names.length ) ];
	
	public ready = false;
	
}


export default class TictactoeState extends Schema {
	
	@type( { map: Player } )
	players = new MapSchema<Player>();
	
	@type( [ 'number' ] )
	board = new ArraySchema<number>();
	
	@type( 'string' )
	cross: string;
	@type( 'string' )
	circle: string;
	
	@type( 'number' )
	turn: number;
	
	public createPlayer( id: string ) {
		this.players[ id ] = new Player();
		if ( this.circle === undefined )
			this.circle = id;
		else
			this.cross = id;
	}
	
	public removePlayer( id: string ) {
		delete this.players[ id ];
		if ( this.cross === id )
			this.cross = undefined;
		
		if ( this.circle === id ) {
			this.circle = this.cross;
			this.cross = undefined;
		}
	}
	
	public get allReady() {
		for ( const player in this.players ) {
			if ( this.players[ player ].ready === false )
				return false;
		}
		return true;
	}
	
	public reset() {
		for ( let i = 0; i < 9; ++i )
			this.board[ i ] = 0;
		
		[ this.cross, this.circle ] = [ this.circle, this.cross ];
		this.turn = 1;
	}
	
	public playLocation( id: string, x: number, y: number ): state {
		let player;
		switch ( id ) {
		case this.cross:
			player = 1;
			break;
		case this.circle:
			player = -1;
			break;
		default:
			return state.ERROR;
		}
		
		const pos = y * 3 + x;
		
		if ( player !== this.turn )
			return state.ERROR;
		if ( this.board[ pos ] !== 0 )
			return state.ERROR;
		
		this.board[ pos ] = player;
		return this.check( player, x, y );
	}
	
	private check( player: number, x: number, y: number ): state {
		let row = 0, col = 0, diag1 = 0, diag2 = 0;
		for ( let z = 0; z < 3; ++z ) {
			if ( this.board[ y * 3 + z ] === player )
				++row;
			if ( this.board[ z * 3 + x ] === player )
				++col;
			if ( x === y && this.board[ z * 3 + z ] === player )
				++diag1;
			if ( x + y === 2 && this.board[ z * 3 + 2 - z ] === player )
				++diag2;
		}
		
		if ( row === 3 || col === 3 || diag1 === 3 || diag2 === 3 ) return state.WIN;
		if ( this.tie ) return state.TIE;
		return state.NONE;
	}
	
	private get tie() {
		for ( let i = 0; i < 9; ++i )
			if ( !this.board[ i ] ) return false;
		return true;
	}
	
}
