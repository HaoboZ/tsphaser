import Room from '../connect/room';
import Socket from '../connect/socket';

export default class ChatRoom extends Room {
	
	private log = [];
	
	public static init() {
		this.types[ 'chat' ] = ChatRoom;
		Socket.socket.on( 'chatMessage', this.message );
	}
	
	private static message( id, ...args ) {
		let room = Room.list[ id ] as ChatRoom;
		room.log.push( args );
	}
	
	public send( ...args ) {
		Socket.socket.emit( 'chatMessage', ...args );
	}
	
}
