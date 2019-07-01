import { Button, List, ListItem, ListItemText, TextField, Theme, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../../redux/store';
import Grid from '../../UI/grid';
import { ChatState } from './reducer';


interface InjectedProps extends ChatState {
	theme: Theme
}

// @ts-ignore
@withTheme
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
		const { room, theme } = this.props;
		if ( !room.hasJoined ) return null;
		
		return <Grid row='1fr 80% 1fr' column='1fr 50% 1fr'>
			<Grid style={{
				backgroundColor: theme.palette.background.default,
				gridArea:        '2 / 2'
			}}
			      row='1fr 50px' column='1fr 2fr 1fr'
			      className='pEvents'
			>
				{this.components.log()}
				{this.components.control()}
			</Grid>
		</Grid>;
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
