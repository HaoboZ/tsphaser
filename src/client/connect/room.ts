import Socket from './socket';

import config from '../config';

export default class Room {
	
	public static init() {
		Socket.socket.on( 'roomJoin', this.events.join );
		Socket.socket.on( 'roomLeave', this.events.leave );
		Socket.socket.on( 'clientEnter', this.events.enter );
		Socket.socket.on( 'clientExit', this.events.exit );
	}
	
	private static events = {
		/**
		 * @event roomJoin
		 *
		 * @param id
		 * @param data
		 * @param clients
		 */
		join( id: string, data: any, clients: any ) {
			let room = Room.list[ id ];
			if ( !room ) room = Room.list[ id ] = new Room.types[ data.type ]( Socket.game, id, data, clients );
			
			room.game.events.emit( 'join', room );
			if ( config.debug ) console.log( `joined room ${room.data.name}` );
		},
		/**
		 * @event roomLeave
		 *
		 * @param id
		 */
		leave( id: string ) {
			let room = Room.list[ id ];
			if ( !room ) return;
			
			delete Room.list[ room.id ];
			
			room.game.events.emit( 'leave', room.id );
			if ( config.debug ) console.log( `left room ${room.data.name}` );
		},
		/**
		 * @event clientEnter
		 *
		 * @param id
		 * @param client
		 * @param data
		 */
		enter( id: string, client: string, data: any ) {
			let room = Room.list[ id ];
			if ( !room ) return;
			
			room.clients[ client ] = data;
			
			room.game.events.emit( 'enter', room.id, client );
			if ( config.debug ) console.log( `${client} joined room ${room.data.name}` );
		},
		/**
		 * @event clientExit
		 *
		 * @param id
		 * @param client
		 */
		exit( id: string, client: string ) {
			let room = Room.list[ id ];
			if ( !room || !room.clientInRoom( client ) ) return;
			
			delete room.clients[ client ];
			
			room.game.events.emit( 'exit', room.id, client );
			if ( config.debug ) console.log( `${client} left room ${room.data.name}` );
		}
	};
	
	game: Phaser.Game;
	
	protected static types: { [ name: string ]: any } = {};
	
	protected static list: { [ id: string ]: Room } = {};
	
	public id: string;
	public data: any;
	public clients: any;
	
	public static join( id: string ) {
		Socket.socket.emit( 'joinRoom', id );
	}
	
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
	
	public emit( event: string, ...args ) {
		Socket.socket.emit( event, this.id, ...args )
	}
	
}
