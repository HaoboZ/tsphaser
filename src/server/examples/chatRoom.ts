import Room from '../connect/room';
import Client from '../connect/client';
import Socket, { ERROR, error } from '../connect/socket';

export default class ChatRoom extends Room {
	
	protected log = [];
	
	public static init( client: Client ) {
		client.socket.on( 'createChatRoom', this.create );
		client.socket.on( 'chatMessage', this.message );
	}
	
	private static create( name: string, password?: string ) {
		let socket = this as any as SocketIO.Socket;
		
		let room = new ChatRoom( name, password, true, socket.id );
		room.join( socket.id, room.password );
	}
	
	private static message( id, type, message ) {
		let socket = this as any as SocketIO.Socket,
			 room   = Room.list[ id ] as ChatRoom;
		if ( !room ) {
			error( socket, ERROR.RoomExist );
			return;
		}
		
		room.log.push( { type, message } );
		
		Socket.io.to( room.id ).emit( id, type, message );
	}
	
}
