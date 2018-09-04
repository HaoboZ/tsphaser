import * as React from 'react';
import { CenterV } from '../interface/components';
import Socket from '../connect/socket';

export default class Queue extends React.Component {
	
	props: {
		back: () => void
	};
	
	state = {
		progress: 0
	};
	
	private interval;
	
	componentDidMount() {
		Socket.socket.emit( 'createNewRoom' );
		
		this.interval = setInterval(
			() => {
				this.setState( { progress: ++this.state.progress } );
				if ( this.state.progress >= 10 ) {
					this.componentWillUnmount();
					this.setState( { progress: -1 } );
				}
			},
			1000 );
	}
	
	componentWillUnmount() {
		clearInterval( this.interval );
		Socket.socket.emit( 'unQueue' );
	}
	
	render() {
		return <CenterV width={300}>
			<div className='row justify-content-end'>
				<button className='btn' onClick={this.props.back}>Cancel</button>
			</div>
			<div className='row justify-content-center'>
				<h3 className='text-white'>
					{this.state.progress !== -1
						? `Joining Game${'..........'.substr( 0, this.state.progress )}`
						: 'Failed to join game'}
				</h3>
			</div>
		</CenterV>;
	}
	
}
