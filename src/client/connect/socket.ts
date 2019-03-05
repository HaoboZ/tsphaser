import { clientInfo } from '../../shared/events';
import config from '../config';
import { RoomEvents } from './room';

function SocketEvents() {
	return {
		[ clientInfo.connect ]:    () => {
			Socket.id = Socket.socket.id;
			
			Socket.events.emit( 'connect' );
			if ( config.debug ) console.log( 'connected' );
		},
		[ clientInfo.disconnect ]: () => {
			Socket.events.emit( 'disconnect' );
			if ( config.debug ) console.log( 'disconnected' );
		},
		[ clientInfo.error ]:      ( err ) => {
			Socket.events.emit( clientInfo.error, err );
			if ( config.debug ) console.log( err );
		}
	};
}

const Socket = new class {
	
	/**
	 * Reference to SocketIO socket.
	 */
	public socket: SocketIOClient.Socket;
	
	/**
	 * Reference to socket.id.
	 */
	public id: string;
	
	/**
	 * Global events will be emitted from here.
	 */
	public events = new Phaser.Events.EventEmitter();
	
	/**
	 * Called by main code to initialize sockets and create events.
	 */
	public init() {
		this.socket = io.connect();
		
		this.multiOn( SocketEvents );
		this.multiOn( RoomEvents );
	}
	
	/**
	 * An emit that will have a callback function if the corresponding server-side listener returns a value.
	 *
	 * @param event - Event Id
	 * @param args - Arguments to pass
	 * @param fn - Callback function
	 */
	public emit( event: string, args?: any, fn?: Function ) {
		let id: string;
		if ( fn ) {
			id = Math.random().toString( 36 ).substring( 2, 12 );
			Socket.socket.once( id, fn );
		}
		
		this.socket.emit( event, args, id );
	}
	
	public multiOn( events: () => { [ name: string ]: ( ...any ) => void } ) {
		const _events = events();
		for ( const name in _events )
			this.socket.on( name, _events[ name ] );
	}
	
};
export default Socket;
