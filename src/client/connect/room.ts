import Socket from './socket';
import config from '../config';

export default class Room {
	
	private game: Phaser.Game;
	
	private static list: { [ id: string ]: Room } = {};
	
	public id: string;
	public data;
	public clients: { [ id: string ]: any };
	
	constructor( game: Phaser.Game, data, clients ) {
		this.game = game;
		
		this.id = data.id;
		this.data = data;
		this.clients = clients;
		
		if ( Room.list[ this.id ] ) Room.list[ this.id ].leave( this.id );
		
		Room.list[ this.id ] = this;
		
		Socket.socket.on( 'leave', this.leave );
		Socket.socket.on( 'enter', this.enter );
		Socket.socket.on( 'exit', this.exit );
	}
	
	private leave = ( id ) => {
		if ( this.id !== id ) return;
		
		delete Room.list[ this.id ];
		Socket.socket.removeListener( 'leave', this.leave );
		Socket.socket.removeListener( 'enter', this.enter );
		Socket.socket.removeListener( 'exit', this.exit );
		
		this.game.events.emit( 'leave', this.id );
		if ( config.debug ) console.log( `left room ${this.data.name}` )
	};
	
	private enter = ( id, client ) => {
		if ( this.id !== id ) return;
		
		this.clients[ client.id ] = client;
		
		this.game.events.emit( 'enter', this.id, client.id );
		if ( config.debug ) console.log( `${client.id} joined room ${this.data.name}` );
	};
	
	private exit = ( id, client ) => {
		if ( this.id !== id && this.clients.hasOwnProperty( client.id ) ) return;
		
		delete this.clients[ client.id ];
		
		this.game.events.emit( 'exit', this.id, client.id );
		if ( config.debug ) console.log( `${client.id} left room ${this.data.name}` );
	};
	
}
