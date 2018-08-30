const Socket = new class {
	
	private game: Phaser.Game;
	
	public socket: SocketIOClient.Socket;
	
	init( game: Phaser.Game ) {
		this.game = game;
		
		this.socket = io.connect();
		this.socket.on( 'connect', () => this.game.events.emit( 'connect' ) );
		this.socket.on( 'disconnect', () => this.game.events.emit( 'disconnect' ) );
		this.socket.on( 'join', ( room, players ) => {
			// create a room object
			// add players to room
			// emit event
		} );
		this.socket.on( 'leave', ( room ) => {
			// remove self from room
			// delete room
			// emit event
		} );
		this.socket.on( 'enter', ( player, room ) => {
			// add player to room
			// emit event
		} );
		this.socket.on( 'exit', ( player, room ) => {
			// remove player from room
			// if no room, remove from all rooms
		} );
		this.socket.on( 'sync', ( room, data ) => {
			// sync room and player info
		} );
		
		this.socket.emit( 'start' );
	}
	
};
export default Socket;