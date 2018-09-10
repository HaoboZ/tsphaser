import Socket from './socket';

import config from '../config';

export default class Room {
	
	game: Phaser.Game;
	
	private static list: { [ id: string ]: Room } = {};
	
	public id: string;
	public data: any;
	public clients: Array<any>;
	
	public static init() {
		Socket.socket.on( 'roomJoin', this.join );
		Socket.socket.on( 'roomLeave', this.leave );
		Socket.socket.on( 'clientEnter', this.enter );
		Socket.socket.on( 'clientExit', this.exit );
	}
	
	private static join( id, clients ) {
		let room = Room.list[ id ];
		if ( !room ) {
			room = Room.list[ id ] = new Room( Socket.game, id, clients );
		}
		room.game.events.emit( 'join', room.id );
		if ( config.debug ) console.log( `joined room ${room.data.name}` )
	}
	
	private static leave( id ) {
		let room = Room.list[ id ];
		if ( !room ) return;
		
		delete Room.list[ room.id ];
		
		room.game.events.emit( 'leave', room.id );
		if ( config.debug ) console.log( `left room ${room.data.name}` )
	}
	
	private static enter( id, client ) {
		let room = Room.list[ id ];
		if ( !room ) return;
		
		room.clients[ client.id ] = client;
		
		room.game.events.emit( 'enter', room.id, client.id );
		if ( config.debug ) console.log( `${client.id} joined room ${room.data.name}` );
	};
	
	private static exit( id, client ) {
		let room = Room.list[ id ];
		if ( !room || !room.clients.hasOwnProperty( client.id ) ) return;
		
		delete room.clients[ client.id ];
		
		room.game.events.emit( 'exit', room.id, client.id );
		if ( config.debug ) console.log( `${client.id} left room ${room.data.name}` );
	};
	
	constructor( game: Phaser.Game, id, clients ) {
		this.game = game;
		
		this.id = id;
		this.data = {};
		this.clients = clients;
		
		Room.list[ this.id ] = this;
	}
	
}
