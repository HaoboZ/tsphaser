import * as SocketIO from 'socket.io';
import Socket from './connect/socket';

import config from './config';

export default class Client {
	
	private static list = {};
	
	public socket: SocketIO.Socket;
	
	public data: any;
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		if ( config.debug ) console.log( `${this.socket.id} connected` );
		
		// initial data
		Client.list[ this.socket.id ] = this.data = {
			x: Math.floor( Math.random() * 700 ) + 50,
			y: Math.floor( Math.random() * 500 ) + 50,
		};
		
		socket.on( 'playerMovement', this.playerMovement );
		socket.on( 'disconnect', this.stop );
		socket.on( 'stop', this.stop );
		socket.on( 'start', this.start );
	}
	
	start = () => {
		// send the players object to the new player
		this.socket.emit( 'currentPlayers', Client.list );
		// update all other players of the new player
		this.socket.broadcast.emit( 'newPlayer', Client.list[ this.socket.id ] );
	};
	
	playerMovement = ( data ) => {
		Client.list[ this.socket.id ].x = data.x;
		Client.list[ this.socket.id ].y = data.y;
		// emit a message to all players about the player that moved
		this.socket.broadcast.emit( 'playerMoved', Client.list[ this.socket.id ] );
	};
	
	stop = () => {
		if ( config.debug ) console.log( `${this.socket.id} disconnected` );
		// remove this player from our clients list
		delete Client.list[ this.socket.id ];
		// emit a message to all clients to remove this player
		Socket.io.emit( 'stop', this.socket.id );
	};
	
}
