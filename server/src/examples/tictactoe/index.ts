import { Client, Room } from 'colyseus';

import { tictactoeEvents } from './tictactoeEvents';
import TictactoeRoomState, { playResult, roomStatus } from './tictactoeRoomState';


export default class Tictactoe extends Room<TictactoeRoomState> {
	
	maxClients = 2;
	
	public onCreate( options: any ): void {
		console.log( `TictactoeRoom ${this.roomId} created!`, options );
		if ( options.private ) {
			this.setPrivate();
		}
		
		this.setState( new TictactoeRoomState() );
	}
	
	onJoin( client: Client ): void | Promise<any> {
		console.log( client.sessionId, 'joined', this.roomId );
		this.state.addPlayer( client.sessionId );
	}
	
	public onLeave( client: Client ): void | Promise<any> {
		console.log( client.sessionId, 'left', this.roomId );
		
		if ( this.state.status === roomStatus.GAME )
			this.broadcast( {
				event:  tictactoeEvents.OVER,
				state:  playResult.WIN,
				winner: this.state.cross === client.sessionId ? this.state.circle : this.state.cross
			} );
		
		this.state.removePlayer( client.sessionId );
	}
	
	public onMessage( client: Client, data: any ): void {
		switch ( data.event ) {
		case tictactoeEvents.START:
			if ( this.state.toggleReady( client.sessionId ) )
				this.broadcast( { event: tictactoeEvents.START }, { afterNextPatch: true } );
			break;
		
		case tictactoeEvents.PLAY:
			const result = this.state.playLocation( client.sessionId, data.index );
			switch ( result ) {
			case playResult.TIE:
				this.broadcast( {
					event: tictactoeEvents.OVER,
					state: playResult.TIE
				} );
				break;
			case playResult.WIN:
				this.broadcast( {
					event:  tictactoeEvents.OVER,
					state:  playResult.WIN,
					winner: client.sessionId
				} );
				break;
			}
			break;
		
		case tictactoeEvents.OVER:
			this.state.players[ this.state.cross ].ready = false;
			this.state.players[ this.state.circle ].ready = false;
			this.state.players[ this.state.cross ].turn = false;
			this.state.players[ this.state.circle ].turn = false;
			this.state.status = roomStatus.LOBBY;
			this.broadcast( {
				event:  tictactoeEvents.OVER,
				state:  playResult.WIN,
				winner: this.state.cross === client.sessionId ? this.state.circle : this.state.cross
			} );
			break;
		}
	}
	
}
