import { Button, Theme } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import { Room } from 'colyseus.js';
import * as React from 'react';
import { connect } from 'react-redux';

import { events } from '../../../shared/examples/tictactoeEvents';
import TictactoeRoomState, { roomStatus } from '../../../shared/examples/tictactoeRoomState';
import Server from '../../connect/server';
import { StoreState } from '../../redux/store';
import Grid from '../../UI/grid';
import { TictactoeState } from './tictactoeReducer';


interface InjectedProps extends TictactoeState {
	theme: Theme
}

// @ts-ignore
@withTheme
// @ts-ignore
@connect( ( state: StoreState ) => state.tictactoe )
export default class TictactoeUI extends React.Component {
	
	props: InjectedProps;
	
	state: {
		room: Room<TictactoeRoomState>
		status: roomStatus
	} = {
		room:   null,
		status: roomStatus.LOBBY
	};
	
	render() {
		const { theme, scene } = this.props;
		const { room } = this.state;
		
		const style: React.CSSProperties = { width: 200, height: 64, fontSize: 30 };
		const play = <button className='pEvents' style={style} onClick={() => {
			      room.send( { event: events.START } );
		      }}>
			      Play
		      </button>,
		      exit = <button className='pEvents' style={style} onClick={() => {
			      this.setState( { room: null } );
			      room.leave();
		      }}>
			      Exit
		      </button>;
		
		if ( !room ) {
			return <Grid row={1} column={1}>
				<div style={{ display: 'grid' }}>
					<Button
						href=''
						variant='contained'
						onClick={() => {
							const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe' );
							room.onJoin.add( () => {
								room.state.onChange = ( changes ) => {
									for ( const i of changes ) {
										if ( i.field === 'status' )
											this.setState( { status: i.value } );
									}
								};
							} );
							room.onStateChange.addOnce( () => {
								this.setState( { room } );
							} );
							room.onError.add( err => {
								console.log( 'Error:', err );
							} );
						}}>
						Quick Match
					</Button>
					<Button
						href=''
						variant='contained'
						onClick={() => {
							const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe' );
							room.onJoin.add( () => {
								room.state.onChange = ( changes ) => {
									for ( const i of changes ) {
										if ( i.field === 'status' )
											this.setState( { status: i.value } );
									}
								};
							} );
							room.onStateChange.addOnce( () => {
								this.setState( { room } );
							} );
							room.onError.add( err => {
								console.log( 'Error:', err );
							} );
						}}>
						Quick Match
					</Button>
				</div>
			</Grid>;
		} else if ( this.state.status === roomStatus.LOBBY ) {
			return <div>{play}{exit}</div>;
		} else if ( this.state.status === roomStatus.GAME ) {
			return exit;
		} else {
			console.log( 'error' );
			return null;
		}
	}
	
}
