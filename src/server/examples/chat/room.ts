import { Room } from 'colyseus';


export default class ChatRoom extends Room {
	
	onInit( options ) {
		console.log( `ChatRoom ${this.roomId} created!`, options );
	}
	
	onJoin( client ) {
		this.broadcast( `${client.sessionId} joined ${this.roomId}.` );
	}
	
	onLeave( client ) {
		this.broadcast( `${client.sessionId} left ${this.roomId}.` );
	}
	
	onMessage( client, data ) {
		console.log( `ChatRoom ${this.roomId} received message from`, client.sessionId, ':', data );
		this.broadcast( `(${client.sessionId}) ${data.message}` );
	}
	
	onDispose() {
		console.log( `Dispose ChatRoom ${this.roomId}` );
	}
	
}
