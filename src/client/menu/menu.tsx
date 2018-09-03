import * as React from 'react';
import Socket from '../connect/socket';
import Interface from '../interface/interface';
import Selection from './selection';
import Queue from './queue';
import Join from './join';
import Create from './create';

export default class Menu extends Phaser.Scene {
	
	constructor() {
		super( 'Menu' );
	}
	
	public create() {
		Socket.init( this.sys.game );
		
		Socket.socket.once( 'join', () => {
		
		} );
		
		Interface.render( <_Menu/> );
	}
	
}

class _Menu extends React.PureComponent {
	
	state = {
		state: 0
	};
	
	render() {
		switch ( this.state.state ) {
		case 0:
			return <Selection switch={( state ) => this.setState( { state } )}/>;
		case 1:
			return <Queue back={() => this.setState( { state: 0 } )}/>;
		case 2:
			return <Join back={() => this.setState( { state: 0 } )}/>;
		case 3:
			return <Create back={() => this.setState( { state: 0 } )}/>
		}
	}
	
}
