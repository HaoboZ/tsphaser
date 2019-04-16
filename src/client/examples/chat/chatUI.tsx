import { Room } from 'colyseus.js';
import * as React from 'react';
import { connect } from 'react-redux';
import Server from '../../connect/server';

export default connect( ( store ) => ( store ) )
( class ChatUI extends React.PureComponent {
	
	private room: Room;
	
	// @ts-ignore
	state: {
		log: any
		input: string
	} = {
		input: ''
	};
	
	render() {
		console.log( this.state );
		
		return <div
			className='border pEvents text-white'
			style={{ height: '100%', fontSize: 26 }}
		>
			<div style={{ overflowY: 'scroll', height: '90%', paddingLeft: 15, paddingRight: 15 }}>
				{this.state.log.map( ( item, index ) => (
					<div key={index} style={{ height: 60 }}>{item}</div>
				) )}
			</div>
			<div className='input-group row' style={{ height: '10%', margin: 0 }}>
				<div className='col-3 border text-center align-items-center' style={{ lineHeight: 2 }}>
					{Server.client.id}
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
						this.room.send( { message: this.state.input } );
						this.setState( { input: '' } );
					}}
				>
					Send
				</button>
			</div>
		</div>;
	}
	
} );
