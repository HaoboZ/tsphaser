import { Button, Container, List, ListItem, ListItemText, Paper, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../../redux/store';
import { ChatState } from './reducer';


interface InjectedProps extends ChatState {
}

// @ts-ignore
@connect( ( state: StoreState ) => state.chat )
export default class ChatUI extends React.PureComponent {
	
	props: InjectedProps;
	
	state: {
		input: string
	} = {
		input: ''
	};
	
	render() {
		const { room } = this.props;
		if ( !room || !room.hasJoined ) return null;
		
		return <Container className='pEvents centerGrid' style={{ gridTemplate: '1fr 80% 1fr / 1fr 50% 1fr' }}>
			<Paper style={{
				display:      'grid',
				gridArea:     '2 / 2',
				gridTemplate: '1fr 50px / 1fr 2fr 1fr'
			}}>
				{this.components.log()}
				{this.components.control()}
			</Paper>
		</Container>;
	}
	
	private components = {
		log:     () => {
			const { log } = this.props;
			let newLog = [];
			for ( let i = 0; i < 10; ++i )
				newLog[ i ] = log.length >= 10 - i
					? log[ log.length - 10 + i ] : '\xa0';
			
			return <List style={{ gridArea: '1 / 1 / auto / span 3', justifySelf: 'start' }}>
				{newLog.map( ( item, index ) => {
					return <ListItem key={index}>
						<ListItemText primary={item}/>
					</ListItem>;
				} )}
			</List>;
		},
		control: () => {
			return <>
				<Typography style={{ gridArea: '2 / 1' }} align='center'>
					{this.props.room.sessionId}
				</Typography>
				<TextField
					value={this.state.input}
					style={{ gridArea: '2 / 2' }}
					onKeyPress={( ev ) => {
						if ( ev.key === 'Enter' )
							this.sendMessage();
					}}
					onChange={( event ) => {
						this.setState( { input: event.target.value } );
					}}/>
				<Button
					variant='contained'
					style={{ gridArea: '2 / 3', justifySelf: 'stretch', alignSelf: 'stretch' }}
					onClick={this.sendMessage}>
					Send
				</Button>
			</>;
		}
	};
	
	private sendMessage = () => {
		if ( !this.state.input.length ) return;
		this.props.room.send( { message: this.state.input } );
		this.setState( { input: '' } );
	};
	
}
