import * as SocketIO from 'socket.io';
import Socket from './connect/socket';

export default class Client {
	
	socket: SocketIO.Socket;
	
	static clients = {};
	
	constructor( socket: SocketIO.Socket ) {
		this.socket = socket;
		console.log( `${this.socket.id} connected` );
		
		socket.on( 'start', this.start );
		socket.on( 'playerMovement', this.playerMovement );
		socket.on( 'disconnect', this.disconnect );
	}
	
	start = () => {
		Client.clients[ this.socket.id ] = {
			rotation: 0,
			x:        Math.floor( Math.random() * 700 ) + 50,
			y:        Math.floor( Math.random() * 500 ) + 50,
			playerId: this.socket.id,
			team:     ( Math.floor( Math.random() * 2 ) == 0 ) ? 'red' : 'blue'
		};
		
		// send the players object to the new player
		this.socket.emit( 'currentPlayers', Client.clients );
		// update all other players of the new player
		this.socket.broadcast.emit( 'newPlayer', Client.clients[ this.socket.id ] );
	};
	
	playerMovement = ( movementData ) => {
		Client.clients[ this.socket.id ].x = movementData.x;
		Client.clients[ this.socket.id ].y = movementData.y;
		Client.clients[ this.socket.id ].rotation = movementData.rotation;
		// emit a message to all players about the player that moved
		this.socket.broadcast.emit( 'playerMoved', Client.clients[ this.socket.id ] );
	};
	
	disconnect = () => {
		console.log( `${this.socket.id} disconnected` );
		// remove this player from our players object
		delete Client.clients[ this.socket.id ];
		// emit a message to all players to remove this player
		Socket.io.emit( 'disconnect', this.socket.id );
	};
	
}