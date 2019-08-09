import { MapSchema, Schema, type } from '@colyseus/schema';

import { colors } from '../constants';


class Player extends Schema {
	
	@type( 'string' )
	color = colors[ Math.floor( Math.random() * colors.length ) ];
	
	@type( 'number' )
	x = Math.floor( Math.random() * 2000 );
	
	@type( 'number' )
	y = Math.floor( Math.random() * 2000 );
	
}

export default class MoveRoomState extends Schema {
	
	@type( { map: Player } )
	players = new MapSchema<Player>();
	
	addPlayer( id: string ) {
		this.players[ id ] = new Player();
	}
	
	removePlayer( id: string ) {
		delete this.players[ id ];
	}
	
	movePlayer( id: string, movement: any ) {
		if ( movement.x )
			this.players[ id ].x = movement.x;
		if ( movement.y )
			this.players[ id ].y = movement.y;
	}
	
}
