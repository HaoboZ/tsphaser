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
		Socket.events.on( tictactoeInfo.join, ( room: TictactoeRoom ) => {
			this.setState( { room } );
			
			room.events.on( tictactoeInfo.start, () =>
				this.setState( { playing: true } ) );
			room.events.on( tictactoeInfo.over, () =>
				this.setState( { playing: false } ) );
			room.events.on( roomInfo.leave, () =>
				this.setState( { room: null, playing: false } ) );
		} );
	}
	
	render() {
		const style: React.CSSProperties = { width: 200, height: 64, fontSize: 30 };
		const find = <button className='pEvents' style={style} onClick={() =>
			    Socket.emit( tictactoeInfo.join )}>
			    Find Room
		    </button>,
		    play = <button className='pEvents' style={style} onClick={() =>
			    this.state.room.emit( tictactoeInfo.start, undefined, () =>
				    this.setState( { playing: true } ) )}>
			    Play
		    </button>,
		    exit = <button className='pEvents' style={style} onClick={() =>
			    this.state.room.emit( roomInfo.leave )}>
			    Exit
		    </button>;
		
		if ( !this.state.room )
			return <Centered>{find}</Centered>;
		else if ( !this.state.playing )
			return <Centered className='flex-column'>{play}{exit}</Centered>;
		else
			return <div>{exit}</div>;
	}
	
}