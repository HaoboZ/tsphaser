import Server from '../../connect/server';
import store from '../../redux/store';
import { setUI } from '../../UI/reducer';
import { sendMessage, setRoom } from './actions';
import ChatUI from './UI';


export default class ChatScene extends Phaser.Scene {
	
	constructor() {
		super( 'Chat' );
	}
	
	public create() {
		const room = Server.client.join( 'chat' );
		room.onMessage.add( ( message ) => {
			store.dispatch( sendMessage( message ) );
		} );
		
		store.dispatch( setRoom( room ) );
		store.dispatch( setUI( ChatUI ) );
	}
	
}
