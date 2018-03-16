export default class Socket {
	
	public static game: Phaser.Game;
	
	public static socket: SocketIOClient.Socket;
	
	constructor(game: Phaser.Game) {
		Socket.game = game;
		// Socket.socket = io.connect();
	}
	
}
