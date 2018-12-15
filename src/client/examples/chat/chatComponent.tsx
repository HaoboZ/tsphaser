import * as React from 'react';
import { chatEvents, roomEvents } from '../../../shared/events';
import RoomGroup from '../../connect/room.group';
import Socket from '../../connect/socket';
import { List } from '../../interface/components';
import ChatRoom from './chatRoom';

export default class ChatComponent extends React.Component {
	
	props: {
		roomId: string,
		password?: string
	};
	
	state: {
		room: ChatRoom,
		input: string
	} = {
		room:  null,
		input: ''
	};
	
	componentDidMount() {
		RoomGroup.join( this.props.roomId, this.props.password );
		Socket.events.on( roomEvents.join, ( room: ChatRoom ) => {
			this.setState( { room } );
			
			room.events.on( chatEvents.message,
				() => this.setState( {} )
			);
		} );
	}
	
	render() {
		if ( !this.state.room ) return null;
		
		let { log } = this.state.room;
		log = new Array( 10 ).fill( null ).concat( log ).slice( -10 );
		
		return <div
			className='border pEvents text-white'
			style={{ width: '50%', height: '80%', fontSize: 26 }}
		>
			<List
				style={{ height: '90%', paddingLeft: 15, paddingRight: 15 }}
				data={log}
				renderItem={( { item, index } ) => <div style={{ height: '10%' }} key={index}>
					{item ? `${item.name ? `${item.name}: ` : ''}${item.message}` : ''}
				</div>}
			/>
			<div className='input-group row' style={{ height: '10%', margin: 0 }}>
				<div className='col-3'>
					{this.state.room.clients[ Socket.socket.id ].clientName}
				</div>
				<input
					className='col-6 text-dark'
					value={this.state.input}
					onChange={( event ) => {
						this.setState( { input: event.target.value } );
					}}
				/>
				<button
					className='col-3 text-dark'
					onClick={() => {
						if ( !this.state.input.length ) return;
						this.state.room.send( this.state.input );
						this.setState( { input: '' } );
					}}
				>
					Send
				</button>
			</div>
		</div>;
	}
	
}
