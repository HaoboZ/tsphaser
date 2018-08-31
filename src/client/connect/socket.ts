import Room from './room';

import config from '../config';

const Socket = new class {
	
	private game: Phaser.Game;
	
	public socket: SocketIOClient.Socket;
	
	init( game: Phaser.Game ) {
		this.game = game;
		
		this.socket = io.connect();
		this.socket.on( 'connect', () => this.game.events.emit( 'connect' ) );
		this.socket.on( 'disconnect', () => this.game.events.emit( 'disconnect' ) );
		
		this.socket.on( 'join', ( data, clients ) => {
			let room = new Room( this.game, data, clients );
			
			this.game.events.emit( 'join', room.id );
			if ( config.debug ) console.log( `joined room ${room.data.name}` );
		} );
	}
	
	public join( id: string, password?: string ) {
		this.socket.emit( 'join', id, password );
	}
	
};
export default Socket;