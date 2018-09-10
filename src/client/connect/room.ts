import Socket from './socket';

import config from '../config';

export default class Room {
	
	game: Phaser.Game;
	
	private static list: { [ id: string ]: Room } = {};
	
	public id: string;
	public data: any;
	public clients: any;
	
	public static init() {
		Socket.socket.on( 'roomJoin', this.join );
		Socket.socket.on( 'roomLeave', this.leave );
		Socket.socket.on( 'clientEnter', this.enter );
		Socket.socket.on( 'clientExit', this.exit );
	}
	
	/**
	 * @event roomJoin
	 *
	 * @param id
	 * @param data
	 * @param clients
	 */
	private static join( id: string, data: any, clients: any ) {
		let room = Room.list[ id ];
		if ( !room ) room = Room.list[ id ] = new Room( Socket.game, id, data, clients );
		
		room.game.events.emit( 'join', room.id );
		if ( config.debug ) console.log( `joined room ${room.data.name}` );
	}
	
	/**
	 * @event roomLeave
	 *
	 * @param id
	 */
	private static leave( id: string ) {
		let room = Room.list[ id ];
		if ( !room ) return;
		
		delete Room.list[ room.id ];
		
		room.game.events.emit( 'leave', room.id );
		if ( config.debug ) console.log( `left room ${room.data.name}` );
	}
	
	/**
	 * @event clientEnter
	 *
	 * @param id
	 * @param client
	 * @param data
	 */
	private static enter( id: string, client: string, data: any ) {
		let room = Room.list[ id ];
		if ( !room ) return;
		
		room.clients[ client ] = data;
		
		room.game.events.emit( 'enter', room.id, client );
		if ( config.debug ) console.log( `${client} joined room ${room.data.name}` );
	};
	
	/**
	 * @event clientExit
	 *
	 * @param id
	 * @param client
	 */
	private static exit( id: string, client: string ) {
		let room = Room.list[ id ];
		if ( !room || !room.clientInRoom( client ) ) return;
		
		delete room.clients[ client ];
		
		room.game.events.emit( 'exit', room.id, client );
		if ( config.debug ) console.log( `${client} left room ${room.data.name}` );
	};
	
	constructor( game: Phaser.Game, id: string, data: any, clients: any ) {
		this.game = game;
		
		this.id = id;
		this.data = data;
		this.clients = clients;
		
		Room.list[ this.id ] = this;
	}
	
	clientInRoom( id: string ) {
		return this.clients.hasOwnProperty( id );
	}
	
}
