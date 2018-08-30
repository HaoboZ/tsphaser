import Client from './client';

export default class Room {
	
	public static list: { [ id: string ]: Room } = {};
	
	public id: string;
	public name: string;
	private password: string;
	
	
	public clients: {};
	
	private clientData: {};
	
	constructor( name: string, password: string ) {
		this.id = ( function ( a, b ) {
			// noinspection StatementWithEmptyBodyJS
			for ( b = a = ''; a++ < 36; b += a * 51 & 52 ? ( a ^ 15 ? 8 ^ Math.random() * ( a ^ 20 ? 16 : 4 ) : 4 ).toString( 16 ) : '-' ) ;
			return b
		} )();
		this.name = name;
		this.password = password;
	}
	
	public canJoin( password: string ) {
		return !this.password || this.password === password;
	}
	
	public join( client: Client ) {
		this.clients[ client.socket.id ] = client;
		this.clientData[ client.socket.id ] = client.data;
		
		// confirm joined room
		client.socket.emit( 'join', this.id, this.clientData );
		// tell other clients
		client.socket.broadcast.emit( 'enter', this.id, client.data );
	}
	
	
}
