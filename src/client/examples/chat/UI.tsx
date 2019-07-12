import { Button, Container, List, ListItem, ListItemText, Paper, TextField, Typography } from '@material-ui/core';
import { Room } from 'colyseus.js';
import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

import Server from '../../connect/server';
import { StoreState } from '../../redux/store';
import { UIState } from '../../UI/reducer';
import { clearLog, roomMessage } from './actions';
import { ChatState } from './reducer';


interface Props extends DispatchProp, UIState, ChatState {
}

export default connect( ( state: StoreState ) => ( { ...state.ui, ...state.chat } ) )
( function ChatUI( props: Props ) {
	const [ room, setRoom ]   = React.useState<Room>(),
	      [ input, setInput ] = React.useState( '' );
	
	React.useEffect( () => {
		const room = Server.client.join( 'chat' );
		setRoom( room );
		room.onMessage.add( ( message ) => {
			props.dispatch( roomMessage( message ) );
		} );
		
		return () => {
			room.leave();
			props.dispatch( clearLog() );
		};
	}, [] );
	
	if ( !room || !room.hasJoined ) return null;
	
	const sendMessage = () => {
		if ( !input.length ) return;
		room.send( { message: input } );
		setInput( '' );
	};
	
	const components = {
		log:     () => {
			const { log } = props;
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
					{room.sessionId}
				</Typography>
				<TextField
					value={input}
					style={{ gridArea: '2 / 2' }}
					onKeyPress={( ev ) => {
						if ( ev.key === 'Enter' )
							sendMessage();
					}}
					onChange={( event ) => {
						setInput( event.target.value );
					}}/>
				<Button
					variant='contained'
					style={{ gridArea: '2 / 3', justifySelf: 'stretch', alignSelf: 'stretch' }}
					onClick={sendMessage}>
					Send
				</Button>
			</>;
		}
	};
	
	return <Container className='pEvents centerGrid' style={{ gridTemplate: '1fr 80% 1fr / 1fr 50% 1fr' }}>
		<Paper style={{
			display:      'grid',
			gridArea:     '2 / 2',
			gridTemplate: '1fr 50px / 1fr 2fr 1fr'
		}}>
			{components.log()}
			{components.control()}
		</Paper>
	</Container>;
} );
