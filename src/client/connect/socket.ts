import { socketEvents } from '../../shared/events';
import config from '../config';
import { ChatEvents } from '../examples/chat/chatRoom';
import { RoomEvents } from './room';

export function SocketEvents() {
	Socket.socket.on( socketEvents.connect, () => {
		Socket.events.emit( 'connect' );
		if ( config.debug ) console.log( 'connected' );
	} );
	Socket.socket.on( socketEvents.disconnect, () => {
		Socket.events.emit( 'disconnect' );
		if ( config.debug ) console.log( 'disconnected' );
	} );
	Socket.socket.on( socketEvents.error, ( err ) => {
		if ( config.debug ) console.log( err );
	} );
}

let Socket = new class {
	
	public events = new Phaser.Events.EventEmitter();
	
	public socket: SocketIOClient.Socket;
	
	public init() {
		this.socket = io.connect();
		
		ChatEvents();
		RoomEvents();
		SocketEvents();
	}
	
};
export default Socket;
