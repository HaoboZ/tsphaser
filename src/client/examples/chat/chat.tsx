import * as React from 'react';
import { Centered } from '../../interface/components';
import Interface from '../../interface/interface';
import ChatComponent from './chatComponent';

export default class Chat extends Phaser.Scene {
	
	constructor() {
		super( 'Chat' );
	}
	
	public create() {
		Interface.render( <Centered>
			<ChatComponent roomId='chatTest'/>
		</Centered> );
	}
	
}
