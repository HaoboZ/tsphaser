import { Client, Room } from 'colyseus';

import { moveConfig } from './moveConfig';
import MoveRoomState from './moveRoomState';


export default class Movement extends Room<MoveRoomState> {
	
	onCreate( options ) {
		console.log( `MoveRoom ${this.roomId} created!`, options );
		this.setState( new MoveRoomState() );
		this.setPatchRate( 1000 / moveConfig.FPS );
	}
	
	onJoin( client: Client ) {
		console.log( client.sessionId, 'joined', this.roomId );
		this.state.addPlayer( client.sessionId );
	}
	
	onLeave( client: Client ) {
		console.log( client.sessionId, 'left', this.roomId );
		this.state.removePlayer( client.sessionId );
	}
	
	onMessage( client: Client, data ) {
		this.state.movePlayer( client.sessionId, data );
	}
	
	onDispose() {
		console.log( 'Dispose MoveRoom', this.roomId );
	}
	
}
