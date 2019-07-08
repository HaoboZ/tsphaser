import { Button, Container, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { withTheme, WithTheme } from '@material-ui/core/styles';
import { Room } from 'colyseus.js';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Route } from 'react-router-dom';

import { tictactoeEvents } from '../../../shared/examples/tictactoeEvents';
import TictactoeRoomState, { Player, playResult } from '../../../shared/examples/tictactoeRoomState';
import Server from '../../connect/server';
import { StoreState } from '../../redux/store';
import { UIState } from '../../UI/reducer';
import Scene from './scene';


interface InjectedProps extends RouteComponentProps, WithTheme, UIState {
}

// @ts-ignore
@withRouter
//@ts-ignore
@withTheme
// @ts-ignore
@connect( ( state: StoreState ) => state.ui )
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
	
	public componentDidMount(): void {
		this.props.game.scene.start( 'Tictactoe' );
	}
	
	public componentWillUnmount(): void {
		const scene = this.props.game.scene.getScene( 'Tictactoe' ) as Scene;
		scene.scene.stop();
	}
	
	render() {
		return <>
			<Route exact path={this.props.match.url} component={this.components.home}/>
			<Route path={`${this.props.match.url}/lobby`} component={this.components.lobby}/>
			<Route path={`${this.props.match.url}/game`} component={this.components.game}/>
			<Route path={`${this.props.match.url}/over`} component={this.components.over}/>
		</>;
	}
	
	private components = {
		home:  () => {
			const { theme } = this.props;
			const { input } = this.state;
			
			return <Container className='pEvents centerGrid'>
				<Paper>
					<Grid container direction='column' alignItems='center'>
						<Button
							variant='contained'
							style={{ margin: theme.spacing() }}
							onClick={() => {
								const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe' );
								this.setState( { showID: false } );
								this.roomEvents( room );
							}}>
							Quick Match
						</Button>
						<Button
							variant='contained'
							style={{ margin: theme.spacing() }}
							onClick={() => {
								const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe', { private: true } );
								this.setState( { showID: true } );
								this.roomEvents( room );
							}}>
							Private Match
						</Button>
						<TextField
							style={{ margin: theme.spacing() }}
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
					</Grid>
				</Paper>
			</Container>;
		},
		lobby: () => {
			const { theme } = this.props;
			const { room, showID, enemy, self } = this.state;
			
			return <Container className='pEvents centerGrid' style={{ gridTemplateRows: '1fr 80% 1fr' }}>
				<Paper style={{ gridRow: '2' }}>
					<Grid container direction='column' alignItems='center'>
						{showID ? <Typography style={{ margin: theme.spacing() }}>
							Room ID: {room.id}
						</Typography> : null}
						<Button
							style={{ margin: theme.spacing() }}
							variant='contained'
							onClick={() => {
								room.send( { event: tictactoeEvents.START } );
							}}
						>
							Ready
						</Button>
						<Button
							style={{ margin: theme.spacing() }}
							variant='contained'
							onClick={() => {
								room.leave();
							}}
						>
							Exit
						</Button>
					</Grid>
				</Paper>
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
			</Container>;
		},
		game:  () => {
			const { room, enemy, self } = this.state;
			
			return <>
				<Container className='pEvents centerGrid' style={{ gridTemplateRows: '1fr 80% 1fr' }}>
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
				</Container>
				<Button
					variant='contained'
					style={{ position: 'absolute', top: 0 }}
					onClick={() => {
						room.send( { event: tictactoeEvents.OVER } );
					}}
				>
					Quit
				</Button>
			</>;
		},
		over:  () => {
			return <Container className='pEvents centerGrid' onClick={() => {
				this.props.history.push( `${this.props.match.url}/lobby` );
			}}>
				<Paper>
					<Typography variant='h1'>
						{this.state.result}
					</Typography>
				</Paper>
			</Container>;
		}
	};
	
	private roomEvents( room: Room<TictactoeRoomState> ) {
		room.onJoin.add( () => {
			( this.props.game.scene.getScene( 'Tictactoe' ) as Scene ).setRoom( room );
			
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
			this.props.history.push( `${this.props.match.url}/lobby` );
		} );
		room.onMessage.add( ( message ) => {
			switch ( message.event ) {
			case tictactoeEvents.START:
				this.props.history.push( `${this.props.match.url}/game` );
				break;
			case tictactoeEvents.OVER:
				if ( message.state === playResult.TIE ) this.setState( { result: 'It\'s a TIE!' } );
				else if ( room.sessionId === message.winner ) this.setState( { result: 'You WIN!' } );
				else this.setState( { result: 'You LOSE!' } );
				this.props.history.push( `${this.props.match.url}/over` );
				break;
			}
		} );
		room.onLeave.add( () => {
			( this.props.game.scene.getScene( 'Tictactoe' ) as Scene ).setRoom();
			this.setState( {
				showID: false,
				self:   { name: '', ready: false },
				enemy:  { name: '', ready: false }
			} );
			this.props.history.push( this.props.match.url );
		} );
	}
	
}
