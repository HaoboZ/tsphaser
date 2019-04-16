import { Room } from 'colyseus.js';
import Server from '../../connect/server';
import { sendMessage } from '../../redux/chatReducer';
import store from '../../redux/store';

export default class Chat extends Phaser.Scene {
	
	room: Room;
	
	constructor() {
		super( 'Chat' );
	}
	
	public create() {
		this.room = Server.client.join( 'chat' );
		this.room.onJoin.add( () => {
			console.log( 'joined' );
		} );
		// listen to patches coming from the server
		this.room.onMessage.add( message => {
			store.dispatch( sendMessage( message ) );
		} );
		this.room.onError.add( err => {
			console.log( 'Error:', err );
		} );
	}
	
}
