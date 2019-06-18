import Server from '../../connect/server';
import store from '../../redux/store';
import { setUI } from '../../redux/UIReducer';
import { sendMessage, setRoom } from './chatActions';
import ChatUI from './chatUI';


export default class Chat extends Phaser.Scene {
	
	constructor() {
		super( 'Chat' );
	}
	
	public create() {
		const room = Server.client.join( 'chat' );
		store.dispatch( setRoom( room ) );
		room.onMessage.add( message => {
			store.dispatch( sendMessage( message ) );
		} );
		room.onError.add( err => {
			console.log( 'Error:', err );
		} );
		
		store.dispatch( setUI( ChatUI as any ) );
	}
	
}
