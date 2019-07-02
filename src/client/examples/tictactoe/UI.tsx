import { Button, TextField, Typography } from '@material-ui/core';
import { Room } from 'colyseus.js';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Route } from 'react-router-dom';

import { events } from '../../../shared/examples/tictactoeEvents';
import TictactoeRoomState, { Player, playResult } from '../../../shared/examples/tictactoeRoomState';
import Server from '../../connect/server';
import { StoreState } from '../../redux/store';
import Grid from '../../UI/grid';
import TictactoeScene from './game';
import { TictactoeState } from './reducer';


interface InjectedProps extends RouteComponentProps, TictactoeState {
}

// @ts-ignore
@withRouter
// @ts-ignore
@connect( ( state: StoreState ) => state.tictactoe )
export default class TictactoeUI extends React.PureComponent {
	
	props: InjectedProps;
	
	state: {
		room: Room<TictactoeRoomState>
		input: string
		result: string
		showID: boolean
		self: Player
		enemy: Player
	} = {
		room:   null,
		input:  '',
		result: '',
		showID: false,
		self:   { name: '', ready: false } as any,
		enemy:  { name: '', ready: false } as any
	};
	
	render() {
		return <>
			<Route exact path='/' component={this.components.home}/>
			<Route path='/lobby' component={this.components.lobby}/>
			<Route path='/game' component={this.components.game}/>
			<Route path='/over' component={this.components.over}/>
		</>;
	}
	
	private components = {
		home:  () => {
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
		lobby: () => {
			const { room, showID, enemy, self } = this.state;
			
			return <>
				<Grid row='1fr 80% 1fr'>
					<div style={{ display: 'grid', gridRow: '2' }}>
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
					</div>
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
			</>;
		},
		game:  () => {
			const { room, enemy, self } = this.state;
			
			return <>
				<Grid row='1fr 80% 1fr'>
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
				<Button
					variant='contained'
					style={{ position: 'absolute', top: 0 }}
					onClick={() => {
						room.send( { event: events.OVER } );
					}}
				>
					Quit
				</Button>
			</>;
		},
		over:  () => {
			return <Grid className='pEvents' onClick={() => {
				this.props.history.push( '/lobby' );
			}}>
				<Typography variant='h1'>
					{this.state.result}
				</Typography>
			</Grid>;
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
			this.props.history.push( '/lobby' );
		} );
		room.onMessage.add( ( message ) => {
			switch ( message.event ) {
			case events.START:
				this.props.history.push( '/game' );
				break;
			case events.OVER:
				if ( message.state === playResult.TIE ) this.setState( { result: 'It\'s a TIE!' } );
				else if ( room.sessionId === message.winner ) this.setState( { result: 'You WIN!' } );
				else this.setState( { result: 'You LOSE!' } );
				this.props.history.push( '/over' );
				break;
			}
		} );
		room.onLeave.add( () => {
			( this.props.scene as TictactoeScene ).setRoom();
			this.setState( {
				showID: false,
				self:   { name: '', ready: false },
				enemy:  { name: '', ready: false }
			} );
			this.props.history.push( '/' );
		} );
	}
	
}
