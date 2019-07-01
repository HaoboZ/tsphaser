import { Button, Dialog, TextField, Typography } from '@material-ui/core';
import { Room } from 'colyseus.js';
import * as React from 'react';
import { connect } from 'react-redux';

import { events } from '../../../shared/examples/tictactoeEvents';
import TictactoeRoomState, { Player, playResult, roomStatus } from '../../../shared/examples/tictactoeRoomState';
import Server from '../../connect/server';
import { StoreState } from '../../redux/store';
import Grid from '../../UI/grid';
import TictactoeScene from './game';
import { TictactoeState } from './reducer';


interface InjectedProps extends TictactoeState {
}

// @ts-ignore
@connect( ( state: StoreState ) => state.tictactoe )
export default class TictactoeUI extends React.PureComponent {
	
	props: InjectedProps;
	
	state: {
		room: Room<TictactoeRoomState>
		status: roomStatus
		input: string
		result: string
		resultOpen: boolean
		showID: boolean
		self: Player
		enemy: Player
	} = {
		room:       null,
		status:     roomStatus.LOBBY,
		input:      '',
		result:     '',
		resultOpen: false,
		showID:     false,
		self:       { name: '', ready: false } as any,
		enemy:      { name: '', ready: false } as any
	};
	
	render() {
		const { room } = this.state;
		
		return !room ? this.components.joinOptions() : this.components.inRoom();
	}
	
	private components = {
		joinOptions: () => {
			const { input } = this.state;
			
			return <Grid>
				<div style={{ display: 'grid' }}>
					<Button
						variant='contained'
						onClick={() => {
							const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe' );
							this.setState( { showID: false } );
							this.roomEvents( room );
						}}>
						Quick Match
					</Button>
					<Button
						variant='contained'
						onClick={() => {
							const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe', { private: true } );
							this.setState( { showID: true } );
							this.roomEvents( room );
						}}>
						Private Match
					</Button>
					<TextField
						value={input}
						placeholder='Room ID'
						onKeyPress={( ev ) => {
							if ( ev.key === 'Enter' ) {
								const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe', { id: this.state.input } );
								this.setState( { showID: true } );
								this.roomEvents( room );
							}
						}}
						onChange={( event ) => {
							this.setState( { input: event.target.value } );
						}}
					/>
				</div>
			</Grid>;
		},
		inRoom:      () => {
			const { room, status, showID, enemy, self } = this.state;
			
			return <>
				<Dialog open={this.state.resultOpen} onClose={() => {
					this.setState( { resultOpen: false } );
				}}>
					{this.state.result}
				</Dialog>
				<Grid row='1fr 80% 1fr'>
					{status === roomStatus.LOBBY ? <div style={{ display: 'grid', gridRow: '2' }}>
						<Typography>
							{showID ? `Room ID: ${room.id}` : ''}
						</Typography>
						<Button
							variant='contained'
							onClick={() => {
								room.send( { event: events.START } );
							}}
						>
							Ready
						</Button>
						<Button
							variant='contained'
							onClick={() => {
								room.leave();
							}}
						>
							Exit
						</Button>
					</div> : null}
					<Typography style={{
						justifySelf: 'start',
						paddingLeft: 40,
						gridRow:     '3'
					}} color={self.ready ? self.turn ? 'primary' : 'textPrimary' : 'error'}>
						{self.name}
					</Typography>
					<Typography style={{
						justifySelf:  'end',
						paddingRight: 40,
						gridRow:      '1'
					}} color={enemy.ready ? enemy.turn ? 'primary' : 'textPrimary' : 'error'}>
						{enemy.name}
					</Typography>
				</Grid>
				{status === roomStatus.GAME ? <Button
					variant='contained'
					style={{ position: 'absolute', top: 0 }}
					onClick={() => {
						room.send( { event: events.OVER } );
					}}
				>
					Quit
				</Button> : null}
			</>;
		}
	};
	
	private roomEvents( room: Room<TictactoeRoomState> ) {
		room.onJoin.add( () => {
			( this.props.scene as TictactoeScene ).setRoom( room );
			
			room.state.players.onAdd = ( player, key ) => {
				this.setState( { [ room.sessionId === key ? 'self' : 'enemy' ]: player } );
			};
			room.state.players.onChange = () => {
				this.forceUpdate();
			};
			room.state.players.onRemove = ( player, key ) => {
				this.setState( { [ room.sessionId === key ? 'self' : 'enemy' ]: { name: '', ready: false } } );
			};
		} );
		room.onStateChange.addOnce( () => {
			this.setState( { room } );
		} );
		room.onMessage.add( ( message ) => {
			console.log();
			switch ( message.event ) {
			case events.START:
				this.setState( { status: roomStatus.GAME } );
				break;
			case events.OVER:
				this.setState( { status: roomStatus.LOBBY } );
				if ( message.state === playResult.TIE ) this.setState( { result: 'It\'s a TIE!', resultOpen: true } );
				else if ( room.sessionId === message.winner ) this.setState( { result: 'You WIN!', resultOpen: true } );
				else this.setState( { result: 'You LOSE!', resultOpen: true } );
				break;
			}
		} );
		room.onLeave.add( () => {
			( this.props.scene as TictactoeScene ).setRoom();
			this.setState( {
				room:   null,
				status: roomStatus.LOBBY,
				showID: false,
				self:   { name: '', ready: false },
				enemy:  { name: '', ready: false }
			} );
		} );
	}
	
}
