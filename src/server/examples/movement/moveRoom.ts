import { Room } from 'colyseus';
import MoveState from './moveState';


export default class MoveRoom extends Room<MoveState> {
	
	onInit( options ) {
		console.log( 'MoveRoom created!', options );
		this.setState( new MoveState() );
		this.setPatchRate( 1000 / 60 );
	}
	
	onJoin( client ) {
		console.log( client.sessionId, 'Joined' );
		this.state.createPlayer( client.sessionId );
	}
	
	onLeave( client ) {
		console.log( client.sessionId, 'Left' );
		this.state.removePlayer( client.sessionId );
	}
	
	onMessage( client, data ) {
		this.state.movePlayer( client.sessionId, data );
	}
	
	onDispose() {
		console.log( 'Dispose MoveRoom' );
	}
	
}
