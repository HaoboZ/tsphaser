const Socket = new class {
	
	private game: Phaser.Game;
	
	public socket: SocketIOClient.Socket;
	
	init( game: Phaser.Game ) {
		this.game = game;
		
		this.socket = io.connect();
		this.socket.on( 'connect', () => this.game.events.emit( 'connect' ) );
		this.socket.on( 'disconnect', () => this.game.events.emit( 'disconnect' ) );
		this.socket.on( 'currentPlayers', ( players ) => {
			Object.keys( players ).forEach( ( id ) => {
				if ( players[ id ].playerId === Socket.socket.id ) {
					this.addPlayer( this, players[ id ] );
				} else {
					this.addOtherPlayers( this, players[ id ] );
				}
			} );
		} );
		this.socket.on( 'newPlayer', ( playerInfo ) => {
			this.addOtherPlayers( this, playerInfo );
		} );
		this.socket.on( 'playerMoved', ( playerInfo ) => {
			this.otherPlayers.getChildren().forEach( ( otherPlayer ) => {
				if ( playerInfo.playerId === otherPlayer.playerId ) {
					otherPlayer.setPosition( playerInfo.x, playerInfo.y );
				}
			} );
		} );
		this.socket.on( 'disconnect', ( playerId ) => {
			this.otherPlayers.getChildren().forEach( ( otherPlayer ) => {
				if ( playerId === otherPlayer.playerId ) {
					otherPlayer.destroy();
				}
			} );
		} );
		this.socket.emit( 'start' );
	}
	
};
export default Socket;