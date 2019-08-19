import { Button, Container, Dialog, DialogTitle, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { RouteComponentProps, Router } from '@reach/router';
import { Room } from 'colyseus.js';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { tictactoeEvents } from '../../../../server/shared/examples/tictactoeEvents';
import TictactoeRoomState, { Player, playResult } from '../../../../server/shared/examples/tictactoeRoomState';
import Connect from '../../library/connect';
import { StoreState } from '../../library/redux/store';
import Scene from './scene';


export default function TictactoeUI( props: RouteComponentProps ) {
	const [ room, setRoom ]     = React.useState<Room>( null ),
	      [ input, setInput ]   = React.useState( '' ),
	      [ result, setResult ] = React.useState( '' ),
	      [ showID, setShowID ] = React.useState( false ),
	      [ self, setSelf ]     = React.useState<Player>( { name: '', ready: false } as any ),
	      [ enemy, setEnemy ]   = React.useState<Player>( { name: '', ready: false } as any ),
	      [ , update ]          = React.useState( 0 ),
	      forceUpdate           = () => update( prev => prev + 1 );
	
	const store = useSelector( ( state: StoreState ) => state.ui );
	const theme = useTheme();
	
	React.useEffect( () => {
		store.game.scene.start( 'Tictactoe' );
		
		return () => {
			const scene = store.game.scene.getScene( 'Tictactoe' ) as Scene;
			scene.scene.stop();
		};
	}, [] );
	
	
	function roomEvents( room: Room<TictactoeRoomState> ) {
		room.onJoin.add( () => {
			( store.game.scene.getScene( 'Tictactoe' ) as Scene ).setRoom( room );
			
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
			props.navigate( 'lobby' );
		} );
		room.onMessage.add( ( message ) => {
			switch ( message.event ) {
				case tictactoeEvents.START:
					props.navigate( 'game' );
					break;
				case tictactoeEvents.OVER:
					if ( message.state === playResult.TIE ) setResult( 'It\'s a TIE!' );
					else if ( room.sessionId === message.winner ) setResult( 'You WIN!' );
					else setResult( 'You LOSE!' );
					props.navigate( 'over' );
					break;
			}
		} );
		room.onLeave.add( () => {
			( store.game.scene.getScene( 'Tictactoe' ) as Scene ).setRoom();
			setShowID( false );
			setSelf( { name: '', ready: false } as any );
			setEnemy( { name: '', ready: false } as any );
			props.navigate( './' );
		} );
	}
	
	const Home  = ( props: RouteComponentProps ) => <Container className='pEvents center'>
		      <Paper>
			      <Grid container direction='column' alignItems='center'>
				      <Button
					      variant='contained'
					      style={{ margin: theme.spacing() }}
					      onClick={() => {
						      const room: Room<TictactoeRoomState> = Connect.client.join( 'tictactoe' );
						      setShowID( false );
						      roomEvents( room );
					      }}>
					      Quick Match
				      </Button>
				      <Button
					      variant='contained'
					      style={{ margin: theme.spacing(), marginTop: 0 }}
					      onClick={() => {
						      const room: Room<TictactoeRoomState> = Connect.client.join( 'tictactoe', { private: true } );
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
							      const room: Room<TictactoeRoomState> = Connect.client.join( 'tictactoe', { id: input } );
							      setShowID( true );
							      roomEvents( room );
						      }
					      }}
					      onChange={( event ) => {
						      setInput( event.target.value );
					      }}/>
			      </Grid>
		      </Paper>
	      </Container>,
	      Lobby = ( props: RouteComponentProps ) => <Container
		      className='pEvents center'
		      style={{ display: 'grid', gridTemplateRows: '1fr 80% 1fr' }}>
		      <Paper style={{ gridRow: '2' }}>
			      <Grid container direction='column'>
				      {showID ? <Typography style={{ margin: theme.spacing() }}>
					      Room ID: {room.id}
				      </Typography> : null}
				      <Button
					      style={{ margin: theme.spacing() }}
					      variant='contained'
					      onClick={() => {
						      room.send( { event: tictactoeEvents.START } );
					      }}>
					      Ready
				      </Button>
				      <Button
					      style={{ margin: theme.spacing(), marginTop: 0 }}
					      variant='contained'
					      onClick={() => {
						      if ( !room )
							      props.navigate( '../' );
						      else
							      room.leave();
					      }}>
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
	      </Container>,
	      Game  = ( props: RouteComponentProps ) => <>
		      <Container className='pEvents center' style={{ display: 'grid', gridTemplateRows: '1fr 80% 1fr' }}>
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
				      if ( !room )
					      props.navigate( '../' );
				      else
					      room.send( { event: tictactoeEvents.OVER } );
			      }}>
			      Quit
		      </Button>
	      </>,
	      Over  = ( props: RouteComponentProps ) => <Dialog
		      open
		      onClose={() => {
			      props.navigate( 'lobby' );
		      }}
		      aria-labelledby='alert-dialog-title'>
		      <DialogTitle id='alert-dialog-title'>{result}</DialogTitle>
	      </Dialog>;
	
	return <Router>
		<Home path='/'/>
		<Lobby path='lobby'/>
		<Game path='game'/>
		<Over path='over'/>
	</Router>;
}
