import Room from '../connect/room';
import Socket from '../connect/socket';

export default class ChatRoom extends Room {
	
	public static init() {
		this.types[ 'chat' ] = ChatRoom;
		Socket.socket.on( 'message', this.message );
		
	}
	
	private static message( id, ...args ) {
		let room = Room.list[ id ] as ChatRoom;
		room.log.push( args );
	}
	
	private log = [];
	
	public send( ...args ) {
		this.emit( 'message', ...args );
	}
	
}
