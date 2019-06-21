import { Client, Room } from 'colyseus';

import { events } from '../../../shared/examples/tictactoeEvents';
import TictactoeRoomState, { playResult, roomStatus } from '../../../shared/examples/tictactoeRoomState';


export default class TictactoeRoom extends Room<TictactoeRoomState> {
	
	maxClients = 2;
	
	public onInit( options: any ): void {
		console.log( 'TictactoeRoom created!', options );
		this.setState( new TictactoeRoomState() );
	}
	
	public onJoin( client: Client ): void | Promise<any> {
		console.log( client.sessionId, 'Joined' );
		this.state.addPlayer( client.sessionId );
	}
	
	public onLeave( client: Client ): void | Promise<any> {
		console.log( client.sessionId, 'Left' );
		this.state.removePlayer( client.sessionId );
		this.state.status = roomStatus.LOBBY;
	}
	
	public onMessage( client: Client, data: any ): void {
		switch ( data.event ) {
		case events.START:
			if ( this.state.addReady( client.sessionId ) )
				this.broadcast( { event: events.START }, { afterNextPatch: true } );
			break;
		
		case events.PLAY:
			const result = this.state.playLocation( client.sessionId, data.x, data.y );
			switch ( result ) {
			case playResult.TIE:
				this.broadcast( {
					event: events.OVER,
					state: playResult.TIE
				} );
				break;
			case playResult.WIN:
				this.broadcast( {
					event:  events.OVER,
					state:  playResult.WIN,
					winner: client.sessionId
				} );
				break;
			}
			break;
		
		case events.OVER:
			this.state.status = roomStatus.LOBBY;
			this.broadcast( {
				event:  events.OVER,
				state:  playResult.WIN,
				winner: this.state.cross === client.sessionId ? this.state.circle : this.state.cross
			} );
			break;
		}
	}
	
}
