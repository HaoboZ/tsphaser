import Room from './room';

const Socket = new class {
	
	game: Phaser.Game;
	
	public socket: SocketIOClient.Socket;
	
	init( game: Phaser.Game ) {
		this.game = game;
		
		this.socket = io.connect();
		
		this.socket.on( 'connect', () => this.game.events.emit( 'connect' ) );
		this.socket.on( 'disconnect', () => this.game.events.emit( 'disconnect' ) );
		this.socket.on( 'err', ( err ) => console.log( err ) );
		Room.init();
	}
	
};
export default Socket;