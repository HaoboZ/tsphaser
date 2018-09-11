import Socket, { ERROR, error } from '../connect/socket';
import Room from '../connect/room';
import Client from '../connect/client';

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
	
	private static message( id, ...args ) {
		let socket = this as any as SocketIO.Socket,
			 room   = Room.list[ id ] as ChatRoom;
		if ( !room ) return error( socket, ERROR.RoomExist );
		
		room.log.push( args );
		
		Socket.io.to( room.id ).emit( id, ...args );
	}
	
	constructor( name: string, password?: string, remove?: boolean, admin?: string ) {
		super( name, password, remove, admin );
		
		this.data.type = 'chat';
	}
	
}
