import { Button, Container, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { withTheme, WithTheme } from '@material-ui/core/styles';
import { Room } from 'colyseus.js';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import { tictactoeEvents } from '../../../shared/examples/tictactoeEvents';
import TictactoeRoomState, { Player, playResult } from '../../../shared/examples/tictactoeRoomState';
import Server from '../../connect/server';
import { StoreState } from '../../redux/store';
import { UIState } from '../../UI/reducer';
import Scene from './scene';


interface Props extends RouteComponentProps, WithTheme, UIState {
}

export default withRouter<any>
( withTheme
( connect( ( state: StoreState ) => state.ui )
( function TictactoeUI( props: Props ) {
	const [ room, setRoom ]     = React.useState<Room>( null ),
	      [ input, setInput ]   = React.useState( '' ),
	      [ result, setResult ] = React.useState( '' ),
	      [ showID, setShowID ] = React.useState( false ),
	      [ self, setSelf ]     = React.useState<Player>( { name: '', ready: false } as any ),
	      [ enemy, setEnemy ]   = React.useState<Player>( { name: '', ready: false } as any ),
	      [ , update ]          = React.useState( 0 ),
	      forceUpdate           = () => update( prev => prev + 1 );
	
	React.useEffect( () => {
		props.game.scene.start( 'Tictactoe' );
		
		return () => {
			const scene = props.game.scene.getScene( 'Tictactoe' ) as Scene;
			scene.scene.stop();
		};
	} );
	
	function roomEvents( room: Room<TictactoeRoomState> ) {
		room.onJoin.add( () => {
			( props.game.scene.getScene( 'Tictactoe' ) as Scene ).setRoom( room );
			
			room.state.players.onAdd = ( player, key ) => {
				if ( room.sessionId === key )
					setSelf( player );
				else
					setEnemy( player );
			};
			room.state.players.onChange = () => {
				forceUpdate();
			};
			room.state.players.onRemove = ( player, key ) => {
				if ( room.sessionId === key )
					setSelf( { name: '', ready: false } as any );
				else
					setEnemy( { name: '', ready: false } as any );
			};
		} );
		room.onStateChange.addOnce( () => {
			setRoom( room );
			props.history.push( `${props.match.url}/lobby` );
		} );
		room.onMessage.add( ( message ) => {
			switch ( message.event ) {
			case tictactoeEvents.START:
				props.history.push( `${props.match.url}/game` );
				break;
			case tictactoeEvents.OVER:
				if ( message.state === playResult.TIE ) setResult( 'It\'s a TIE!' );
				else if ( room.sessionId === message.winner ) setResult( 'You WIN!' );
				else setResult( 'You LOSE!' );
				props.history.push( `${props.match.url}/over` );
				break;
			}
		} );
		room.onLeave.add( () => {
			( props.game.scene.getScene( 'Tictactoe' ) as Scene ).setRoom();
			setShowID( false );
			setSelf( { name: '', ready: false } as any );
			setEnemy( { name: '', ready: false } as any );
			props.history.push( props.match.url );
		} );
	}
	
	const components = {
		home:  () => {
			const { theme } = props;
			
			return <Container className='pEvents centerGrid'>
				<Paper>
					<Grid container direction='column' alignItems='center'>
						<Button
							variant='contained'
							style={{ margin: theme.spacing() }}
							onClick={() => {
								const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe' );
								setShowID( false );
								roomEvents( room );
							}}>
							Quick Match
						</Button>
						<Button
							variant='contained'
							style={{ margin: theme.spacing(), marginTop: 0 }}
							onClick={() => {
								const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe', { private: true } );
								setShowID( true );
								roomEvents( room );
							}}>
							Private Match
						</Button>
						<TextField
							style={{ margin: theme.spacing(), marginTop: 0 }}
							value={input}
							placeholder='Room ID'
							onKeyPress={( ev ) => {
								if ( ev.key === 'Enter' ) {
									const room: Room<TictactoeRoomState> = Server.client.join( 'tictactoe', { id: input } );
									setShowID( true );
									roomEvents( room );
								}
							}}
							onChange={( event ) => {
								setInput( event.target.value );
							}}
						/>
					</Grid>
				</Paper>
			</Container>;
		},
		lobby: () => {
			const { theme } = props;
			
			return <Container className='pEvents centerGrid' style={{ gridTemplateRows: '1fr 80% 1fr' }}>
				<Paper style={{ gridRow: '2' }}>
					<Grid container direction='column' alignItems='center'>
						{showID ? <Typography style={{ margin: theme.spacing() }}>
							Room ID: {room.id}
						</Typography> : null}
						<Button
							style={{ margin: theme.spacing(), marginTop: 0 }}
							variant='contained'
							onClick={() => {
								room.send( { event: tictactoeEvents.START } );
							}}
						>
							Ready
						</Button>
						<Button
							style={{ margin: theme.spacing(), marginTop: 0 }}
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
				props.history.push( `${props.match.url}/lobby` );
			}}>
				<Paper>
					<Typography variant='h1'>
						{result}
					</Typography>
				</Paper>
			</Container>;
		}
	};
	
	return <>
		<Route exact path={props.match.url} component={components.home}/>
		<Route path={`${props.match.url}/lobby`} component={components.lobby}/>
		<Route path={`${props.match.url}/game`} component={components.game}/>
		<Route path={`${props.match.url}/over`} component={components.over}/>
	</>;
} ) ) );
