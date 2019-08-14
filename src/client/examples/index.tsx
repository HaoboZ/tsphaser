import { Button, Container, Grid, Paper } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, withRouter } from 'react-router';

import { StoreState } from '../library/redux/store';
import { theme } from '../library/UI';
import { UIState } from '../library/UI/reducer';
import ChatUI from './chat';
import MovementUI from './movement';
import TictactoeUI from './tictactoe';


interface Props extends RouteComponentProps, UIState {
}

const Examples = withRouter
( connect( ( state: StoreState ) => state.ui )
( function ( props: Props ) {
	return <>
		<Route exact path='/' render={
			() => <Container className='pEvents center'>
				<Paper>
					<Grid container direction='column' alignItems='center'>
						<Button
							variant='contained'
							style={{ margin: theme.spacing() }}
							onClick={() => {
								props.history.push( '/chat' );
							}}>
							Chat
						</Button>
						<Button
							variant='contained'
							style={{ margin: theme.spacing(), marginTop: 0 }}
							onClick={() => {
								props.history.push( '/movement' );
							}}>
							Movement
						</Button>
						<Button
							variant='contained'
							style={{ margin: theme.spacing(), marginTop: 0 }}
							onClick={() => {
								props.history.push( '/tictactoe' );
							}}>
							Tictactoe
						</Button>
					</Grid>
				</Paper>
			</Container>
		}/>
		<Route path='/chat' component={ChatUI}/>
		<Route path='/movement' component={MovementUI}/>
		<Route path='/tictactoe' component={TictactoeUI}/>
	</>;
} ) );
export default Examples;
