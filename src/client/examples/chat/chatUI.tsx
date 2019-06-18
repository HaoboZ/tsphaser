import { Button, List, ListItem, ListItemText, TextField, Theme, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { StoreState } from '../../redux/store';
import { ChatState } from './chatReducer';


interface Props extends ChatState {
	theme: Theme
}

// @ts-ignore
@withTheme()
// @ts-ignore
@connect( ( state: StoreState ) => state.chat )
export default class ChatUI extends React.PureComponent<Props> {
	
	state: {
		input: string
	} = {
		input: ''
	};
	
	render() {
		const { theme, room, log } = this.props;
		if ( !room ) return null;
		
		let newLog = [];
		for ( let i = 0; i < 10; ++i )
			newLog[ i ] = log.length >= 10 - i
				? log[ log.length - 10 + i ] : '\xa0';
		
		return <div
			className='pEvents'
			style={{
				width:           'fit-content',
				margin:          'auto',
				marginTop:       50,
				backgroundColor: theme.palette.background.paper
			}}>
			<List>
				{newLog.map( ( item, index ) => {
					return <ListItem key={index}>
						<ListItemText primary={item}/>
					</ListItem>;
				} )}
			</List>
			<div>
				<Typography
					inline
					style={{ margin: 16 }}>
					{room.sessionId}
				</Typography>
				<TextField
					value={this.state.input}
					style={{ margin: 16 }}
					onKeyPress={( ev ) => {
						if ( ev.key === 'Enter' )
							this.sendMessage();
					}}
					onChange={( event ) => {
						this.setState( { input: event.target.value } );
					}}/>
				<Button
					style={{ margin: 16 }}
					onClick={this.sendMessage}>Send</Button>
			</div>
		</div>;
	}
	
	sendMessage = () => {
		if ( !this.state.input.length ) return;
		this.props.room.send( { message: this.state.input } );
		this.setState( { input: '' } );
	};
	
}
