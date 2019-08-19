import { Button, Container, Grid, Paper } from '@material-ui/core';
import { navigate, RouteComponentProps, Router } from '@reach/router';
import * as React from 'react';

import { theme } from '../library/UI';
import ChatUI from './chat';
import MovementUI from './movement';
import TictactoeUI from './tictactoe';


export default function Examples() {
	const Index = ( props: RouteComponentProps ) => <Container className='pEvents center'>
		<Paper>
			<Grid container direction='column' alignItems='center'>
				<Button
					variant='contained'
					style={{ margin: theme.spacing() }}
					onClick={() => {
						navigate( '/chat' );
					}}>
					Chat
				</Button>
				<Button
					variant='contained'
					style={{ margin: theme.spacing(), marginTop: 0 }}
					onClick={() => {
						navigate( '/movement' );
					}}>
					Movement
				</Button>
				<Button
					variant='contained'
					style={{ margin: theme.spacing(), marginTop: 0 }}
					onClick={() => {
						navigate( '/tictactoe' );
					}}>
					Tictactoe
				</Button>
			</Grid>
		</Paper>
	</Container>;
	
	return <Router>
		<Index path='/'/>
		<ChatUI path='chat'/>
		<MovementUI path='movement'/>
		<TictactoeUI path='tictactoe/*'/>
	</Router>;
};
