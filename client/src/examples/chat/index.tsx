import { Button, Container, List, ListItem, ListItemText, Paper, TextField, Typography } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import { Room } from 'colyseus.js';
import * as React from 'react';

import Connect from '../../library/connect';


export default function ChatUI( props: RouteComponentProps ) {
	const [ room, setRoom ]   = React.useState<Room>(),
	      [ log, setLog ]     = React.useState( [] ),
	      [ input, setInput ] = React.useState( '' );
	
	React.useEffect( () => {
		let roomRef;
		Connect.client.joinOrCreate( 'chat' ).then( ( room ) => {
			setRoom( room );
			roomRef = room;
			room.onMessage( ( message ) => {
				log.push( message );
				setLog( log );
			} );
			room.onLeave( () => {
				setRoom( null );
				roomRef = null;
			} );
		} );
		
		return () => {
			if ( roomRef ) roomRef.leave();
			setLog( [] );
		};
	}, [] );
	
	if ( !room ) return null;
	
	const sendMessage = () => {
		if ( !input.length ) return;
		room.send( { message: input } );
		setInput( '' );
	};
	
	const components = {
		log:     () => {
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
	
	return <Container className='pEvents center' style={{ gridTemplate: '1fr 80% 1fr / 1fr 50% 1fr' }}>
		<Paper style={{
			display:      'grid',
			gridArea:     '2 / 2',
			gridTemplate: '1fr 50px / 1fr 2fr 1fr'
		}}>
			{components.log()}
			{components.control()}
		</Paper>
	</Container>;
}
