import { Client, Room } from 'colyseus';

import { movementConfig } from '../../../shared/config';
import MoveRoomState from '../../../shared/examples/moveRoomState';


export default class MoveRoom extends Room<MoveRoomState> {
	
	onInit( options ) {
		console.log( 'MoveRoom created!', options );
		this.setState( new MoveRoomState() );
		this.setPatchRate( 1000 / movementConfig.FPS );
	}
	
	onJoin( client: Client ) {
		console.log( client.sessionId, 'Joined' );
		this.state.addPlayer( client.sessionId );
	}
	
	onLeave( client: Client ) {
		console.log( client.sessionId, 'Left' );
		this.state.removePlayer( client.sessionId );
	}
	
	onMessage( client: Client, data ) {
		this.state.movePlayer( client.sessionId, data );
	}
	
	onDispose() {
		console.log( 'Dispose MoveRoom' );
	}
	
}
