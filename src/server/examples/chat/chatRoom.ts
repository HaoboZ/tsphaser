import { Room } from 'colyseus';

export default class ChatRoom extends Room {
	
	onInit( options ) {
		console.log( 'BasicRoom created!', options );
	}
	
	onJoin( client ) {
		this.broadcast( `${client.sessionId} joined.` );
	}
	
	onLeave( client ) {
		this.broadcast( `${client.sessionId} left.` );
	}
	
	onMessage( client, data ) {
		console.log( 'ChatRoom received message from', client.sessionId, ':', data );
		this.broadcast( `(${client.sessionId}) ${data.message}` );
	}
	
	onDispose() {
		console.log( 'Dispose BasicRoom' );
	}
	
	
}
