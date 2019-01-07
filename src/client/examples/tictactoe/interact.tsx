import * as React from 'react';
import { roomInfo, tictactoeInfo } from '../../../shared/events';
import Socket from '../../connect/socket';
import { Centered } from '../../interface/components';
import TictactoeRoom from './tictactoeRoom';

export default class Interact extends React.Component {
	
	state: {
		room: TictactoeRoom
		playing: boolean
	} = {
		room:    null,
		playing: false
	};
	
	public componentDidMount(): void {
		Socket.events.on( tictactoeInfo.room.join, ( room: TictactoeRoom ) => {
			this.setState( { room } );
			room.events.on( tictactoeInfo.start, () => this.setState( { playing: true } ) );
			room.events.on( tictactoeInfo.over, ( winner ) => {
				console.log( 'Winner is ', this.state.room.clients.get( winner ).clientName );
				this.setState( { playing: false } );
			} );
			room.events.on( roomInfo.leave, () => this.setState( { room: null, playing: false } ) );
		} );
	}
	
	render() {
		let style: React.CSSProperties = { width: 200, height: 64, fontSize: 30 };
		let find = <button style={style} onClick={() => Socket.emit( tictactoeInfo.room.join )}>
			    Find Room
		    </button>,
		    play = <button style={style} onClick={() => this.state.room.emit( tictactoeInfo.start )}>
			    Play
		    </button>,
		    exit = <button style={style} onClick={() => this.state.room.emit( roomInfo.leave )}>
			    Exit
		    </button>;
		
		if ( !this.state.room )
			return <Centered className='pEvents'>{find}</Centered>;
		else if ( !this.state.playing )
			return <Centered className='pEvents flex-column'>{play}{exit}</Centered>;
		else
			return <div className='pEvents'>{exit}</div>
	}
	
}