import Room from '../connect/room';
import Client from '../connect/client';

export default class Game extends Room {
	
	public static init( client: Client ) {
		client.socket.on( 'createGame', this.createGame );
	}
	
	private static createGame( name: string, password?: string ) {
		let socket = this as any as SocketIO.Socket;
		// TODO: verify client can create one and whether to set admin
		new Game( name, password, true, socket.id );
	}
	
}
