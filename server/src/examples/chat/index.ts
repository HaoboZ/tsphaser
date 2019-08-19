import { Room } from 'colyseus';


export default class Chat extends Room {
	
	onInit( options ) {
		console.log( `ChatRoom ${this.roomId} created!`, options );
	}
	
	onJoin( client ) {
		this.broadcast( `${client.sessionId} joined.` );
	}
	
	onLeave( client ) {
		this.broadcast( `${client.sessionId} left.` );
	}
	
	onMessage( client, data ) {
		console.log( `ChatRoom ${this.roomId} received message from`, client.sessionId, ':', data );
		this.broadcast( `(${client.sessionId}) ${data.message}` );
	}
	
	onDispose() {
		console.log( `Dispose ChatRoom ${this.roomId}` );
	}
	
}
