import { Button, Container, Grid, Paper } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, withRouter } from 'react-router';

import { StoreState } from '../redux/store';
import { UIState } from '../UI/reducer';
import { theme } from '../UI/UI';
import ChatUI from './chat/UI';
import MovementUI from './movement/UI';
import TictactoeUI from './tictactoe/UI';


interface InjectedProps extends RouteComponentProps, UIState {
}


//@ts-ignore
@withRouter
//@ts-ignore
@connect( ( state: StoreState ) => state.ui )
export default class Examples extends React.PureComponent {
	
	props: InjectedProps | any;
	
	render() {
		return <>
			<Route exact path='/' render={
				() => <Container className='pEvents centerGrid'>
					<Paper>
						<Grid container direction='column' alignItems='center'>
							<Button
								variant='contained'
								style={{ margin: theme.spacing() }}
								onClick={() => {
									this.props.history.push( '/chat' );
								}}>
								Chat
							</Button>
							<Button
								variant='contained'
								style={{ margin: theme.spacing() }}
								onClick={() => {
									this.props.history.push( '/movement' );
								}}>
								Movement
							</Button>
							<Button
								variant='contained'
								style={{ margin: theme.spacing() }}
								onClick={() => {
									this.props.history.push( '/tictactoe' );
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
	}
	
}
