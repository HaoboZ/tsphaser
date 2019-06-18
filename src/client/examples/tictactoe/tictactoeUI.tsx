import { Theme, withTheme } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import Server from '../../connect/server';
import { StoreState } from '../../redux/store';
import { TictactoeState } from './tictactoeReducer';


interface Props extends TictactoeState {
	theme: Theme
}

// @ts-ignore
@withTheme()
// @ts-ignore
@connect( ( state: StoreState ) => state.tictactoe )
export default class TictactoeUI extends React.Component<Props> {
	
	public componentDidMount(): void {
		
	}
	
	render() {
		const { theme, room, playing } = this.props;
		
		const style: React.CSSProperties = { width: 200, height: 64, fontSize: 30 };
		const find = <button className='pEvents' style={style} onClick={() =>
			      Server.client.join( 'tictactoe' )}>
			      Find Room
		      </button>,
		      play = <button className='pEvents' style={style} onClick={() =>
			      room.send( { action: 'JOIN' } )}>
			      Play
		      </button>,
		      exit = <button className='pEvents' style={style} onClick={() =>
			      room.leave()}>
			      Exit
		      </button>;
		
		if ( !room )
			return <div>{find}</div>;
		else if ( !playing )
			return <div>{play}{exit}</div>;
		else
			return exit;
	}
	
}
