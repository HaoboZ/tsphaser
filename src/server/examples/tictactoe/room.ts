import { Client, Room } from 'colyseus';

import { events } from '../../../shared/examples/tictactoeEvents';
import TictactoeRoomState, { playResult, roomStatus } from '../../../shared/examples/tictactoeRoomState';


export default class TictactoeRoom extends Room<TictactoeRoomState> {
	
	maxClients = 2;
	
	_private = false;
	
	public requestJoin( options: any, isNew?: boolean ): number | boolean {
		return isNew || !this._private ? !( 'id' in options ) : options.id === this.roomId;
	}
	
	public onInit( options: any ): void {
		console.log( `TictactoeRoom ${this.roomId} created!`, options );
		this._private = options.private;
		
		this.setState( new TictactoeRoomState() );
	}
	
	public onJoin( client: Client ): void | Promise<any> {
		console.log( client.sessionId, 'joined', this.roomId );
		this.state.addPlayer( client.sessionId );
	}
	
	public onLeave( client: Client ): void | Promise<any> {
		console.log( client.sessionId, 'left', this.roomId );
		
		if ( this.state.status === roomStatus.GAME )
			this.broadcast( {
				event:  events.OVER,
				state:  playResult.WIN,
				winner: this.state.cross === client.sessionId ? this.state.circle : this.state.cross
			} );
		
		this.state.removePlayer( client.sessionId );
	}
	
	public onMessage( client: Client, data: any ): void {
		switch ( data.event ) {
		case events.START:
			if ( this.state.toggleReady( client.sessionId ) )
				this.broadcast( { event: events.START }, { afterNextPatch: true } );
			break;
		
		case events.PLAY:
			const result = this.state.playLocation( client.sessionId, data.index );
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
			this.state.players[ this.state.cross ].ready = false;
			this.state.players[ this.state.circle ].ready = false;
			this.state.players[ this.state.cross ].turn = false;
			this.state.players[ this.state.circle ].turn = false;
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