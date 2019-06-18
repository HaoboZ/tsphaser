import { Client, Room } from 'colyseus';
import { events, state } from '../../../shared/tictactoe';
import TictactoeState from './tictactoeState';


export default class TictactoeRoom extends Room<TictactoeState> {
	
	maxClients = 2;
	
	public onInit( options: any ): void {
		console.log( 'TictactoeRoom created!', options );
		this.setState( new TictactoeState() );
	}
	
	public onJoin( client: Client ): void | Promise<any> {
		console.log( client.sessionId, 'Joined' );
		this.state.createPlayer( client.sessionId );
	}
	
	public onLeave( client: Client ): void | Promise<any> {
		console.log( client.sessionId, 'Left' );
		this.state.removePlayer( client.sessionId );
	}
	
	public onMessage( client: Client, data: any ): void {
		switch ( data.action ) {
		case events.START:
			this.state.players[ client.sessionId ].ready = true;
			if ( this.state.allReady )
				this.state.reset();
			break;
		
		case events.PLAY:
			const res = this.state.playLocation( client.sessionId, data.x, data.y );
			if ( res === state.WIN || res === state.TIE ) {
				for ( const player in this.state.players ) {
					this.state.players[ player ].ready = false;
				}
				if ( res === state.TIE )
					this.broadcast( { action: events.OVER, state: state.TIE } );
				else
					this.broadcast( { action: events.OVER, state: state.WIN, winner: client.sessionId } );
			}
			break;
		}
		
	}
	
}
