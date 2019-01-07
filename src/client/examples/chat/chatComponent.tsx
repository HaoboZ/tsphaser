import * as React from 'react';
import { chatInfo, roomInfo } from '../../../shared/events';
import Socket from '../../connect/socket';
import { List } from '../../interface/components';
import ChatRoom from './chatRoom';

export default class ChatComponent extends React.Component {
	
	props: {
		roomId: string
	};
	
	state: {
		room: ChatRoom
		input: string
	} = {
		room:  null,
		input: ''
	};
	
	componentDidMount() {
		Socket.emit( roomInfo.join, { roomId: this.props.roomId } );
		Socket.events.on( roomInfo.join, ( room: ChatRoom ) => {
			if ( !( room instanceof ChatRoom ) ) return;
			
			this.setState( { room } );
			
			room.events.on( chatInfo.message,
				() => this.setState( {} )
			);
		} );
	}
	
	render() {
		if ( !this.state.room ) return null;
		
		return <div
			className='border pEvents text-white'
			style={{ height: '100%', fontSize: 26 }}
		>
			<List
				style={{ overflowY: 'scroll', height: '90%', paddingLeft: 15, paddingRight: 15 }}
				data={this.state.room.log}
				renderItem={( { item, index } ) => <div style={{ height: 60 }} key={index}>
					{item ? `${item.clientName ? `${item.clientName}: ` : ''}${item.message}` : ''}
				</div>}
			/>
			<div className='input-group row' style={{ height: '10%', margin: 0 }}>
				<div className='col-3 border text-center align-items-center' style={{ lineHeight: 2 }}>
					{this.state.room.clients.get( Socket.id ).clientName}
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
