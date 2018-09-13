import Room from './room';
import ChatRoom from '../examples/chatRoom';

const Socket = new class {
	
	game: Phaser.Game;
	
	public socket: SocketIOClient.Socket;
	
	public init( game: Phaser.Game ) {
		this.game = game;
		
		this.socket = io.connect();
		
		this.socket.on( 'connect', this.events.connect );
		this.socket.on( 'disconnect', this.events.disconnect );
		this.socket.on( 'err', this.events.error );
		Room.init();
		ChatRoom.init();
	}
	
	private events = {
		connect() {
			this.game.events.emit( 'connect' );
		},
		disconnect() {
			this.game.events.emit( 'disconnect' );
		},
		error( err ) {
			console.log( err );
		}
	};
	
};
export default Socket;