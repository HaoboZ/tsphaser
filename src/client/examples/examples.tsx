import { Button, Container, Grid, Paper } from '@material-ui/core';
import * as React from 'react';

import store from '../redux/store';
import { setUI } from '../UI/reducer';
import { theme } from '../UI/UI';


export default class Examples extends Phaser.Scene {
	
	constructor() {
		super( 'Examples' );
	}
	
	public create() {
		store.dispatch( setUI( <Container className='pEvents centerGrid'>
			<Paper>
				<Grid container direction='column' alignItems='center'>
					<Button
						variant='contained'
						style={{ margin: theme.spacing() }}
						onClick={() => {
							this.scene.start( 'Chat' );
						}}>
						Chat
					</Button>
					<Button
						variant='contained'
						style={{ margin: theme.spacing() }}
						onClick={() => {
							this.scene.start( 'Movement' );
						}}>
						Movement
					</Button>
					<Button
						variant='contained'
						style={{ margin: theme.spacing() }}
						onClick={() => {
							this.scene.start( 'Tictactoe' );
						}}>
						Tictactoe
					</Button>
				</Grid>
			</Paper>
		</Container> ) );
	}
	
}
