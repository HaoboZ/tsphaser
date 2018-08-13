import * as SocketIO from 'socket.io';
import Socket from './connect/socket';

import config from './config';

export default class Client {
	
	socket: SocketIO.Socket;
	
	static clients = {};
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		if ( config.debug )
			console.log( `${this.socket.id} connected` );
		
		socket.on( 'disconnect', this.disconnect );
	}
	
	disconnect = () => {
		if ( config.debug )
			console.log( `${this.socket.id} disconnected` );
		// remove this player from our players object
		delete Client.clients[ this.socket.id ];
		// emit a message to all players to remove this player
		Socket.io.emit( 'disconnect', this.socket.id );
	};
	
}
