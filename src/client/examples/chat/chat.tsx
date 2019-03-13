import * as React from 'react';
import Socket from '../../connect/socket';
import { Centered } from '../../interface/components';
import Interface from '../../interface/interface';
import ChatComponent from './chatComponent';
import { ChatEvents } from './chatRoom';

export default class Chat extends Phaser.Scene {
	
	constructor() {
		super( 'Chat' );
	}
	
	public create() {
		Socket.multiOn( ChatEvents );
		
		Interface.render( <Centered>
			<div style={{ width: '50%', height: '80%' }}>
				<ChatComponent roomId='chatTest'/>
			</div>
		</Centered> );
	}
	
}
